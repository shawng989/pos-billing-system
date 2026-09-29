from django.db import transaction
from rest_framework import serializers
from .models import Sale, SaleItem
from products.models import Product
from transactions.models import Transaction
from ledger.models import LedgerEntry
import uuid


class SaleItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleItem
        fields = "__all__"
        read_only_fields = ("sale",)


class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True, required=False)

    class Meta:
        model = Sale
        fields = "__all__"
        read_only_fields = ("created_at",)

    def validate(self, attrs):
        items = self.initial_data.get("items", [])
        if not items:
            raise serializers.ValidationError({"items": "At least one product is required."})
        return attrs

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])

        with transaction.atomic():
            sale = Sale.objects.create(**validated_data)
            subtotal = 0

            for item_data in items_data:
                product_id = item_data.get("product")
                quantity = int(item_data.get("quantity", 1))

                product = Product.objects.select_for_update().get(pk=product_id)

                if quantity < 1:
                    raise serializers.ValidationError({"items": "Quantity must be at least 1."})
                if product.stock < quantity:
                    raise serializers.ValidationError(
                        {"items": f"Not enough stock for {product.name}. Available: {product.stock}."}
                    )

                price = product.price
                item_subtotal = price * quantity
                subtotal += item_subtotal

                SaleItem.objects.create(
                    sale=sale,
                    product=product,
                    quantity=quantity,
                    price=price,
                    subtotal=item_subtotal,
                )

                product.stock -= quantity
                product.save(update_fields=["stock"])

            discount = sale.discount or 0
            tax = max(subtotal - discount, 0) * 0.05
            sale.subtotal = subtotal
            sale.tax = tax
            sale.total = max(subtotal - discount + tax, 0)
            sale.save(update_fields=["subtotal", "tax", "total"])

            Transaction.objects.create(
                sale=sale,
                transaction_id=f"TXN-{uuid.uuid4().hex[:10].upper()}",
                amount=sale.total,
                payment_method=sale.payment_method,
                status="paid",
            )

            LedgerEntry.objects.create(
                entry_type="income",
                description=f"Sale {sale.invoice_number}",
                amount=sale.total,
                transaction=sale.transaction,
            )

        return sale

    def update(self, instance, validated_data):
        # Billing records are treated as immutable after payment.
        raise serializers.ValidationError(
            "Completed sales cannot be edited. Create a return/refund instead."
        )
