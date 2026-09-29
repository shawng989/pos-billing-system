import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


DEMO_USERS = {
    os.getenv("POS_ADMIN_EMAIL", "admin@pos.local").lower(): {
        "password": os.getenv("POS_ADMIN_PASSWORD", "Admin@123"),
        "name": "Admin User",
        "role": "admin",
    },
    os.getenv("POS_STAFF_EMAIL", "staff@pos.local").lower(): {
        "password": os.getenv("POS_STAFF_PASSWORD", "Staff@123"),
        "name": "Staff User",
        "role": "staff",
    },
}


class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        email = str(request.data.get("email", "")).strip().lower()
        password = str(request.data.get("password", ""))

        user = DEMO_USERS.get(email)

        if not user or password != user["password"]:
            return Response(
                {"detail": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response({
            "email": email,
            "name": user["name"],
            "role": user["role"],
            "message": "Login successful",
        })
