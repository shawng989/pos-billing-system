from django.db import models


class Staff(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('cashier', 'Cashier'),
        ('staff', 'Staff'),
    ]

    name = models.CharField(max_length=200)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='staff'
    )
    is_active = models.BooleanField(default=True)
    joined_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name