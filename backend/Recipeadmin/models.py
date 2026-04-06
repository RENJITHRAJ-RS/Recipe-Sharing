from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


# =========================
# USER MANAGER
# =========================
class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError("Email is required")

        user = self.model(
            email=self.normalize_email(email)
        )
        user.set_password(password)
        user.is_active = True
        user.save(using=self._db)
        return user


# =========================
# USER MODEL
# =========================
class User(AbstractBaseUser):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"

    def __str__(self):
        return self.email


# =========================
# RECIPE MODEL
# =========================
class Recipe(models.Model):
    DIFFICULTY_CHOICES = (
        ("easy", "Easy"),
        ("medium", "Medium"),
        ("hard", "Hard"),
    )

    title = models.CharField(max_length=200)
    ingredients = models.TextField()
    steps = models.TextField()
    cooking_time = models.IntegerField()
    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES
    )

    image = models.ImageField(
        upload_to="recipes/",
        null=True,
        blank=True
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="recipes"
    )

    view_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
