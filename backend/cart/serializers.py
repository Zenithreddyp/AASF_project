from django.contrib.auth.models import User
from rest_framework import serializers  #compulsory becoz of serilizer 


from .models import Cart,Cartitem,Orders
from products.serializers import ProductSerializer
import requests
from products.models import Products



class CartitemSerializers(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id= serializers.PrimaryKeyRelatedField(
        queryset=Products.objects.all(),
        write_only=True,
        source="product",
    )
    # cart_id = serializers.PrimaryKeyRelatedField(
    # queryset=Cart.objects.all(),
    # write_only=True,
    # source="cart",
    # required=False
    # )

    class Meta:
        model = Cartitem
        fields = ["id","product","product_id", "quantity", "total_price",]
        extra_kwargs={"total_price":{"read_only":True}}



    
class CartSerializers(serializers.ModelSerializer):  
    items = CartitemSerializers(many=True, read_only=True)
                              
    class Meta:
        model = Cart
        fields = ["id", "user", "created_at", "is_ordered","items"]
        extra_kwargs = {"user": {"read_only": True}}



class OrdersSerializers(serializers.ModelSerializer):
    class Meta:
        model = Orders
        fields = "__all__"

