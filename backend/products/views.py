from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics 
from .serializers import ProductSerializer,ProductImageSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny,IsAdminUser   #	These control who can access the view (authentication permissions)
from .models import Products,ProductImage

from rest_framework.parsers import MultiPartParser, FormParser

# Create your views here.

 #complwted with string must be done by varshith (with nlo)


class getproductsearch(generics.ListAPIView):
    serializer_class=ProductSerializer
    permission_classes=[AllowAny]

    def get_queryset(self):
        name = self.request.query_params.get('name', None)    #http://localhost:8000/products/search/?name=phone&category=electronics&min_price=500&max_price=100
        category = self.request.query_params.get("category")
        brand=self.request.query_params.get("brand")
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        rating_above=self.request.query_params.get("rating")

        # add size to 
        queryset = Products.objects.all()


        if name:
            queryset = queryset.filter(name__icontains=name)
        if category:
            queryset = queryset.filter(category__icontains=category)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if rating_above:
            queryset = queryset.filter(rating__gte=rating_above)
        if brand:
            queryset = queryset.filter(brand__icontains=brand)

        return Products.objects.all()
    

class getcategorysearch(generics.ListAPIView):
    serializer_class=ProductSerializer
    permission_classes=[AllowAny]

    def get_queryset(self):
        category = self.request.query_params.get("category",None)
        if category:
            return Products.objects.filter(category__icontains=category)
        return Products.objects.all()
    

class getbrandsearch(generics.ListAPIView):
    serializer_class=ProductSerializer
    permission_classes=[AllowAny]

    def get_queryset(self):
        brand = self.request.query_params.get("brand",None)
        if brand:
            return Products.objects.filter(brand__icontains=brand)
        return Products.objects.all()

class ProductDetail(generics.RetrieveAPIView):
    queryset = Products.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class AddProductsAsAdmin(generics.CreateAPIView):
    queryset = Products.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]


class Allproducts(generics.ListAPIView):
    queryset=Products.objects.all()
    serializer_class=ProductSerializer
    permission_classes=[AllowAny]


class DeleteProduct(generics.DestroyAPIView):
    queryset = Products.objects.all()
    serializer_class=ProductSerializer
    permission_classes=[AllowAny]
