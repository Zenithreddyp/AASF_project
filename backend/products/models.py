from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Products(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    image = models.ImageField(upload_to="products/")
    category = models.CharField(max_length=50)
    brand=models.CharField(max_length=50)
    rating=models.DecimalField(max_digits=1,decimal_places=1)

    

    

    
