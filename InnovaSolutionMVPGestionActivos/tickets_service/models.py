from django.db import models
from django.conf import settings # Para llamar a tu modelo de usuario de forma segura

class Ticket(models.Model):
    # Relaciones base
    equipo = models.ForeignKey('inventory_service.Equipo', on_delete=models.RESTRICT)
    solicitante = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.RESTRICT, related_name='tickets_creados')
    
    # Datos iniciales del estudiante (Evidencia 1)
    descripcion_falla = models.TextField()
    url_foto_falla = models.URLField(max_length=500) # El string hacia Azure Blob Storage
    fecha_reporte = models.DateTimeField(auto_now_add=True)

    # Gestión Operativa (Supervisores y Técnicos)
    supervisor_area = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.RESTRICT, related_name='tickets_supervisados')
    tecnico_asignado = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.RESTRICT, null=True, blank=True, related_name='tickets_asignados')
    
    class Prioridades(models.TextChoices):
        ALTA = 'ALTA', 'Alta'
        MEDIA = 'MEDIA', 'Media'
        BAJA = 'BAJA', 'Baja'
    prioridad = models.CharField(max_length=10, choices=Prioridades.choices, null=True, blank=True)

    class Estados(models.TextChoices):
        PENDIENTE = 'PENDIENTE', 'Pendiente'
        ASIGNADO = 'ASIGNADO', 'Asignado a Técnico'
        CERRADO = 'CERRADO', 'Resuelto / Cerrado'
    estado_ticket = models.CharField(max_length=15, choices=Estados.choices, default=Estados.PENDIENTE)

    # Regla: Cierre Documentado (Evidencia 2)
    diagnostico_cierre = models.TextField(null=True, blank=True)
    url_foto_cierre = models.URLField(max_length=500, null=True, blank=True)
    fecha_cierre = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Ticket #{self.id} - {self.equipo.numero_serie} ({self.estado_ticket})"