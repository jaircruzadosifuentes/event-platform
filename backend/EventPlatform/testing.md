# Testing

## 1. Registro de evento

**Endpoint**

```http
POST /api/events
```

**Validar**

* JWT válido.
* Rol `Admin`.
* Nombre obligatorio.
* Fecha válida.
* Ubicación obligatoria.
* Zonas con capacidad mayor a 0.
* Precio mayor o igual a 0.

**Resultado esperado**

`201 Created`

El evento debe aparecer en SQL Server.

---

## 2. Consulta de eventos

**Endpoint**

```http
GET /api/events
```

**Primera ejecución**

* Consulta SQL Server.
* Guarda resultado en Redis.

**Segunda ejecución**

* Obtiene resultado desde Redis.

**Resultado esperado**

`200 OK`

---

## 3. Comunicación asíncrona

Crear un evento mediante:

```http
POST /api/events
```

Verificar:

* `EventCreated` publicado.
* Mensaje recibido por RabbitMQ.
* NotificationService consume el mensaje.

**Resultado esperado**

La notificación queda registrada en SQL Server.

---

## 4. Envío de correo

Al consumir `EventCreated`:

* Se procesa el mensaje.
* Se registra la notificación.
* Se envía el correo.
* El estado cambia a `Sent`.

**Resultado esperado**

Correo enviado correctamente.

---

## 5. Idempotencia

Enviar nuevamente el mismo `MessageId`.

**Resultado esperado**

El mensaje no debe generar una nueva notificación ni enviar nuevamente el correo cuando ya fue procesado correctamente.

---

## 6. Retry

Provocar un error durante el procesamiento del mensaje.

**Configuración**

* 3 reintentos.
* 5 segundos entre reintentos.

**Resultado esperado**

MassTransit reintenta el procesamiento automáticamente.

---

## 7. Error Queue / DLQ

Mantener el error después de los reintentos.

**Resultado esperado**

El mensaje termina en la cola de error de RabbitMQ.

---

## 8. Autenticación

Realizar:

```http
POST /api/events
```

sin JWT.

**Resultado esperado**

`401 Unauthorized`

---

## 9. Autorización

Realizar:

```http
POST /api/events
```

con un usuario sin rol `Admin`.

**Resultado esperado**

`403 Forbidden`

---

## 10. Validación

Enviar información inválida.

Ejemplo:

```json
{
  "name": "",
  "date": "",
  "location": "",
  "zones": []
}
```

**Resultado esperado**

`400 Bad Request`

La respuesta no debe mostrar información interna de la aplicación.

---

## 11. Manejo de errores

Provocar una excepción interna.

**Resultado esperado**

La API devuelve:

```json
{
  "message": "Ocurrió un error interno."
}
```

No debe exponer stack trace ni detalles de SQL.

---

## 12. Resultado

| Prueba                   | Resultado |
| ------------------------ | --------- |
| Registro de evento       | OK        |
| Persistencia SQL Server  | OK        |
| Caché Redis              | OK        |
| EventCreated             | OK        |
| Consumer                 | OK        |
| Idempotencia             | OK        |
| Retry                    | OK        |
| Error Queue              | OK        |
| JWT                      | OK        |
| Autorización             | OK        |
| Validaciones             | OK        |
| Manejo global de errores | OK        |
| Rate limiting            | OK        |
| Envío de correo          | OK        |
