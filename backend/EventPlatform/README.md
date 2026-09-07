# Event Platform

Plataforma para la gestión de eventos, desarrollada como una solución basada en microservicios y comunicación orientada a eventos.

El proyecto implementa un MVP enfocado en el registro de eventos, persistencia, comunicación asíncrona y generación de notificaciones.

## 1. Arquitectura

La solución está compuesta principalmente por:

* **EventService**: responsable de la creación y consulta de eventos.
* **NotificationService**: responsable de procesar los eventos recibidos y generar notificaciones.
* **RabbitMQ**: broker utilizado para la comunicación asíncrona.
* **MassTransit**: framework utilizado para abstraer la comunicación con RabbitMQ.
* **SQL Server**: persistencia de EventService y NotificationService.
* **Redis**: utilizado como mecanismo de caché para las consultas de eventos.
* **React**: frontend para el registro y consulta de eventos.

La comunicación entre servicios utiliza el evento `EventCreated`.

La documentación detallada de la arquitectura se encuentra en:

`docs/architecture.md`

Las principales decisiones técnicas se encuentran en:

`docs/decisions.md`

## 2. Tecnologías

### Backend

* .NET
* ASP.NET Core Web API
* Entity Framework Core
* MediatR
* FluentValidation
* MassTransit
* RabbitMQ
* SQL Server
* Redis
* MailKit

### Frontend

* React
* Vite
* React Router
* Bootstrap

### Seguridad

* JWT
* Autorización basada en roles
* Validación de requests
* Rate Limiting
* Manejo global de excepciones

### Infraestructura

* Docker
* Docker Compose

## 3. Estructura del proyecto

```text
EventPlatform/
│
├── backend/
│   ├── EventService/
│   │   ├── EventService.API/
│   │   ├── EventService.Application/
│   │   ├── EventService.Domain/
│   │   └── EventService.Infraestructure/
│   │
│   ├── NotificationService/
│   │   ├── NotificationService.API/
│   │   ├── NotificationService.Application/
│   │   ├── NotificationService.Domain/
│   │   └── NotificationService.Infraestructure/
│   │
│   └── EventPlataform.Contracts/
│
├── frontend/
│
├── docs/
│   ├── architecture.md
│   ├── architecture.drawio
│   ├── decisions.md
│   └── testing.md
│
├── docker-compose.yml
└── README.md
```

## 4. Requisitos

Para ejecutar el proyecto localmente se requiere:

* Docker Desktop
* Docker Compose

Para desarrollo fuera de Docker:

* .NET SDK
* Node.js
* SQL Server
* RabbitMQ
* Redis

## 5. Ejecución con Docker

Desde la raíz del proyecto:

```bash
docker compose up --build
```

Para ejecutar los servicios en segundo plano:

```bash
docker compose up -d --build
```

Para verificar los contenedores:

```bash
docker compose ps
```

Para detener los servicios:

```bash
docker compose down
```

Para revisar los logs:

```bash
docker compose logs -f
```

También es posible consultar los logs de un servicio específico:

```bash
docker compose logs -f eventservice
```

o:

```bash
docker compose logs -f notificationservice
```

## 6. Flujo principal

El flujo principal del MVP es:

1. Un usuario autorizado registra un evento desde el frontend.
2. EventService valida la información recibida.
3. El evento se persiste en SQL Server.
4. EventService publica el evento `EventCreated`.
5. RabbitMQ recibe el mensaje.
6. NotificationService consume el mensaje.
7. NotificationService verifica la idempotencia mediante `MessageId`.
8. La notificación se persiste en su propia base de datos.
9. Se realiza el envío del correo.
10. Si el procesamiento falla, MassTransit ejecuta los reintentos configurados.
11. Si el mensaje continúa fallando, termina en la cola de error.

## 7. API

### Obtener eventos

```http
GET /api/events
```

Este endpoint utiliza Redis como caché para reducir las consultas repetitivas a la base de datos.

### Obtener evento

```http
GET /api/events/{id}
```

### Registrar evento

```http
POST /api/events
```

Este endpoint requiere autenticación y rol `Admin`.

Ejemplo:

```json
{
  "name": "Tech Conference 2026",
  "date": "2026-10-15T19:00:00",
  "location": "Lima",
  "zones": [
    {
      "name": "General",
      "price": 50,
      "capacity": 500
    },
    {
      "name": "VIP",
      "price": 120,
      "capacity": 100
    }
  ]
}
```

## 8. Seguridad

La API utiliza JWT para autenticación.

El endpoint de creación de eventos está protegido mediante:

```text
[Authorize(Roles = "Admin")]
```

Se implementaron además:

* Validación de datos de entrada.
* Control de autorización.
* Rate limiting.
* Manejo global de excepciones.
* Respuestas de error controladas.
* Evitar exposición de información interna en errores.

## 9. Mensajería

El contrato principal utilizado para la comunicación entre servicios es `EventCreated`.

Incluye información como:

* `messageId`
* `eventId`
* `name`
* `occurredAt`
* `correlationId`
* `version`

La presencia de `messageId` permite implementar idempotencia en NotificationService.

## 10. Resiliencia

El procesamiento de mensajes utiliza reintentos automáticos.

Configuración actual:

* 3 reintentos.
* Intervalo de 5 segundos.

Cuando el procesamiento continúa fallando después de los reintentos, MassTransit envía el mensaje a la cola de error correspondiente.

Esto evita perder silenciosamente los mensajes que no pudieron ser procesados.

## 11. Caché

EventService utiliza Redis para almacenar temporalmente el resultado de:

```text
GET /api/events
```

La información almacenada tiene una duración de 5 minutos.

Cuando se registra un nuevo evento, la caché de eventos es invalidada.

## 12. Persistencia

Cada servicio mantiene su propia responsabilidad sobre la persistencia.

EventService utiliza SQL Server para almacenar:

* Eventos
* Zonas

NotificationService utiliza SQL Server para almacenar:

* Notificaciones
* MessageId procesados
* Estado del procesamiento
* Información de auditoría asociada al mensaje

Entity Framework Core se utiliza como ORM.

## 13. Testing

Los escenarios funcionales y técnicos implementados se encuentran documentados en:

`docs/testing.md`

Entre los escenarios considerados:

* Registro exitoso de evento.
* Validación de datos.
* Autenticación.
* Autorización.
* Caché Redis.
* Publicación de mensajes.
* Consumo de `EventCreated`.
* Idempotencia.
* Reintentos.
* Cola de error.
* Persistencia de notificaciones.

## 14. Documentación

La documentación del proyecto se encuentra en `docs/`.

### Arquitectura

`docs/architecture.md`

Describe la arquitectura general, componentes, comunicación y responsabilidades de los servicios.

### Decisiones técnicas

`docs/decisions.md`

Documenta las principales decisiones tomadas durante el desarrollo.

### Pruebas

`docs/testing.md`

Contiene los escenarios de prueba y resultados esperados.

### Diagrama

`docs/architecture.drawio`

Contiene el diagrama de arquitectura de la solución.

## 15. Roadmap

El roadmap del proyecto se encuentra definido considerando una primera versión de seis meses y una organización basada en Scrum.

El detalle se encuentra en el archivo de roadmap entregado junto con el proyecto.

## 16. AWS

El MVP se encuentra preparado para ejecución local mediante Docker Compose.

Para una implementación productiva en AWS se plantea utilizar servicios administrados como:

* Amazon ECS/EKS para ejecución de servicios.
* Application Load Balancer.
* Amazon RDS para SQL Server o PostgreSQL.
* ElastiCache para Redis.
* Amazon MQ o servicios de mensajería administrados.
* CloudWatch para observabilidad.
* Secrets Manager para gestión de secretos.
* CloudFront para distribución del frontend.

La arquitectura AWS se plantea como evolución de la implementación local, manteniendo la separación de responsabilidades de los microservicios.

## 17. Consideraciones

El alcance actual corresponde al MVP solicitado para el reto técnico.

Se priorizó:

* Separación de responsabilidades.
* Arquitectura limpia.
* DDD.
* Comunicación asíncrona.
* Persistencia independiente por servicio.
* Seguridad básica.
* Resiliencia.
* Idempotencia.
* Caché.
* Contenerización.
* Facilidad de ejecución local.

Las funcionalidades adicionales como venta de tickets, pagos, check-in, integración con proveedores externos y despliegue productivo en AWS pueden incorporarse como evolución de la plataforma.
