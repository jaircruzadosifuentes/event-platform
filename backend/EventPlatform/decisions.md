# Technical Decisions

## 1. Microservices

Se utilizaron microservicios para separar responsabilidades y permitir evolución y escalamiento independiente.

* EventService
* NotificationService

## 2. Clean Architecture + DDD

Cada servicio separa:

* API
* Application
* Domain
* Infrastructure

El dominio contiene las reglas principales y la infraestructura implementa persistencia, mensajería y servicios externos.

## 3. Comunicación asíncrona

Se utiliza comunicación basada en eventos para desacoplar los servicios.

EventService publica:

`EventCreated`

NotificationService consume el evento sin depender directamente de EventService.

## 4. RabbitMQ + MassTransit

RabbitMQ fue seleccionado como broker por su integración con .NET y soporte para procesamiento asíncrono.

MassTransit se utiliza para simplificar:

* Consumers
* Retry
* Error handling
* Configuración de endpoints

## 5. SQL Server

SQL Server se utiliza como almacenamiento principal por la naturaleza transaccional de los datos de eventos, zonas y notificaciones.

Entity Framework Core se utiliza como ORM.

## 6. Redis

Redis se utiliza como caché para reducir consultas repetitivas sobre:

`GET /api/events`

La caché se invalida al crear un nuevo evento.

## 7. Idempotencia

NotificationService utiliza `MessageId` para evitar procesar dos veces el mismo mensaje.

Esto permite manejar entregas duplicadas sin generar notificaciones duplicadas.

## 8. Retry y Error Queue

Los mensajes que fallan utilizan reintentos automáticos mediante MassTransit.

Configuración:

* 3 reintentos.
* 5 segundos entre reintentos.

Si el procesamiento continúa fallando, el mensaje pasa a la cola de error.

## 9. JWT

Se utiliza JWT para proteger los endpoints que requieren autenticación.

La creación de eventos requiere el rol:

`Admin`

## 10. Validación

FluentValidation se utiliza para validar las solicitudes antes de ejecutar la lógica de negocio.

Esto permite mantener reglas de validación separadas del controlador.

## 11. Manejo de errores

Se implementó middleware global para controlar excepciones no gestionadas.

Las respuestas no exponen:

* Stack traces.
* Información de SQL.
* Detalles internos de infraestructura.

## 12. Rate Limiting

Se utiliza rate limiting para evitar un consumo excesivo de los endpoints y proporcionar una protección básica frente a abuso.

## 13. Docker

Docker Compose permite ejecutar todos los componentes necesarios localmente con una configuración reproducible.

Servicios principales:

* EventService
* NotificationService
* SQL Server
* RabbitMQ
* Redis

## 14. AWS

AWS no forma parte del despliegue del MVP local.

Para una evolución productiva se plantea utilizar servicios administrados como ECS, RDS, ElastiCache, Amazon MQ, CloudWatch y Secrets Manager.

## 15. Alcance

Se priorizaron las funcionalidades requeridas por el MVP:

* Gestión de eventos.
* Persistencia.
* Comunicación asíncrona.
* Notificaciones.
* Idempotencia.
* Retry.
* Error Queue.
* Caché.
* Seguridad básica.
* Contenerización.

Funcionalidades como pagos, venta de tickets, check-in e integraciones externas quedan como evolución posterior.
