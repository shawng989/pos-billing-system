from django.db import models
from transactions.models import Transaction


class LedgerEntry(models.Model):
    ENTRY_TYPES = [
        ("income", "Income"),
        ("expense", "Expense"),
    ]

    entry_type = models.CharField(
        max_length=20,
        choices=ENTRY_TYPES
    )

    description = models.CharField(max_length=255)

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    transaction = models.ForeignKey(
        Transaction,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="ledger_entries"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.entry_type} - {self.description}"