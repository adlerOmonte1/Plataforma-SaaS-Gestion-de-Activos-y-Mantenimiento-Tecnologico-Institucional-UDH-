
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model

User = get_user_model() # Llama al modelo de usuarios de Django

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        """
        Intercepta el login de Google para asegurar el dominio institucional 
        y prohibir el auto-registro.
        """
        user_data = sociallogin.account.extra_data
        email = user_data.get('email', '')

        # 1º Candado: Validación Estricta de Dominio
        if not email.endswith('@udh.edu.pe'):
            raise PermissionDenied(
                "Dominio no autorizado. Solo @udh.edu.pe."
            )
            
        # 2º Candado: Prohibición de Auto-registro (Corregido)
        # Si el correo no existe previamente en la BD, bloqueamos el acceso.
        if not User.objects.filter(email=email).exists():
            raise PermissionDenied(
                "Acceso Denegado: Su correo institucional es válido, pero no ha sido registrado por el Administrador de TI."
            )



"""from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from rest_framework.exceptions import PermissionDenied

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):

        #Intercepta el login de Google para asegurar el dominio institucional.
       
        user_data = sociallogin.account.extra_data
        email = user_data.get('email', '')

        # ÚNICA REGLA DE BLOQUEO: Validación Estricta de Dominio
        if not email.endswith('@udh.edu.pe'):
            raise PermissionDenied(
                "Dominio no autorizado. Solo se permiten correos institucionales terminados en @udh.edu.pe."
            )
            
        # Si el correo es @udh.edu.pe, el flujo continúa.
        # Si el usuario es nuevo, el sistema lo registrará automáticamente en la base de datos.
        pass
"""