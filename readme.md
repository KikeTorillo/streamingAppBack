# StreamingAppBack

Plataforma integral de streaming que combina un backend en Node.js, un frontend en React y varios servicios orquestados con Docker Compose. Permite subir, procesar y reproducir videos en múltiples calidades usando una infraestructura propia basada en NGINX, MinIO y PostgreSQL.

## Características destacadas

- **API REST Express** para gestionar usuarios, películas, series y episodios.
- **Frontend React + Vite** con Storybook para la librería de componentes.
- **Transcodificación automática** de videos mediante FFmpeg en servidores dedicados.
- **Almacenamiento S3** a través de MinIO para archivos multimedia y carátulas.
- **CDN NGINX** con servidores de transcodificación independientes.
- **Base de datos PostgreSQL** con pgAdmin incluido para administración.
- **Contenedores Docker** para un despliegue reproducible y sencillo.

## Arquitectura resumida

```
┌───────────┐          ┌───────────────┐
│ Frontend  │◄────────►│  Backend API  │
└─────┬─────┘          └───────┬───────┘
      │                        │
      │                        │
┌─────▼─────┐          ┌───────▼────────┐
│   CDN     │◄────────►│   MinIO S3     │
└─────┬─────┘          └───────┬────────┘
      │                        │
┌─────▼─────┐          ┌───────▼────────┐
│Transcoder1│          │  PostgreSQL    │
└────────────┘          └────────────────┘
```

Cada componente se ejecuta en un contenedor independiente y se comunica a través de la red `lan` definida en `docker-compose.yml`.

## Estructura del repositorio

```
streamingAppBack/
├── backend/       # Código y Dockerfiles del backend
├── frontend/      # Código del frontend y Storybook
├── servers/       # Configuración de CDN, transcoders, MinIO y PostgreSQL
├── docker-compose.yml
├── example.env    # Variables de entorno de referencia
└── readme.md
```

## Variables de entorno

El archivo `example.env` incluye todas las variables necesarias para la ejecución. Copia este archivo a `.env` y personaliza las siguientes secciones básicas:

- **Frontend** (`VITE_*`): URL y claves para el entorno de desarrollo.
- **Backend** (`API_KEY`, `JWT_SECRET`, puertos y lista blanca de CORS).
- **PostgreSQL** (`DB_NAME`, `DB_USER`, `DB_PASSWORD`, `PG_PORT`).
- **MinIO** (`MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD`, `MINIO_BUCKET`).
- **NGINX/CDN** (IPs y puertos de los transcodificadores).

## Puesta en marcha rápida

1. Clona el proyecto y accede a la carpeta:
   ```bash
   git clone <repo-url>
   cd streamingAppBack
   ```
2. Copia el archivo de ejemplo y ajusta tu entorno:
   ```bash
   cp example.env .env
   # edita .env según tus necesidades
   ```
3. Construye y levanta todos los servicios:
   ```bash
   docker compose up -d --build
   ```
4. Una vez iniciados, visita:
   - Backend: [http://localhost:3000](http://localhost:3000)
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Storybook: [http://localhost:6006](http://localhost:6006)
   - MinIO: [http://localhost:9001](http://localhost:9001) (usuario y contraseña definidos en `.env`)
   - pgAdmin: [http://localhost:5050](http://localhost:5050)

## Scripts frecuentes

En `backend/app` existen comandos para facilitar el desarrollo:

- `npm run dev` – ejecuta todos los contenedores con recarga automática.
- `npm run stop` – detiene y elimina los contenedores activos.
- `npm run clean` – borra volúmenes y carpetas temporales.

En la carpeta `frontend` dispones de scripts equivalentes para Vite y Storybook (`npm run dev`, `npm run build`, etc.).

## Contribución

1. Haz un fork del repositorio y crea una rama: `git checkout -b feature/nueva-funcionalidad`.
2. Aporta tus cambios siguiendo las [conventional commits](https://www.conventionalcommits.org/es/v1.0.0/).
3. Abre un Pull Request describiendo claramente tu mejora.

## Licencia

Este proyecto se publica bajo la licencia **ISC**.

## Autor

Desarrollado por [Kike Torillo](https://github.com/KikeTorillo). Para dudas o sugerencias escribe a [arellanestorillo@yahoo.com](mailto:arellanestorillo@yahoo.com).
