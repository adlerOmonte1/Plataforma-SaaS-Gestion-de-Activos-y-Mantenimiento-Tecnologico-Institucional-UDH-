# users_service/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model


User = get_user_model()

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

            # Le respondemos al frontend de React lo que está esperando
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'role': rol_usuario
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            print("error", str(e))
            return Response({"error": "Token de Google inválido o expirado"}, status=status.HTTP_400_BAD_REQUEST)