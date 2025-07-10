from django.contrib.auth.models import User
from rest_framework import serializers #compulsory becoz of serilizer 
from .models import ShippingAddress
import requests

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user




class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = ["id", "phone_number","postal_code","address","town","city","state", "created_at",]
        extra_kwargs = {"created_at": {"read_only": True}}
        
    def validate_postal_code(self, value):
        try:
            response = requests.get(f"https://api.postalpincode.in/pincode/{value}", timeout=5)
        except:
            raise serializers.ValidationError("Could not connect")

        if response.status_code != 200:
            raise serializers.ValidationError("couldnt fetching PIN code info")

        data = response.json()
        if data[0]["Status"] != "Success" or not data[0]["PostOffice"]:
            raise serializers.ValidationError("please enter valid  PIN code")

        self.post_office_info = data[0]["PostOffice"][0]

        return value

    def validate(self, attrs):
        if hasattr(self, "post_office_info"):
            post_office = self.post_office_info
            if not attrs.get("city"):
                attrs["city"] = post_office.get("District")
            if not attrs.get("state"):
                attrs["state"] = post_office.get("State")
        return attrs