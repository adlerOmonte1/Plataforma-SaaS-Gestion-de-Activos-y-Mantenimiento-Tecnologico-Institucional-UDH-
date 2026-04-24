from django.db import models
from django.contrib.auth.models import AbstractUser

class Area(models.Model):
    codigo = models.CharField(max_length=20, unique=True, null=True) # Ej: RRHH-01
    nombre_area = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    sede_bloque = models.CharField(max_length=100, null=True) # Ej: Sede Central
    
    is_active = models.BooleanField(default=True) # Para el borrado lógico
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.codigo} - {self.nombre_area}"

class User(AbstractUser):
    class Roles(models.TextChoices):
        ADMIN = 'JEFE_TI', 'Jefe TI (Administrador)'
        SUPERVISOR = 'SUPERVISOR', 'Supervisor'
        TECNICO = 'TECNICO', 'Técnico'
        SOLICITANTE = 'SOLICITANTE', 'Solicitante Base' # Docentes/Estudiantes

    rol = models.CharField(
        max_length=20, 
        choices=Roles.choices, 
        default=Roles.SOLICITANTE
    )
    
    # Regla: Relación 1 a 1 de Supervisor/Técnico con un Área
    area_asignada = models.ForeignKey(
        Area, 
        on_delete=models.RESTRICT, # Protege que no se borre el área si hay usuarios
        null=True, 
        blank=True,
        related_name='personal'
    )

    def __str__(self):
        return f"{self.email} - {self.rol}"