from django.db import models
from django.contrib.auth.models import User
from users.models import VendorUser
# Create your models here.

class Products(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name='products',null=True,blank=True)  
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    category = models.CharField(max_length=50)
    brand = models.CharField(max_length=50)
    rating = models.DecimalField(max_digits=2, decimal_places=1)

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')

    def __str__(self):
        return f"Image for {self.product.name}"