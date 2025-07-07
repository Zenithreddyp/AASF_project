from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# class CustomerProfile(models.Model):
#     user = models.OneToOneField(User,on_delete=models.CASCADE)
#     # phonenumber=models.CharField(max_length=10)
#     # address=models.TextField()



class ShippingAddress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=10)
    address = models.TextField()
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    postal_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_default = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.is_default:
            ShippingAddress.objects.filter(user=self.user,is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args,**kwargs)

