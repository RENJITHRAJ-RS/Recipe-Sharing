from django.contrib import admin
from .models import User, Recipe


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "name", "is_staff")
    search_fields = ("email", "name")


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "difficulty", "created_by", "created_at")
    list_filter = ("difficulty",)
    search_fields = ("title",)
