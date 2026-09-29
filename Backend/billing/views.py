from django.shortcuts import render
from rest_framework import viewsets
from .models import Sale, SaleItem
from .serializers import SaleSerializer, SaleItemSerializer


def home(request):
    return render(request, "billing/home.html")


class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all().order_by("-created_at")
    serializer_class = SaleSerializer
    http_method_names = ["get", "post", "head", "options"]


class SaleItemViewSet(viewsets.ModelViewSet):
    queryset = SaleItem.objects.select_related("sale", "product").all()
    serializer_class = SaleItemSerializer
    http_method_names = ["get", "head", "options"]
