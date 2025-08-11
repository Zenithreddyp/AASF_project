from django.forms import ValidationError
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.views import APIView

from products.models import Products 
from .serializers import CartSerializers,CartitemSerializers,OrdersSerializers, OrderCreateSerializer, OrderItemSerializer, OrderReadSerializer, WishlistItemSerializer, WishlistSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny,IsAdminUser   #	These control who can access the view (authentication permissions)
from .models import Cart,Cartitem,Orders, Wishlist, WishlistItem
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

from django.http import FileResponse
# from .invoice_generator import InvoiceGenerator
import razorpay
import json
# Create your views here.
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_API_KEY, settings.RAZORPAY_API_SECRET_KEY))

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
    # This serializer is for listing orders so it should be a read-only serializer
    # that can display the nested order items
    # we will need a new serializer for this

    serializer_class = OrderReadSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        # Prefetch related items and product images for efficient and complete serialization
        return (
            Orders.objects
            .filter(user=self.request.user)
            .prefetch_related("items__product__images")
        )
    

class CancelOrder(generics.UpdateAPIView):
    serializer_class=OrdersSerializers
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        return Orders.objects.filter(user=self.request.user, status="Pending")
    
    def perform_update(self, serializer):

        serializer.save(status="Cancelled")

class CreateRazorpayOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        from decimal import Decimal
        try:
            items = request.data.get("items", [])
            total_price = request.data.get("total_price")

            if items:
                computed_total = Decimal("0.00")
                for item in items:
                    price = Decimal(str(item.get("price", 0)))
                    quantity = int(item.get("quantity", 1))
                    computed_total += price * quantity
                amount_rupees = computed_total
            elif total_price is not None:
                amount_rupees = Decimal(str(total_price))
            else:
                return Response({"detail": "Either items or total_price is required."}, status=status.HTTP_400_BAD_REQUEST)

            amount_paise = int(amount_rupees * 100)
            order = razorpay_client.order.create(data={
                "amount": amount_paise,
                "currency": "INR",
                "payment_capture": 1,
            })

            return Response({
                "order_id": order.get("id"),
                "amount": amount_paise,
                "currency": "INR",
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": f"Failed to create Razorpay order: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OrderPlacedView(generics.CreateAPIView):
    serializer_class = OrderCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # 1. Razorpay Signature Verification (CRUCIAL SECURITY STEP)
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_signature = request.data.get('razorpay_signature')
        total_amount_from_frontend = request.data.get('total_price') # Renamed to match frontend data

        if not all([razorpay_payment_id, razorpay_order_id, razorpay_signature]):
            return Response(
                {"detail": "Missing Razorpay payment details."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            params_dict = {
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            }
            # The verify_payment_signature function verifies if the signature is valid.
            razorpay_client.utility.verify_payment_signature(params_dict)

            # Optional: Fetch payment details from Razorpay to re-verify the amount
            # This is an extra layer of security
            # payment_info = razorpay_client.payment.fetch(razorpay_payment_id)
            # if payment_info['status'] != 'captured' or float(total_amount_from_frontend) != payment_info['amount'] / 100:
            #     return Response(
            #         {"detail": "Payment not captured or amount mismatch."},
            #         status=status.HTTP_400_BAD_REQUEST
            #     )

        except razorpay.errors.SignatureVerificationError:
            return Response(
                {"detail": "Razorpay signature verification failed. Possible tampering."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"detail": f"Error during Razorpay verification: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 2. If verification is successful, proceed with order creation
        # The serializer will handle creating the Order and OrderItem instances,
        # and reducing the product stock.
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Attach the verified Razorpay details.
        serializer.validated_data['razorpay_payment_id'] = razorpay_payment_id
        serializer.validated_data['razorpay_order_id'] = razorpay_order_id
        serializer.validated_data['razorpay_signature'] = razorpay_signature
        
        self.perform_create(serializer)

        # 3. Mark the user's cart as ordered
        user_cart = Cart.objects.filter(user=self.request.user, is_ordered=False).order_by('-created_at').first()
        if user_cart:
            user_cart.is_ordered = True
            user_cart.save()
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    

class GetWishlist(generics.ListAPIView):
    serializer_class = WishlistSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        # Ensure the user always has a wishlist
        Wishlist.objects.get_or_create(user=self.request.user)
        return Wishlist.objects.filter(user=self.request.user)
    
class AddWishlistitem(generics.CreateAPIView):
    serializer_class = WishlistItemSerializer
    permission_classes=[IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.validated_data["product"]
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)

        wishlist_item, created = WishlistItem.objects.get_or_create(
            wishlist=wishlist,
            product=product,
        )

        output_serializer = self.get_serializer(wishlist_item)
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(output_serializer.data, status=status_code)
    
class RemoveWIshlistitem(generics.DestroyAPIView):
    serializer_class = WishlistItemSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        return WishlistItem.objects.filter(wishlist__user=self.request.user)
    

class MoveWishListitemtoCart(APIView):
    permission_classes=[IsAuthenticated]

    def post(self, request, product_id):
        user = request.user

        # Ensure active cart exists
        cart = Cart.objects.filter(user=user, is_ordered=False).order_by("-created_at").first()
        if cart is None:
            cart = Cart.objects.create(user=user)

        try:
            product = Products.objects.get(id=product_id)
        except Products.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        cart_item, created = Cartitem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={"quantity": 1},
        )

        if not created:
            cart_item.quantity += 1
            cart_item.save()

        # Remove from wishlist if present
        WishlistItem.objects.filter(
            wishlist__user=user,
            product=product,
        ).delete()

        return Response({
            "detail": "Item moved to cart",
            "cart_item_id": cart_item.id,
            "quantity": cart_item.quantity,
        }, status=status.HTTP_200_OK)