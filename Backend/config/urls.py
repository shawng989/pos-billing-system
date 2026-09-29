from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render


def home(request):
    return render(request, "billing/home.html")


urlpatterns = [
    
    path("", home, name="home"),
    
    path("admin/", admin.site.urls),

    path("api/products/", include("products.urls")),

    path("api/suppliers/", include("suppliers.urls")),
   
    path("api/staff/", include("staff.urls")),

    path("api/billing/", include("billing.urls")),

    path("api/returns/", include("returns.urls")),

    path("api/transactions/", include("transactions.urls")),

    path("api/ledger/", include("ledger.urls")),

    path("api/reports/", include("reports.urls")),
]