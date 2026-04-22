"""
Django settings for InnovaSolutionMVPGestionActivos project.
"""

from pathlib import Path
import os
from dotenv import load_dotenv

# Cargamos las variables del archivo .env al inicio
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'django-insecure-0c@$vqz22g@07$hq4hoa_gn+k@nbu&7qxmkw*ydfb32z)q22&#')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    # APIs de servicios locales
    'users_service',
    'inventory_service',
    'tickets_service',
    
    # CORS y herramientas
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    'django.contrib.sites',
    
    # Core Django
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Autenticación y Allauth
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'dj_rest_auth',
    'dj_rest_auth.registration',
]

SITE_ID = 1

# USUARIO PERSONALIZADO (Módulo A)
AUTH_USER_MODEL = 'users_service.User'

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Debe ir lo más arriba posible
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = 'InnovaSolutionMVPGestionActivos.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'InnovaSolutionMVPGestionActivos.wsgi.application'


# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# Internationalization
LANGUAGE_CODE = 'es-co' # Cambiado a español
TIME_ZONE = 'America/Bogota' # Configurado para tu zona horaria
USE_I18N = True
USE_TZ = True


# Static files
STATIC_URL = 'static/'


# --- CONFIGURACIÓN DE SEGURIDAD Y JWT ---

# Variable que usamos en views.py para validar el token de Google
GOOGLE_OAUTH2_CLIENT_ID = os.getenv('GOOGLE_OAUTH2_CLIENT_ID')

# Configuración de CORS para permitir a React
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOW_CREDENTIALS = True

# Soluciona problemas de popups con Google Auth
SECURE_CROSS_ORIGIN_OPENER_POLICY = 'same-origin-allow-popups'


# --- CONFIGURACIÓN DE ALLAUTH / GOOGLE ---

SOCIALACCOUNT_ADAPTER = 'users_service.adapters.CustomSocialAccountAdapter'

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'APP': {
            'client_id': os.getenv('GOOGLE_OAUTH2_CLIENT_ID'),
            'secret': os.getenv('GOOGLE_OAUTH2_CLIENT_SECRET'),
            'key': ''
        },
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        }
    }
}

ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_USERNAME_REQUIRED = False

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'