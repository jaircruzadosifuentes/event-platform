# Architecture

## 1. Overview

EventPlatform utiliza una arquitectura basada en microservicios y comunicación orientada a eventos.

Componentes principales:

* **EventService**: gestión de eventos y zonas.
* **NotificationService**: procesamiento de notificaciones.
* **RabbitMQ**: broker de mensajería.
* **MassTransit**: comunicación con RabbitMQ.
* **SQL Server**: persistencia.
* **Redis**: caché.
* **React**: frontend.

## 2. Comunicación

La comunicación entre servicios utiliza dos mecanismos:

### Síncrona

React → EventService mediante HTTP/REST.

### Asíncrona

EventService → RabbitMQ → NotificationService

El evento utilizado es:

`EventCreated`

## 3. Flujo de creación

1. El usuario registra un evento desde React.
2. EventService valida la solicitud.
3. El evento y sus zonas se almacenan en SQL Server.
4. Se publica `EventCreated`.
5. RabbitMQ entrega el mensaje a NotificationService.
6. NotificationService verifica `MessageId`.
7. Se registra la notificación.
8. Se envía el correo.
9. Si ocurre un error, MassTransit realiza los reintentos.
10. Después de los reintentos, el mensaje pasa a la cola de error.

## 4. Persistencia

Cada servicio mantiene su propia responsabilidad sobre los datos.

**EventService**

* Events
* Zones

**NotificationService**

* Notifications
* MessageId procesados
* Estado de procesamiento

## 5. Caché

Redis se utiliza para:

`GET /api/events`

La caché tiene una duración de 5 minutos y se invalida cuando se crea un nuevo evento.

## 6. Seguridad

* JWT
* Roles
* `[Authorize(Roles = "Admin")]`
* Validación de requests
* Rate limiting
* Manejo global de excepciones

## 7. Resiliencia

Se implementan:

* Retry mediante MassTransit.
* Idempotencia mediante `MessageId`.
* Cola de error para mensajes no procesados.
* Rate limiting.
* Caché Redis.

## 8. Contenedores

Docker Compose ejecuta:

* EventService
* NotificationService
* SQL Server
* RabbitMQ
* Redis

El archivo `architecture.drawio` contiene el diagrama visual de la arquitectura.

## 9. Evolución AWS

Para producción se plantea:

* ECS/EKS
* Application Load Balancer
* RDS
* ElastiCache
* Amazon MQ
* CloudWatch
* Secrets Manager
* CloudFront
