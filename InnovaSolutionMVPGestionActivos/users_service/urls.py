# users_service/urls.py
from django.urls import path
from .views import GoogleLoginView, RegistrarUsuarioView # <-- Asegúrate de importar la nueva vista

urlpatterns = [
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
    # 👇 ESTA ES LA RUTA NUEVA 👇
    path('registrar/', RegistrarUsuarioView.as_view(), name='registrar_usuario'), 
]