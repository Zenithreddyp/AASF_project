from django.urls import path
from .views import getbrandsearch,getcategorysearch,getproductsearch, ProductDetail


urlpatterns = [
    path("products/search/", getproductsearch.as_view(), name="product-search"),        #http://localhost:8000/products/search/?name=phone&category=electronics&min_price=500&max_price=100
    path("products/search/category", getcategorysearch.as_view(), name="category-search"),
    path("products/search/brand", getbrandsearch.as_view(), name="brand-search"),
    path("products/<int:pk>/", ProductDetail.as_view(), name="product-detail"),
    
]
