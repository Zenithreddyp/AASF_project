from django.shortcuts import render, HttpResponse
import razorpay
from backend.settings import RAZORPAY_API_KEY, RAZORPAY_API_SECRET_KEY
# Create your views here.


def index(request):
    client = razorpay.Client(auth=(RAZORPAY_API_KEY, RAZORPAY_API_SECRET_KEY))

    DATA = {
        "amount": 50000,
        "currency": "<currency>",
        'payment_capture': 1,
    }
    client.order.create(data=DATA)
