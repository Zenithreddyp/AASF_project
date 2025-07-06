from django.contrib.auth.models import User
from rest_framework import serializers #compulsory becoz of serilizer 
from .models import ShippingAddress

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


# class CustomerProfileSerializer(serializers.ModelSerializer):
#     user = UserSerializer()  # nested

#     class Meta:
#         model = CustomerProfile
#         fields = ["user", "phonenumber", "address"]

#     def create(self, validated_data):
#         user_data=validated_data.pop("user")
#         user = User.objects.create_user(**user_data) #Creates a new Django User using the extracted data.
#         profile = CustomerProfile.objects.create(user=user,**validated_data)
#         return profile

#     def validate_phonenumber(self, value):
#         if not value.isdigit():
#             raise serializers.ValidationError("Phone number must contain only digits.")
#         if len(value) != 10:
#             raise serializers.ValidationError("Phone number must be between 10.")
#         return value
    

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = ["id", "phone_number", "address", "city", "postal_code", "created_at"]
        extra_kwargs = {"created_at": {"read_only": True}}
        