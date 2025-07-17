from django.urls import path
from . import views

urlpatterns = [
    path('checkout/<string:product_name>/', views.CheckOut, name='checkout'),
    path('payment-success/<string:product_name>/', views.PaymentSuccessful, name='payment-success'),
    path('payment-failed/<string:product_name>/', views.PaymentFailed, name='payment-failed'),
]