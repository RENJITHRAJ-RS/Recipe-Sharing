from django.contrib import admin
from .models import User, Recipe


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "name", "is_staff", "is_active")
    search_fields = ("email", "name")


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "difficulty",
        "created_by",
        "created_at",
        "view_count",
    )

    list_filter = ("difficulty", "created_at")
    search_fields = ("title",)