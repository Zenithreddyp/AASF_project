from django.urls import path
from . import views

urlpatterns = [
    path('checkout/<int:product_name>/', views.CheckOut, name='checkout'),
    path('payment-success/<int:product_name>/', views.PaymentSuccessful, name='payment-success'),
    path('payment-failed/<int:product_name>/', views.PaymentFailed, name='payment-failed'),
]