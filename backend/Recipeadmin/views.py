from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
import rest_framework.permissions as permissions
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from .permissions import IsAdminUserCustom

from .models import User, Recipe
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    RecipeSerializer
)

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
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=400)

        if not user.check_password(password):
            return Response({"error": "Invalid credentials"}, status=400)

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "token": token.key,
            "user_id": user.id,
            "name": user.name,
            "email": user.email
        })


# ================= ADD RECIPE =================
class AddRecipeView(APIView):
    permission_classes = [IsAuthenticated]

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
        data = RecipeSerializer(recipes, many=True).data

        # 🔥 FIX RESPONSE FOR FRONTEND UI
        for recipe in data:
            obj = Recipe.objects.get(id=recipe["id"])
            recipe["author"] = obj.created_by.name if obj.created_by else "Unknown"
            recipe["views"] = obj.view_count
            recipe["image"] = obj.image.url if obj.image else None

        return Response(data)


# ================= MY RECIPES =================
class MyRecipeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        recipes = Recipe.objects.filter(created_by=request.user)
        data = RecipeSerializer(recipes, many=True).data

        for recipe in data:
            obj = Recipe.objects.get(id=recipe["id"])
            recipe["author"] = "You"
            recipe["views"] = obj.view_count
            recipe["image"] = obj.image.url if obj.image else None

        return Response(data)


# ================= RECIPE DETAILS =================
class RecipeDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            recipe = Recipe.objects.get(id=pk)
        except Recipe.DoesNotExist:
            return Response({"error": "Recipe not found"}, status=404)

        # 🔥 INCREASE VIEW COUNT
        recipe.view_count += 1
        recipe.save()

        data = RecipeSerializer(recipe).data

        # 🔥 FIX FOR FRONTEND
        data["author"] = recipe.created_by.name if recipe.created_by else "Unknown"
        data["views"] = recipe.view_count
        data["image"] = recipe.image.url if recipe.image else None

        return Response(data)

# ================= EDIT RECIPE =================
class EditRecipeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request, pk):
        recipe = get_object_or_404(
            Recipe,
            pk=pk,
            created_by=request.user
        )

        serializer = RecipeSerializer(
            recipe,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)

        print(serializer.errors)  # 🔥 DEBUG
        return Response(serializer.errors, status=400)

# ================= DELETE RECIPE =================
class DeleteRecipeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        recipe = get_object_or_404(Recipe, pk=pk, created_by=request.user)
        recipe.delete()
        return Response({"message": "Recipe deleted successfully"}, status=204)
    
class AdminLoginView(APIView):
        
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            user = User.objects.get(email=email, is_admin=True)
        except User.DoesNotExist:
            return Response(
                {"error": "Admin not found"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.check_password(password):
            return Response(
                {"error": "Invalid password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {"error": "Admin account disabled"},
                status=status.HTTP_403_FORBIDDEN
            )

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "token": token.key,
            "admin_id": user.id,
            "name": user.name
        })

class AdminUserListView(APIView):
    permission_classes = [IsAdminUserCustom]

    def get(self, request):
        users = User.objects.all()
        data = [{
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "is_active": u.is_active
        } for u in users]
        return Response(data)