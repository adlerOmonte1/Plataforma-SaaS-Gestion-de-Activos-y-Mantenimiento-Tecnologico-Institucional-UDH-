from django.db import models

class Equipo(models.Model):
    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=100)
    # Regla: Unicidad de Número de Serie
    numero_serie = models.CharField(max_length=100, unique=True) 
    fecha_compra = models.DateField()
    
    # Integridad de Datos: Vinculado obligatoriamente a un Área activa
    area = models.ForeignKey(
        'users_service.Area', 
        on_delete=models.RESTRICT,
        related_name='equipos'
    )
    
    # Regla: Borrado Lógico (Cambio de estado a "Dado de baja")
    class Estados(models.TextChoices):
        ACTIVO = 'ACTIVO', 'Activo'
        MANTENIMIENTO = 'MANTENIMIENTO', 'En Mantenimiento'
        BAJA = 'BAJA', 'Dado de Baja'
        
    estado = models.CharField(
        max_length=20, 
        choices=Estados.choices, 
        default=Estados.ACTIVO
    )

    def __str__(self):
        return f"{self.marca} {self.modelo} - SN: {self.numero_serie}"