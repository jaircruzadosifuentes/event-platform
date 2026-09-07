# EventPlatform

EventPlatform es una plataforma para la gestión de eventos. El proyecto está separado en frontend y backend, con los servicios del backend preparados para ejecutarse mediante Docker Compose.

## Estructura del proyecto

```text
EventPlatform/
├── backend/
│   └── EventPlatform/
├── frontend/
│   └── EventPlataform.FrontEnd/
├── .gitignore
└── README.md
```

## Tecnologías

### Backend

* C#
* .NET
* ASP.NET Core
* Entity Framework Core
* SQL Server
* MassTransit
* Docker
* Docker Compose

### Frontend

* React
* Vite
* TypeScript
* tailwind
* Node.js
* npm

## Requisitos

Antes de comenzar, instala:

* Git
* Docker Desktop
* Node.js
* npm

Para comprobar las instalaciones:

```bash
git --version
docker --version
node --version
npm --version
```

## Clonar el proyecto

Clona el repositorio:

```bash
git clone https://github.com/jaircruzadosifuentes/event-platform.git
```

Ingresa al proyecto:

```bash
cd EventPlatform
```

---

# Backend

El backend se ejecuta utilizando Docker Compose.

## 1. Levantar los servicios

Desde la raíz del proyecto:

```bash
docker compose up -d
```

Docker se encargará de construir las imágenes y levantar los contenedores definidos en el archivo `docker-compose.yml`.

## 2. Verificar los contenedores

```bash
docker ps
```

## 3. Ver los logs

Para ver los logs de todos los servicios:

```bash
docker compose logs -f
```

Para consultar los logs de un servicio específico:

```bash
docker logs <nombre-del-contenedor>
```

## 4. Reconstruir los servicios

Si realizaste cambios en el código del backend:

```bash
docker compose up -d --build
```

## 5. Detener los servicios

```bash
docker compose down
```

## 6. Detener y eliminar los contenedores

```bash
docker compose down
```

> Los datos de los servicios que utilicen volúmenes de Docker pueden mantenerse dependiendo de la configuración del `docker-compose.yml`.

---

# Frontend

El frontend se ejecuta de forma independiente utilizando Node.js y Vite.

## 1. Entrar al frontend

Desde la raíz del proyecto:

```bash
cd frontend/EventPlataform.FrontEnd
```

## 2. Instalar dependencias

```bash
npm install
```

## 3. Ejecutar en desarrollo

```bash
npm run dev
```

Vite mostrará en la terminal la dirección donde está disponible la aplicación, normalmente:

```text
http://localhost:5173
```

Abre la dirección indicada en el navegador.

---

# Ejecutar todo el proyecto

Después de clonar el repositorio, el flujo habitual es:

### Terminal 1 — Backend

Desde la raíz:

```bash
docker compose up -d
```

Verificar:

```bash
docker ps
```

### Terminal 2 — Frontend

```bash
cd frontend/EventPlataform.FrontEnd
npm install
npm run dev
```

Con esto tendrás el backend ejecutándose mediante Docker y el frontend ejecutándose con Vite.

---

# Desarrollo

Si modificas el backend y necesitas reconstruir las imágenes:

```bash
docker compose up -d --build
```

Si modificas únicamente el frontend, normalmente basta con mantener:

```bash
npm run dev
```

ejecutándose.

Para detener el backend:

```bash
docker compose down
```

