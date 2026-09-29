from datetime import timedelta
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response

from billing.models import Sale, SaleItem
from products.models import Product
from staff.models import Staff
from returns.models import Return


class DashboardReportView(APIView):
    def get(self, request):
        now = timezone.now()
        start = now - timedelta(days=6)

        paid_sales = Sale.objects.all()
        total_revenue = paid_sales.aggregate(total=Sum("total"))["total"] or 0
        total_orders = paid_sales.count()
        total_products = Product.objects.count()
        low_stock = Product.objects.filter(stock__lte=5, is_active=True).count()
        active_staff = Staff.objects.filter(is_active=True).count()
        returned_amount = Return.objects.filter(
            status="completed"
        ).aggregate(total=Sum("refund_amount"))["total"] or 0

        sales_by_day = []
        for row in (
            paid_sales.filter(created_at__date__gte=start.date())
            .annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(sales=Sum("total"), orders=Count("id"))
            .order_by("day")
        ):
            sales_by_day.append({
                "day": row["day"].strftime("%d %b"),
                "sales": float(row["sales"] or 0),
                "orders": row["orders"],
            })

        top_products = []
        for row in (
            SaleItem.objects.values("product__name")
            .annotate(quantity=Sum("quantity"), revenue=Sum("subtotal"))
            .order_by("-quantity")[:5]
        ):
            top_products.append({
                "name": row["product__name"],
                "quantity": row["quantity"],
                "revenue": float(row["revenue"] or 0),
            })

        staff_performance = []
        for row in (
            Sale.objects.filter(staff__isnull=False)
            .values("staff__name")
            .annotate(sales=Sum("total"), orders=Count("id"))
            .order_by("-sales")[:5]
        ):
            staff_performance.append({
                "name": row["staff__name"],
                "sales": float(row["sales"] or 0),
                "orders": row["orders"],
            })

        return Response({
            "total_revenue": float(total_revenue),
            "total_orders": total_orders,
            "total_products": total_products,
            "low_stock_products": low_stock,
            "active_staff": active_staff,
            "returned_amount": float(returned_amount),
            "sales_by_day": sales_by_day,
            "top_products": top_products,
            "staff_performance": staff_performance,
        })
