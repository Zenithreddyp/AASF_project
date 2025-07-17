from django.shortcuts import render
from products.models import Products
from paypal.standard.forms import PayPalPaymentsForm
from django.conf import settings
import uuid
from django.urls import reverse
# Create your views here.

def CheckOut (request, product_name):
    product = Products.objects.get(name = product_name)
    host = request.get_host()

    paypal_checkout = {
        'business': settings.PAYPAL_RECEIVER_EMAIL,
        'amount': product.price,
        'item_name': product.name,
        'invoice': uuid.uuid4(),
        'currency_code': 'INR',
        'notify_url': f"https://{host}{reverse('paypal-ipn')}",
        'return_url': f"http://{host}{reverse('payment-success', kwargs = {'product_name': product.name})}",
        'cancel_url': f"http://{host}{reverse('payment-failed', kwargs = {'product_name': product.name})}",
    }

    paypal_payment = PayPalPaymentsForm(initial=paypal_checkout)

    context = {
        'product': product,
        'paypal': paypal_payment,
    }

    return render (request, 'checkout.html', context)

def PaymentSuccessful(request, product_name):

    product = Products.objects.get(name = product_name)

    return render(request, 'payment-success.html', {'product': product})

def PaymentFailed(request, product_name):

    product = Products.objects.get(name = product_name)

    return render(request, 'payment-failed.html', {'product': product})