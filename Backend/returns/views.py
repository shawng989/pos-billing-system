from django.db import transaction
from django.db.models import F
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Return
from .serializers import ReturnSerializer
from ledger.models import LedgerEntry
from transactions.models import Transaction


class ReturnViewSet(viewsets.ModelViewSet):
    queryset = Return.objects.select_related("sale", "product").all().order_by("-created_at")
    serializer_class = ReturnSerializer

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        return_obj = self.get_object()

        if return_obj.status != "pending":
            return Response(
                {"detail": "Only pending returns can be approved."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            product = return_obj.product
            product.stock = F("stock") + return_obj.quantity
            product.save(update_fields=["stock"])

            return_obj.status = "completed"
            return_obj.save(update_fields=["status"])

            if return_obj.sale.transaction_id:
                return_obj.sale.transaction.status = "refunded"
                return_obj.sale.transaction.save(update_fields=["status"])

            LedgerEntry.objects.create(
                entry_type="expense",
                description=f"Refund {return_obj.sale.invoice_number}",
                amount=return_obj.refund_amount,
                transaction=getattr(return_obj.sale, "transaction", None),
            )

        return Response(ReturnSerializer(return_obj).data)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        return_obj = self.get_object()

        if return_obj.status != "pending":
            return Response(
                {"detail": "Only pending returns can be rejected."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return_obj.status = "rejected"
        return_obj.save(update_fields=["status"])
        return Response(ReturnSerializer(return_obj).data)
