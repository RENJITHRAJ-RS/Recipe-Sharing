from django.urls import path
from . import views
from .views import (
    RegisterView,
    LoginView,
    AddRecipeView,
    RecipeListView,
    RecipeDetailView,
    EditRecipeView,
    DeleteRecipeView,
)

urlpatterns = [

    # ============================
    # 🔥 API ROUTES
    # ============================
    path("register/", RegisterView.as_view(), name="api_register"),
    path("api/login/", LoginView.as_view(), name="api_login"),
    path("recipes/add/", AddRecipeView.as_view(), name="api_add_recipe"),
    path("recipes/", RecipeListView.as_view(), name="api_recipe_list"),
    path("recipes/<int:pk>/", RecipeDetailView.as_view(), name="api_recipe_detail"),
    path("recipes/edit/<int:pk>/", EditRecipeView.as_view(), name="api_edit_recipe"),
    path("recipes/delete/<int:pk>/", DeleteRecipeView.as_view(), name="api_delete_recipe"),
    path("my-recipes/", views.MyRecipeView.as_view(), name="api_my_recipes"),

    # ============================
    # 👑 ADMIN TEMPLATE ROUTES
    # ============================

    # Admin Login
    path("", views.admin_login, name="admin_login"),
    path("adminlogin/", views.admin_login, name="admin_login"),

    # Recipe Management
    path("recipelisting/", views.recipe_listing, name="recipelisting"),
    path("recipe/<int:id>/", views.recipe_detail, name="recipedetail"),
    path("recipe/<int:id>/delete/", views.recipe_delete, name="recipe_delete"),

    # User Management
    path("userlisting/", views.user_listing, name="userlisting"),
    path("user/<int:id>/", views.user_profile, name="userprofile"),
    path("user/<int:id>/toggle-status/", views.toggle_user_status, name="toggle_user_status"),

    # Reports
    path("recipereport/", views.most_viewed_recipes, name="recipereport"),

    # Logout
    path("admin-logout/", views.admin_logout, name="admin_logout"),
]