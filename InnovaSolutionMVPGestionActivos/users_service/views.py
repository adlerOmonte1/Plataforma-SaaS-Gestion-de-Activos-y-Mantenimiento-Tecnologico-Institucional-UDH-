# users_service/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken

# IMPORTANTE: Asegúrate de importar tu modelo de Usuario correcto. 
# Si usas el modelo por defecto de Django, sería: from django.contrib.auth.models import User
# Si creaste uno personalizado, impórtalo aquí.
from django.contrib.auth import get_user_model
User = get_user_model()

class GoogleLoginView(APIView):
    # No pedimos token JWT de Django para entrar aquí, porque apenas van a loguearse
    permission_classes = [] 

    def post(self, request):
        token_google = request.data.get('token')
        
        if not token_google:
            return Response({"error": "Token no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 1. Django se comunica con Google para verificar que el token no sea falso
            idinfo = id_token.verify_oauth2_token(
                token_google, 
                requests.Request(), 
                settings.GOOGLE_OAUTH2_CLIENT_ID # Tu ID de Google que pondremos en settings
            )

            email_usuario = idinfo['email']

            # --- 1º REGLA DE NEGOCIO: Validación de Dominio ---
            if not email_usuario.endswith('@udh.edu.pe'):
                return Response(
                    {"error": "Acceso denegado. Solo se permite el dominio @udh.edu.pe"},
                    status=status.HTTP_403_FORBIDDEN
                )

            # --- 2º REGLA DE NEGOCIO: Prohibición de Auto-registro ---
            try:
                # Buscamos si el Administrador ya registró este correo en la base de datos
                usuario = User.objects.get(email=email_usuario)
            except User.DoesNotExist:
                # Si no existe, bloqueamos el acceso. No creamos la cuenta.
                return Response(
                    {"error": "Su cuenta no ha sido dada de alta por el Administrador."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Si pasa las dos reglas, generamos nuestro propio JWT de 8 horas
            refresh = RefreshToken.for_user(usuario)
            
            # Extraemos el rol del usuario (Ajusta 'rol' al nombre real del campo en tu modelo de BD)
            # Si aún no tienes un campo de rol, puedes poner un string temporal como 'TECNICO'
            rol_usuario = getattr(usuario, 'rol', 'SOLICITANTE')

            # Le respondemos al frontend de React lo que está esperando
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'role': rol_usuario
            }, status=status.HTTP_200_OK)

        except ValueError:
            # Si el token de Google expiró o fue manipulado
            return Response({"error": "Token de Google inválido o expirado"}, status=status.HTTP_400_BAD_REQUEST)