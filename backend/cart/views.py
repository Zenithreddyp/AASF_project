from django.forms import ValidationError
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics 
from .serializers import CartSerializers,CartitemSerializers,OrdersSerializers
from rest_framework.permissions import IsAuthenticated,AllowAny,IsAdminUser   #	These control who can access the view (authentication permissions)
from .models import Cart,Cartitem,Orders
from rest_framework.response import Response
from rest_framework import status


from django.http import FileResponse
from .invoice_generator import InvoiceGenerator

# Create your views here.

class GetCart(generics.ListAPIView):
    serializer_class=CartSerializers
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user,is_ordered=False).order_by("-created_at")

class CreateCart(generics.CreateAPIView):
    serializer_class=CartSerializers
    permission_classes=[IsAuthenticated]
    queryset = Cart.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
class DeleteCart(generics.DestroyAPIView):
    serializer_class = CartSerializers
    permission_classes = [IsAuthenticated]


    def get_object(self):
        # removes the last created cart for the auth user
        return Cart.objects.filter(user=self.request.user,is_ordered=False).order_by('-created_at').first()


class AddCartorGetItem(generics.ListCreateAPIView):
    serializer_class=CartitemSerializers
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        return Cartitem.objects.filter(cart__user=self.request.user)
    
    def perform_create(self, serializer):
        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']
        
        cart = Cart.objects.filter(user=self.request.user,is_ordered=False).order_by("-created_at").first()
        if not cart:
            cart = Cart.objects.create(user=self.request.user)

        existing_item = Cartitem.objects.filter(cart=cart, product=product).first()

        if existing_item:
            existing_item.quantity += quantity
            existing_item.total_price = existing_item.product.price * existing_item.quantity
            existing_item.save()
        else:
            serializer.save(cart=cart)



        
class CartItemUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        user = self.request.user
        latest_cart = Cart.objects.filter(user=user, is_ordered=False).order_by("-created_at").first()

        if not latest_cart:
            return Response({"error": "No active cart found"}, status=status.HTTP_404_NOT_FOUND)

        cart_item = Cartitem.objects.get(pk=pk, cart=latest_cart)


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
    
    # def destroy(self, request, *args, **kwargs):






    #     return super().destroy(request, *args, **kwargs)

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
        user = self.request.user
        cart = Cart.objects.filter(user=self.request.user, is_ordered=False).order_by('-created_at').first()
        print("i came here")

        if not cart:
            raise ValidationError("No active cart found to place an order.")
        
        total_price = sum(item.product.price * item.quantity for item in cart.items.all())

        shipping_address = self.request.data.get('shipping_address')
        if not shipping_address:
            raise ValidationError("Shipping address is required.")

        cart.is_ordered=True
        cart.save()
        serializer.save(
            user=user,
            cart=cart,
            total_price=total_price,
            shipping_address=shipping_address
        )

class CancelOrder(generics.UpdateAPIView):
    serializer_class=OrdersSerializers
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        return Orders.objects.filter(user=self.request.user, status="Pending")
    
    def perform_update(self, serializer):

        serializer.save(status="Cancelled")
    





def download_invoice(request, order_id):
    order = Orders.objects.get(id=order_id, user=request.user)
    invoice = InvoiceGenerator(order)
    pdf = invoice.generate()
    return FileResponse(pdf, as_attachment=True, filename=f'invoice_ZEDOVA_{order.id}.pdf')

def generate_and_save_invoice(request, order_id):
    order = Orders.objects.get(id=order_id, user=request.user)
    invoice = InvoiceGenerator(order)
    invoice.save_to_order()
    return FileResponse(invoice.buffer, as_attachment=True, filename=f'invoice_ZEDOVA_{order.id}.pdf')

