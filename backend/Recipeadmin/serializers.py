from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import User, Recipe


# ---------- REGISTER ----------
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User(
            name=validated_data['name'],
            email=validated_data['email'],
            password=make_password(validated_data['password']),
            is_active=True
        )
        user.save()
        return user


# ---------- LOGIN ----------
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


# ---------- RECIPE ----------
# ---------- RECIPE ----------
class RecipeSerializer(serializers.ModelSerializer):

    difficulty = serializers.CharField(required=False)

    class Meta:
        model = Recipe
        fields = '__all__'
        read_only_fields = ['id', 'created_by', 'created_at', 'view_count']

    def validate_difficulty(self, value):
        if value:
            value = value.lower()
            if value not in ['easy', 'medium', 'hard']:
                raise serializers.ValidationError("Invalid difficulty level")
        return value

    def update(self, instance, validated_data):
        validated_data['difficulty'] = validated_data.get(
            'difficulty', instance.difficulty
        )

        return super().update(instance, validated_data)