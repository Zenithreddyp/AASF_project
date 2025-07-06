from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# class CustomerProfile(models.Model):
#     user = models.OneToOneField(User,on_delete=models.CASCADE)
#     # phonenumber=models.CharField(max_length=10)
#     # address=models.TextField()



class ShippingAddress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=10)
    address = models.TextField()
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)