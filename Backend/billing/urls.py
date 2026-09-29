from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SaleViewSet, SaleItemViewSet
from .auth import LoginView

router = DefaultRouter()
router.register(r"sales", SaleViewSet, basename="sale")
router.register(r"sale-items", SaleItemViewSet, basename="sale-item")

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("", include(router.urls)),
]
