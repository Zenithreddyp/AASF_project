from django.contrib.auth.models import User
from rest_framework import serializers #compulsory becoz of serilizer 
from .models import Products
import requests

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = "__all__"
        
