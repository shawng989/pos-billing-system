from django.db import transaction
from django.db.models import Sum
from rest_framework import serializers
from .models import Return
from billing.models import SaleItem


class ReturnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Return
        fields = "__all__"
        read_only_fields = ("created_at",)

    def validate(self, attrs):
        sale = attrs.get("sale")
        product = attrs.get("product")
        quantity = attrs.get("quantity", 1)

        if quantity < 1:
            raise serializers.ValidationError({"quantity": "Quantity must be at least 1."})

        try:
            sold_item = SaleItem.objects.get(sale=sale, product=product)
        except SaleItem.DoesNotExist:
            raise serializers.ValidationError(
                {"product": "This product was not part of the selected invoice."}
            )

        already_returned = Return.objects.filter(
            sale=sale, product=product, status__in=["approved", "completed"]
        ).exclude(pk=self.instance.pk if self.instance else None).aggregate(
            total=Sum("quantity")
        )["total"] or 0

        if quantity + already_returned > sold_item.quantity:
            raise serializers.ValidationError(
                {"quantity": f"Only {sold_item.quantity - already_returned} unit(s) can be returned."}
            )

        return attrs
