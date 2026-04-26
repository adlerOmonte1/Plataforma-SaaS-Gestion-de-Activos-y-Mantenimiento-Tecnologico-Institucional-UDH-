from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GoogleLoginView, RegistrarUsuarioView, AreaViewSet

# Configuramos el router para las áreas
router = DefaultRouter()
router.register(r'areas', AreaViewSet)

urlpatterns = [
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
    path('registrar/', RegistrarUsuarioView.as_view(), name='registrar_usuario'),
    # Incluimos las rutas automáticas del ViewSet
    path('', include(router.urls)), 
]