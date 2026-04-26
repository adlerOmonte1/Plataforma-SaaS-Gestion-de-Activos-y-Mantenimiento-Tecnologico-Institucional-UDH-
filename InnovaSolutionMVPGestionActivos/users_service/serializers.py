import re
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Area

User = get_user_model()

class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'

class RegistroUsuarioSerializer(serializers.ModelSerializer):
    nombres = serializers.CharField(source='first_name')
    apellidos = serializers.CharField(source='last_name')

    class Meta:
        model = User
        fields = ['email', 'nombres', 'apellidos', 'rol', 'area_asignada']

    def validate_email(self, value):
        patron = r"^[a-zA-Z0-9_.+-]+@udh\.edu\.pe$"
        if not re.match(patron, value):
            raise serializers.ValidationError("Debe ingresar un dominio oficial de la institución (@udh.edu.pe)")
        
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("El correo ingresado ya se encuentra registrado en el sistema.")
        
        return value

    def validate(self, data):
        rol = data.get('rol')
        area = data.get('area_asignada')
        
        # Validaciones del área para Supervisores
        if rol == 'SUPERVISOR' and not area:
            raise serializers.ValidationError({"area_asignada": "Un Supervisor debe tener un área de trabajo asignada."})
        
        if rol != 'SUPERVISOR' and area:
            data['area_asignada'] = None 
            
        return data

    def create(self, validated_data):
        email = validated_data['email']
        
        # Generamos un username automático a partir del correo (lo que está antes del @)
        base_username = email.split('@')[0]
        username = base_username
        
        # Si por alguna razón el username ya existe, le agregamos un número
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        # Creamos el usuario SIN contraseña
        user = User(
            username=username,
            email=email,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            rol=validated_data.get('rol', 'SOLICITANTE'),
            area_asignada=validated_data.get('area_asignada')
        )
        
        # 3. Regla: Inhabilitar contraseñas (Solo login por OAuth/Google)
        user.set_unusable_password() 
        user.save()
        
        return user