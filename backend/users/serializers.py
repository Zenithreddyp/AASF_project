from django.contrib.auth.models import User
from rest_framework import serializers,validators

from cart.serializers import OrdersSerializers, WishlistSerializer #compulsory becoz of serilizer 
from .models import ShippingAddress, VendorUser
import requests

class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model =VendorUser
        fields = ["id","user","shop_name","phone_number","address","GSTIN"]
        extra_kwargs = {"user": {"read_only": True}}

    def create(self, validated_data):
        user = self.context["request"].user
        vendor = VendorUser.objects.create(user=user,**validated_data)
        return vendor
    


class UserSerializer(serializers.ModelSerializer):

    username=serializers.CharField(
        max_length=150,validators=[validators.UniqueValidator(queryset=User.objects.all(),message="This user name already taken.")]
    )

    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class ChangePasswordSerializer(serializers.Serializer):   
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_old_password(self,value):
        user=self.context["request"].user
        if user.check_password(value):
            return value
        raise serializers.ValidationError("Prev password is incorrect.")
    
    def save(self,*args, **kwargs):
        user=self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user



class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = ["id","full_name", "phone_number","postal_code","address","city","state", "created_at",]
        extra_kwargs = {"created_at": {"read_only": True}}
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    # full_name = models.CharField(max_length=100)
    # phone_number = models.CharField(max_length=10)
    # address = models.TextField()
    # city = models.CharField(max_length=50)
    # state = models.CharField(max_length=50)
    # postal_code = models.CharField(max_length=6)
    # created_at = models.DateTimeField(auto_now_add=True)
    # is_default = models.BooleanField(default=False)
        
    # def validate_postal_code(self, value):
    #     try:
    #         response = requests.get(f"https://api.postalpincode.in/pincode/{value}", timeout=5)
    #     except:
    #         raise serializers.ValidationError("Could not connect")

    #     if response.status_code != 200:
    #         raise serializers.ValidationError("couldnt fetching PIN code info")

    #     data = response.json()
    #     if data[0]["Status"] != "Success" or not data[0]["PostOffice"]:
    #         raise serializers.ValidationError("please enter valid  PIN code")

    #     self.post_office_info = data[0]["PostOffice"][0]

    #     return value

    # def validate(self, attrs):
    #     if hasattr(self, "post_office_info"):
    #         post_office = self.post_office_info
    #         if not attrs.get("city"):
    #             attrs["city"] = post_office.get("District")
    #         if not attrs.get("state"):
    #             attrs["state"] = post_office.get("State")
    #     return attrs


# class UserDetailsSerializer(serializers.Serializer):
#     orders = OrdersSerializers(many=True)
#     wishlist = WishlistSerializer(many=True)
#     addresses = ShippingAddressSerializer(many=True)



class UsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']