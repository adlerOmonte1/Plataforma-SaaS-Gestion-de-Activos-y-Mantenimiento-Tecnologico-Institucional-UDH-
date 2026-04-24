# users_service/urls.py
from django.urls import path
from .views import GoogleLoginView

urlpatterns = [
    # Esta ruta interceptará la petición POST desde React
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
]