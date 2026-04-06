from django.urls import path
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
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),

    path("recipes/add/", AddRecipeView.as_view()),
    path("recipes/", RecipeListView.as_view()),
    path("recipes/<int:pk>/", RecipeDetailView.as_view()),

    # ✅ THESE TWO MUST EXIST
    path("recipes/edit/<int:pk>/", EditRecipeView.as_view()),
    path("recipes/delete/<int:pk>/", DeleteRecipeView.as_view()),
]
