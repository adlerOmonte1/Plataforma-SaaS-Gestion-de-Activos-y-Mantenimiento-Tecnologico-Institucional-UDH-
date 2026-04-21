from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

class Usuario(AbstractUser):
    ROLES = (
        ('JEFE_TI', 'Jefe TI(Administrador)'),
        ('SUPERVISOR', 'Supervisor'),
        ('TECNICO', 'Técnico'),
        ('SOLICITANTE', 'Solicitante Base'), # Agregamos el rol para estudiantes/docentes
    )
    
    email = models.EmailField(unique=True)
    
    # LA CLAVE DE LA SEGURIDAD: default='SOLICITANTE'
    # Todo usuario nuevo que entre por Google nacerá estrictamente con este rol.
    rol = models.CharField(max_length=20, choices=ROLES, default='SOLICITANTE')
    
    area = models.ForeignKey(
        'Area', 
        on_delete=models.RESTRICT, 
        null=True, 
        blank=True
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.email} - {self.get_rol_display()}"

    def clean(self):
        if self.email and not self.email.endswith('@udh.edu.pe'):
            raise ValidationError({'email': 'Solo correos @udh.edu.pe.'})