# ================= IMPORTS =================
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, permissions
from rest_framework.authtoken.models import Token
from rest_framework.parsers import MultiPartParser, FormParser

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q, Count, Sum

from .models import User, Recipe
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    RecipeSerializer,
)

# =====================================================
# ===================== API SECTION ====================
# =====================================================

# ================= REGISTER =================
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)

            return Response({
                "token": token.key,
                "user_id": user.id,
                "name": user.name,
                "email": user.email
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ================= LOGIN =================
# In your LoginView, use the serializer like this:
class LoginView(APIView):

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(request, email=email, password=password)

        if user is None:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_400_BAD_REQUEST
            )

        token, created = Token.objects.get_or_create(user=user)

        return Response({
            "token": token.key,
            "user_id": user.id,
            "name": user.name,
            "email": user.email
        })
# ================= ADD RECIPE =================
class AddRecipeView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = RecipeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


# ================= ALL RECIPES =================
class RecipeListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        recipes = Recipe.objects.all().order_by("-created_at")
        serializer = RecipeSerializer(recipes, many=True)
        data = serializer.data

        # Fix response for frontend
        for item in data:
            recipe_obj = Recipe.objects.get(id=item["id"])
            item["author"] = recipe_obj.created_by.name if recipe_obj.created_by else "Unknown"
            item["views"] = recipe_obj.view_count
            item["image"] = recipe_obj.image.url if recipe_obj.image else None

        return Response(data)


# ================= MY RECIPES =================
class MyRecipeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        recipes = Recipe.objects.filter(created_by=request.user)
        serializer = RecipeSerializer(recipes, many=True)
        data = serializer.data

        for item in data:
            recipe_obj = Recipe.objects.get(id=item["id"])
            item["author"] = "You"
            item["views"] = recipe_obj.view_count
            item["image"] = recipe_obj.image.url if recipe_obj.image else None

        return Response(data)


# ================= RECIPE DETAIL =================
class RecipeDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        recipe = get_object_or_404(Recipe, id=pk)

        # Increase view count
        recipe.view_count += 1
        recipe.save()

        serializer = RecipeSerializer(recipe)
        data = serializer.data

        data["author"] = recipe.created_by.name if recipe.created_by else "Unknown"
        data["views"] = recipe.view_count
        data["image"] = recipe.image.url if recipe.image else None

        return Response(data)


# ================= EDIT RECIPE =================
class EditRecipeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request, pk):
        recipe = get_object_or_404(Recipe, id=pk, created_by=request.user)

        serializer = RecipeSerializer(
            recipe,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        print("SERIALIZER ERRORS:", serializer.errors) 
        return Response(serializer.errors, status=400)

# ================= DELETE RECIPE =================
class DeleteRecipeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        recipe = get_object_or_404(Recipe, id=pk, created_by=request.user)
        recipe.delete()
        return Response({"message": "Recipe deleted successfully"}, status=204)


# =====================================================
# ================= ADMIN TEMPLATE SECTION =============
# =====================================================

# ================= ADMIN LOGIN =================
def admin_login(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        try:
            user = User.objects.get(email=email, is_superuser=True)
        except User.DoesNotExist:
            messages.error(request, "Admin not found")
            return redirect("admin_login")

        if not user.check_password(password):
            messages.error(request, "Invalid password")
            return redirect("admin_login")

        login(request, user)
        messages.success(request, f"Welcome back, {user.name or user.email}!")
        return redirect("recipelisting")

    return render(request, "adminlogin.html")


# ================= RECIPE LISTING (MAIN ADMIN PAGE) =================
@login_required(login_url='admin_login')
def recipe_listing(request):
    # Check if user is admin
    if not request.user.is_superuser:
        messages.error(request, "Access denied. Admin only.")
        return redirect('admin_login')
    
    # Get all recipes with author info
    recipes = Recipe.objects.select_related('created_by').all().order_by("-id")
    
    # Search functionality
    search_query = request.GET.get('search', '')
    if search_query:
        recipes = recipes.filter(
            Q(title__icontains=search_query) |
            Q(created_by__name__icontains=search_query) |
            Q(created_by__email__icontains=search_query)
        )
    
    context = {
        "recipes": recipes,
        "search_query": search_query,
        "total_recipes": recipes.count()
    }
    return render(request, "recipelisting.html", context)


# ================= RECIPE DETAIL (ADMIN) =================
@login_required(login_url='admin_login')
def recipe_detail(request, id):
    if not request.user.is_superuser:
        messages.error(request, "Access denied. Admin only.")
        return redirect('admin_login')
    
    recipe = get_object_or_404(Recipe, id=id)
    return render(request, "recipedetail.html", {"recipe": recipe})


# ================= DELETE RECIPE (ADMIN) =================
@login_required(login_url='admin_login')
def recipe_delete(request, id):
    if not request.user.is_superuser:
        messages.error(request, "Access denied. Admin only.")
        return redirect('admin_login')
    
    recipe = get_object_or_404(Recipe, id=id)
    recipe_title = recipe.title
    recipe.delete()
    messages.success(request, f'Recipe "{recipe_title}" deleted successfully!')
    return redirect("recipelisting")


# ================= USER LISTING (ADMIN) =================
@login_required(login_url='admin_login')
def user_listing(request):
    if not request.user.is_superuser:
        messages.error(request, "Access denied. Admin only.")
        return redirect('admin_login')
    
    # 🔥 Hide admin users
    users = User.objects.filter(is_superuser=False).order_by('-id')
    
    search_query = request.GET.get('search', '')
    if search_query:
        users = users.filter(
            Q(name__icontains=search_query) |
            Q(email__icontains=search_query)
        )
    
    context = {
        "users": users,
        "search_query": search_query,
        "total_users": users.count()
    }
    return render(request, "userlisting.html", context)


# ================= USER PROFILE (ADMIN) =================
@login_required(login_url='admin_login')
def user_profile(request, id):
    if not request.user.is_superuser:
        messages.error(request, "Access denied. Admin only.")
        return redirect('admin_login')
    
    user = get_object_or_404(User, id=id)
    recipes = Recipe.objects.filter(created_by=user).order_by('-created_at')
    
    # Get recipe counts and total views
    total_recipes = recipes.count()
    total_views = sum(recipe.view_count for recipe in recipes)
    
    return render(request, "userprofile.html", {
        "profile_user": user,
        "recipes": recipes,
        "total_recipes": total_recipes,
        "total_views": total_views
    })


# ================= TOGGLE USER STATUS (BLOCK/UNBLOCK) =================
@login_required(login_url='admin_login')
def toggle_user_status(request, id):
    if not request.user.is_superuser:
        messages.error(request, "Access denied. Admin only.")
        return redirect('admin_login')
    
    user = get_object_or_404(User, id=id)
    
    # Don't allow blocking yourself
    if user.id == request.user.id:
        messages.error(request, "You cannot block/unblock yourself!")
        return redirect('userlisting')
    
    # Toggle status
    user.is_active = not user.is_active
    user.save()
    
    status = "unblocked" if user.is_active else "blocked"
    messages.success(request, f"User {user.email} has been {status}.")
    
    return redirect('userlisting')


# ================= MOST VIEWED RECIPES REPORT =================
@login_required(login_url='admin_login')
def most_viewed_recipes(request):
    if not request.user.is_superuser:
        messages.error(request, "Access denied. Admin only.")
        return redirect('admin_login')
    
    recipes = Recipe.objects.select_related('created_by').all().order_by('-view_count')[:50]
    
    # Calculate statistics
    total_users = User.objects.count()
    total_recipes = Recipe.objects.count()
    total_views = Recipe.objects.aggregate(total=Sum('view_count'))['total'] or 0
    active_users = User.objects.filter(is_active=True).count()
    
    context = {
        "recipes": recipes,
        "total_users": total_users,
        "total_recipes": total_recipes,
        "total_views": total_views,
        "active_users": active_users,
        "top_recipes": recipes,
    }
    return render(request, "recipereport.html", context)


# ================= ADMIN DASHBOARD (Optional) =================
@login_required(login_url='admin_login')
def admin_dashboard(request):
    if not request.user.is_superuser:
        messages.error(request, "Access denied. Admin only.")
        return redirect('admin_login')
    
    # Get statistics
    total_users = User.objects.count()
    total_recipes = Recipe.objects.count()
    total_views = Recipe.objects.aggregate(total=Sum('view_count'))['total'] or 0
    
    recent_recipes = Recipe.objects.select_related('created_by').order_by('-created_at')[:5]
    # FIXED: Changed from '-date_joined' to '-id'
    recent_users = User.objects.order_by('-id')[:5]
    
    # Most viewed recipes
    popular_recipes = Recipe.objects.select_related('created_by').order_by('-view_count')[:5]
    
    context = {
        'total_users': total_users,
        'total_recipes': total_recipes,
        'total_views': total_views,
        'recent_recipes': recent_recipes,
        'recent_users': recent_users,
        'popular_recipes': popular_recipes,
    }
    return render(request, 'admin_dashboard.html', context)


# ================= ADMIN LOGOUT =================
@login_required(login_url='admin_login')
def admin_logout(request):
    logout(request)
    messages.success(request, "Logged out successfully!")
    return redirect("admin_login")