from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics 
from .serializers import CartSerializers,CartitemSerializers,OrdersSerializers
from rest_framework.permissions import IsAuthenticated,AllowAny,IsAdminUser   #	These control who can access the view (authentication permissions)
from .models import Cart,Cartitem,Orders

# Create your views here.

class GetCart(generics.ListAPIView):
    serializer_class=CartSerializers
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user,is_ordered=False)


class AddCartorGetItem(generics.ListCreateAPIView):
    serializer_class=CartitemSerializers
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        return Cartitem.objects.filter(cart__user=self.request.user)
    
    def perform_create(self, serializer):
        cart, created = Cart.objects.get_or_create(user=self.request.user, is_ordered=False)   # important
        serializer.save(cart=cart)
        
class CartItemUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        cart_item = Cartitem.objects.get(pk=pk,user=self.request.user)
        new_quantity = request.data.get("quantity")
        if new_quantity is None or int(new_quantity) <= 0:
            return Response({"error": "Invalid quantity"}, status=status.HTTP_400_BAD_REQUEST)
        cart_item.quantity = int(new_quantity)
        cart_item.total_price = cart_item.product.price * cart_item.quantity
        cart_item.save()
        serializer = CartitemSerializers(cart_item)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RemoveCartItem(generics.DestroyAPIView):
    serializer_class = CartitemSerializers
    permission_classes = [IsAuthenticated]
    

    def get_queryset(self):
        return Cartitem.objects.filter(cart__user=self.request.user)
    

class ClearCart(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cartitem.objects.filter(cart__user=self.request.user)
    
    def perform_destroy(self, instance):
        instance.delete()




class ListallOrders(generics.ListAPIView):
    serializer_class=OrdersSerializers
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        return Orders.objects.filter(user=self.request.user)
    
class OrderPlaced(generics.CreateAPIView):
    serializer_class=OrdersSerializers
    permission_classes=[IsAuthenticated]

    def perform_create(self, serializer):
        cart=Cart.objects.get(user=self.request.user,is_ordered=False)
        cart.is_ordered=True
        cart.save()
        serializer.save(user=self.request.user)  

class CancelOrder(generics.UpdateAPIView):
    serializer_class=OrdersSerializers
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        return Orders.objects.filter(user=self.request.user, status="Pending")
    
    def perform_update(self, serializer):

        serializer.save(status="Cancelled")
    

