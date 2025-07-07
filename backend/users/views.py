from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics 
from .serializers import UserSerializer,ShippingAddressSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny   #	These control who can access the view (authentication permissions)
from .models import ShippingAddress

# Create your views here.

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny] 



class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny] 

    queryset = User.objects.all()



class CreateShippingAddressView(generics.CreateAPIView):
    serializer_class = ShippingAddressSerializer
    permission_classes=[IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class ListuserShippingAddress(generics.ListAPIView):
    serializer_class = ShippingAddressSerializer
    permission_classes=[IsAuthenticated]
    

    def get_queryset(self):
        return ShippingAddress.objects.filter(user=self.request.user)


class DeleteShippingAddress(generics.DestroyAPIView):
    serializer_class = ShippingAddressSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        return ShippingAddress.objects.filter(user=self.request.user)


class UpdateShippingAddressView(generics.UpdateAPIView):
    serializer_class = ShippingAddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ShippingAddress.objects.filter(user=self.request.user)
