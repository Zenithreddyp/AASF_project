from django.contrib.auth.models import User
from rest_framework import serializers #compulsory becoz of serilizer 
from .models import Cart,Cartitem,Orders
import requests




class CartitemSerializers(serializers.ModelSerializer):
    class Meta:
        model = Cartitem
        fields = ["product", "quantity", "total_price"]
        extra_kwargs={"total_price":{"read_only":True}}

    
class CartSerializers(serializers.ModelSerializer):                                
    class Meta:
        model = Cart
        fields = ["id", "user", "created_at", "is_ordered",]
        extra_kwargs = {"user": {"read_only": True}}



class OrdersSerializers(serializers.ModelSerializer):
    class Meta:
        model = Orders
        fields = "__all__"

