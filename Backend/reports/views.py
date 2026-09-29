from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count
from billing.models import Sale
from products.models import Product


class DashboardReportView(APIView):

    def get(self, request):
        total_sales = Sale.objects.count()

        total_revenue = Sale.objects.aggregate(
            total=Sum("total")
        )["total"] or 0

        total_products = Product.objects.count()

        low_stock = Product.objects.filter(
            stock__lte=5
        ).count()

        return Response({
            "total_sales": total_sales,
            "total_revenue": total_revenue,
            "total_products": total_products,
            "low_stock_products": low_stock,
        })
