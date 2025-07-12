from django.urls import path
from . import views


urlpatterns = [
    path("shippingaddress/",views.ListuserShippingAddress.as_view(),name="address-List"),
    path("new/shippingaddress/",views.CreateShippingAddressView.as_view(),name="Create-address"),
    path("shippingaddress/delete/<int:pk>/", views.DeleteShippingAddress.as_view(), name="delete-address"),
    path("shippingaddress/default/", views.DefaultShippingAddress.as_view(), name="default-shipping"),
    path("user/change-password/", views.UpdateUserPassworwView.as_view(), name="change-password"),

]
