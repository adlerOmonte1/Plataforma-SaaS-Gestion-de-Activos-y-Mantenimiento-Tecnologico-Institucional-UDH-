# users_service/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

# Importamos tu modelo de Usuario personalizado
User = get_user_model()

class GoogleLoginView(APIView):
    # No pedimos token JWT de Django para entrar aquí, porque apenas van a loguearse
    permission_classes = [] 

    def post(self, request):
        
        # Buscamos la llave 'token' en lo que nos mandó React
        token_google = request.data.get('token')
        
        if not token_google:
            return Response({"error": "Token no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

        try:

            # 1. Django se comunica con Google para verificar que el token no sea falso
            idinfo = id_token.verify_oauth2_token(
                token_google, 
                requests.Request(), 
                settings.GOOGLE_OAUTH2_CLIENT_ID,
                clock_skew_in_seconds=10
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

            # Si pasa las dos reglas, generamos nuestro propio JWT 
            refresh = RefreshToken.for_user(usuario)
            
            # Extraemos el rol del usuario (Si no tiene, le ponemos SOLICITANTE por defecto)
            rol_usuario = getattr(usuario, 'rol', 'SOLICITANTE')

            # Le respondemos al frontend de React lo que está esperando
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'role': rol_usuario
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            print("error", str(e))
            return Response({"error": "Token de Google inválido o expirado"}, status=status.HTTP_400_BAD_REQUEST)