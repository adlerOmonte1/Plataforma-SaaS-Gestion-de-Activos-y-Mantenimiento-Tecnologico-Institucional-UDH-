# users_service/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

# 👇 NUEVOS IMPORTS PARA EL REGISTRO
from rest_framework.permissions import BasePermission
from .serializers import RegistroUsuarioSerializer

from rest_framework import viewsets
from .serializers import AreaSerializer
from .models import Area

User = get_user_model()

# =========================================================
# 1. VISTA DE LOGIN (La que ya tenías, intacta)
# =========================================================
class GoogleLoginView(APIView):
    permission_classes = [] 

    def post(self, request):
        token_google = request.data.get('token')
        
        if not token_google:
            return Response({"error": "Token no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            idinfo = id_token.verify_oauth2_token(
                token_google, 
                requests.Request(), 
                settings.GOOGLE_OAUTH2_CLIENT_ID,
                clock_skew_in_seconds=10
            )

            email_usuario = idinfo['email']

            if not email_usuario.endswith('@udh.edu.pe'):
                return Response(
                    {"error": "Acceso denegado. Solo se permite el dominio @udh.edu.pe"},
                    status=status.HTTP_403_FORBIDDEN
                )

            try:
                usuario = User.objects.get(email=email_usuario)
            except User.DoesNotExist:
                return Response(
                    {"error": "Su cuenta no ha sido dada de alta por el Administrador."},
                    status=status.HTTP_403_FORBIDDEN
                )

            refresh = RefreshToken.for_user(usuario)
            rol_usuario = getattr(usuario, 'rol', 'SOLICITANTE')

            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'role': rol_usuario
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            print("error", str(e))
            return Response({"error": "Token de Google inválido o expirado"}, status=status.HTTP_400_BAD_REQUEST)


# =========================================================
# 2. NUEVA VISTA DE REGISTRO (Task 24)
# =========================================================

class EsJefeTI(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.rol == 'JEFE_TI')


class RegistrarUsuarioView(APIView):
    permission_classes = [EsJefeTI] 

    def post(self, request):
   
        serializer = RegistroUsuarioSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"mensaje": "Usuario institucional registrado con éxito."}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# =========================================================
# 3. VISTA PARA GESTIÓN DE ÁREAS (CRUD BÁSICO)
# =========================================================
class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all().order_by('codigo')
    serializer_class = AreaSerializer
    permission_classes = [EsJefeTI] 

    def destroy(self, request, *args, **kwargs):
        area = self.get_object()
        area.is_active = False 
        area.save()
        return Response({"mensaje": "El área ha sido inactivada exitosamente."}, status=status.HTTP_200_OK)