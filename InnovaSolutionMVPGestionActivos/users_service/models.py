from django.db import models
from django.contrib.auth.models import AbstractUser

class Area(models.Model):
    nombre_area = models.CharField(max_length=100, unique=True) # Regla: Unicidad
    is_active = models.BooleanField(default=True) # Regla: Inactivación Segura (Borrado Lógico)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre_area

class User(AbstractUser):
    # Regla: Roles Fijos e Inmutables
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