# cart/urls.py
from django.urls import path
from .views import GetCart,AddCartorGetItem,RemoveCartItem,ListallOrders,OrderPlacedView,CancelOrder,CartItemUpdateView,ClearCart,CreateCart,DeleteCart # Notice OrderPlacedView
# from .views import download_invoice,generate_and_save_invoice


urlpatterns = [
    path("cart/", GetCart.as_view(), name="cart-list"),
    path("create/new/cart/",CreateCart.as_view(),name="create-cart"),
    path("delete/temp/cart/", DeleteCart.as_view(), name="delete-cart"),
    path("cart/add/", AddCartorGetItem.as_view(), name="add-item=cart"),
    path("cart/remove/<int:pk>/", RemoveCartItem.as_view(), name="remove-item-cart"),
    path("cart/update/<int:pk>/",CartItemUpdateView.as_view(),name="update-cart-item"),
    path("orders/",ListallOrders.as_view(),name="all-placed-orders"),
    path("orders/cancel/<int:pk>/",CancelOrder.as_view(),name="cancel-order"),

    path("cart/order/",OrderPlacedView.as_view(),name="order-placed"), # Updated URL
    path("cart/clear/", ClearCart.as_view(), name="clear-cart"),

    # path("order/invoice/download/<int:order_id>/", download_invoice, name="download_invoice"),
    # path("order/invoice/generate/<int:order_id>/", generate_and_save_invoice, name="generate_and_save_invoice"),
]