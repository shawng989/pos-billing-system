from rest_framework import viewsets
from .models import Return
from .serializers import ReturnSerializer


class ReturnViewSet(viewsets.ModelViewSet):
    queryset = Return.objects.all()
    serializer_class = ReturnSerializer