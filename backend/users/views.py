from django.http import Http404
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics ,response #Sends back a JSON response
from .serializers import UserSerializer,ShippingAddressSerializer,ChangePasswordSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny   #	These control who can access the view (authentication permissions)
from .models import ShippingAddress

# Create your views here.

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UpdateUserPassworwView(generics.UpdateAPIView):
    serializer_class=ChangePasswordSerializer
    permission_classes=[IsAuthenticated]

    def get_object(self):
        return self.request.user 

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return response.Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)



class UserListView(generics.ListAPIView): #for my sake
    serializer_class = UserSerializer
    permission_classes = [AllowAny] 

    queryset = User.objects.all()



class CreateShippingAddressView(generics.CreateAPIView):
    print("modda guduvu")
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


class DefaultShippingAddress(generics.RetrieveAPIView):
    serializer_class=ShippingAddressSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        address=ShippingAddress.objects.filter(user=self.request.user,is_default=True).first()
        if(address):
            raise Http404("No default address set.")

        return ShippingAddress.objects.filter(user=self.request.user,is_default=True)
    
