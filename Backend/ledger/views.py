from rest_framework import viewsets
from .models import LedgerEntry
from .serializers import LedgerEntrySerializer


class LedgerEntryViewSet(viewsets.ModelViewSet):
    queryset = LedgerEntry.objects.all()
    serializer_class = LedgerEntrySerializer
