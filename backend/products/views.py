from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics 
from .serializers import ProductSerializer,ProductImageSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny,IsAdminUser   #	These control who can access the view (authentication permissions)
from .models import Products,ProductImage

from machine_learning.smartsearch import hybrid_search,fetch_products

from rest_framework.parsers import MultiPartParser, FormParser

# Create your views here.

from fuzzywuzzy import fuzz
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class getproductsearch(generics.ListAPIView):
    serializer_class=ProductSerializer
    permission_classes=[AllowAny]


    def get_queryset(self):
        name = self.request.query_params.get('name', None)
        category = self.request.query_params.get("category")
        brand=self.request.query_params.get("brand")
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        rating_above=self.request.query_params.get("rating")

        # add size to 
        queryset = Products.objects.all()


        if name:
            products = fetch_products()
            matched_products = hybrid_search(name, products)
            matched_ids = [p["id"] for p in matched_products]
            queryset = queryset.filter(id__in=matched_ids)
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
