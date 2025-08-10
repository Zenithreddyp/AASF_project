from django.contrib.auth.models import User
from rest_framework import serializers  #compulsory becoz of serilizer 


from .models import Cart,Cartitem,Orders, OrderItem,Wishlist, WishlistItem
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
        extra_kwargs = {
            "total_price": {"required": False},
            "shipping_address": {"required": False},
            "cart": {"required": False},
            "user": {"required": False},
            "total_price":{"read_only":True},
        }

class OrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Products.objects.all(),
        source="product",
        write_only=True
    )
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["product_id", "product_name", "quantity", "price"]
        extra_kwargs = {
            "price": {"required": True},
        }


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, write_only=True)

    class Meta:
        model = Orders
        fields = [
            "id", "full_name", "phone_number", "shipping_address", "city", "state", "postal_code",
            "total_price", "items", "razorpay_payment_id", "razorpay_order_id", "razorpay_signature"
        ]
        read_only_fields = ["user", "status"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        user = self.context["request"].user
        
        order = Orders.objects.create(user=user, status="Pending", **validated_data)

        for item_data in items_data:
            product = item_data.pop("product")
            quantity = item_data.get("quantity")
            price_at_purchase = item_data.get("price")

            if product.stock < quantity:
                raise serializers.ValidationError(f"Not enough stock for {product.name}.")
            product.stock -= quantity
            product.save()

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                price=price_at_purchase,
                quantity=quantity
            )

        return order
    
class OrderReadSerializer(serializers.ModelSerializer):
        items = OrderItemSerializer(many=True, read_only=True)
        class Meta:
            model = Orders
            fields = "__all__"



class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True) #read only kosam
    product_id = serializers.PrimaryKeyRelatedField( #post put kosam
        queryset=Products.objects.all(),
        write_only=True,
        source="product",
    )

    class Meta:
        model = WishlistItem
        fields = ["id", "wishlist", "product", "product_id"]
        extra_kwargs = {"wishlist": {"read_only": True}}


class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ["user","items"]
        extra_kwargs = {"user": {"read_only": True}}
