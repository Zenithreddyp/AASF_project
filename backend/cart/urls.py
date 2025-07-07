from django.urls import path
from .views import GetCart,AddCartorGetItem,RemoveCartItem,ListallOrders,OrderPlaced,CancelOrder


urlpatterns = [
    path("cart/", GetCart.as_view(), name="cart-list"),
    path("cart/add/", AddCartorGetItem.as_view(), name="add-item=cart"),
    path("cart/remove/", RemoveCartItem.as_view(), name="remove-item-cart"),
    path("orders/",ListallOrders.as_view(),name="all-placed-orders"),
    path("orders/delete/<int:pk>/",CancelOrder.as_view(),name="cancel-order"),
    path("cart/order/",OrderPlaced.as_view(),name="order=placed"),
    path("cart/update/<int:pk>/",CartItemUpdateView.as_view(),name="update-cart-item"),
    path("cart/clear/", ClearCart.as_view(), name="clear-cart"),

    
]
