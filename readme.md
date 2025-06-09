# 🎬 Streaming App Backend

Una plataforma backend escalable para streaming de contenido multimedia que permite gestionar películas, series y episodios con transcodificación automática de video y distribución mediante CDN.

## 🚀 Características Principales

- **📤 Gestión de Videos**: Carga, transcodificación automática y almacenamiento en múltiples calidades (480p, 720p, 1080p)
- **🎭 Catálogo Multimedia**: Sistema completo para películas, series, episodios y categorías
- **☁️ Almacenamiento S3**: Integración con MinIO (compatible con Amazon S3) 
- **🔒 Autenticación JWT**: Sistema seguro de autenticación basado en tokens
- **🌐 CDN Integrado**: NGINX como Content Delivery Network para optimizar la entrega
- **📊 Base de Datos Robusta**: PostgreSQL con pgAdmin para administración
- **🐳 Containerizado**: Arquitectura completa con Docker Compose

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend/API  │◄──►│   Express API   │◄──►│   PostgreSQL    │
│     Client      │    │   (Node.js)     │    │   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                               │
                               ▼
                    ┌─────────────────┐    ┌─────────────────┐
                    │   MinIO S3      │◄──►│   NGINX CDN     │
                    │   Storage       │    │   Server        │
                    └─────────────────┘    └─────────────────┘
```

## 📁 Estructura del Proyecto

```
streamingAppBack/
├── App/                     # 🏠 Aplicación principal Node.js
│   ├── Dockerfile          # 🐳 Configuración de contenedor
│   ├── package.json        # 📦 Dependencias del backend
│   ├── src/                # 📂 Código fuente
│   │   ├── controllers/    # 🎮 Lógica de controladores
│   │   ├── routes/         # 🛣️ Definición de rutas API
│   │   ├── models/         # 🗃️ Modelos de datos
│   │   └── middleware/     # 🔧 Middleware personalizado
│   └── .env.example        # 🔑 Plantilla de variables de entorno
├── collections/            # 📊 Scripts de inicialización de datos
├── servers/                # ⚙️ Configuraciones de servicios
│   ├── nginx/             # 🌐 Configuración NGINX
│   ├── minio/             # ☁️ Configuración MinIO
│   └── postgres/          # 🗄️ Configuración PostgreSQL
├── docker-compose.yml      # 🐳 Orquestación de servicios
├── clean.js               # 🧹 Script de limpieza
└── README.md              # 📖 Documentación
```

## 🛠️ Tecnologías Utilizadas

### Backend Core
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web minimalista
- **PostgreSQL** - Base de datos relacional
- **MinIO** - Almacenamiento de objetos S3-compatible

### Procesamiento de Video
- **FFmpeg** - Transcodificación de video
- **fluent-ffmpeg** - Wrapper de Node.js para FFmpeg

### Seguridad & Autenticación
- **JWT** (jsonwebtoken) - Autenticación basada en tokens
- **bcrypt** - Cifrado de contraseñas
- **Multer** - Manejo seguro de uploads

### Infraestructura
- **Docker & Docker Compose** - Containerización
- **NGINX** - Servidor web y CDN
- **pgAdmin** - Administración de base de datos

### Desarrollo
- **Nodemon** - Auto-reload en desarrollo
- **ESLint & Prettier** - Linting y formateo de código

## 📋 Prerrequisitos

- **Node.js** v16 o superior ([Descargar](https://nodejs.org/))
- **Docker** y **Docker Compose** ([Instalar](https://www.docker.com/))
- **Git** para clonar el repositorio

## ⚡ Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone https://github.com/KikeTorillo/streamingAppBack.git
cd streamingAppBack
```

### 2. Configurar Variables de Entorno
Copia el archivo de ejemplo y configura tus variables:
```bash
cp App/.env.example App/.env
```

Edita el archivo `.env` con tu configuración:
```env
# 🗄️ Configuración PostgreSQL
DB_NAME=streaming_db
DB_USER=admin
DB_PASSWORD=secure_password_2024
DB_HOST=postgres
DB_PORT=5432

# ☁️ Configuración MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin123
MINIO_REGION=us-east-1
IP_ADDRESS_MINIO=192.168.0.10

# 🌐 Configuración NGINX CDN
NGINX_IP_ADDRESS_CDN=192.168.0.11
NGINX_CDN_SERVER1_PORT=8082
NGINX_TRANSCODER1=192.168.0.12
NGINX_TRANSCODER2=192.168.0.13

# 🌐 Red personalizada
SUBNET=192.168.0.0/24
GATEWAY=192.168.0.1

# 🔑 JWT Secret
JWT_SECRET=your_super_secret_key_here

# 🔧 App Configuration
NODE_ENV=development
PORT=3000
```

### 3. Instalar Dependencias
```bash
npm install
```

## 🚀 Comandos de Ejecución

### Desarrollo (Recomendado)
```bash
npm run dev
```
Inicia todos los servicios con Docker y activa el modo desarrollo con auto-reload.

### Producción
```bash
npm start
```
Inicia el servidor en modo producción.

### Gestión de Contenedores
```bash
# Detener servicios
npm run stop

# Limpiar completamente (contenedores + volúmenes)
npm run clean

# Ver logs de servicios
docker-compose logs -f
```

### Herramientas de Desarrollo
```bash
# Verificar código con ESLint
npm run lint

# Formatear código con Prettier
npm run format
```

## 🌐 Acceso a Servicios

Una vez iniciado el proyecto, puedes acceder a:

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| 🔌 **API REST** | http://localhost:3000 | - |
| ☁️ **MinIO Console** | http://localhost:9001 | `minioadmin` / `minioadmin123` |
| 📊 **pgAdmin** | http://localhost:5050 | `pgadmin@example.com` / `your_password` |
| 🌐 **NGINX CDN** | http://localhost:8082 | - |

## 📚 API Endpoints

### Autenticación
```http
POST /api/auth/register    # Registro de usuario
POST /api/auth/login       # Inicio de sesión
POST /api/auth/refresh     # Renovar token
```

### Gestión de Videos
```http
GET    /api/videos         # Listar videos
POST   /api/videos         # Subir nuevo video
GET    /api/videos/:id     # Obtener video específico
PUT    /api/videos/:id     # Actualizar video
DELETE /api/videos/:id     # Eliminar video
```

### Películas y Series
```http
GET    /api/movies         # Listar películas
POST   /api/movies         # Crear película
GET    /api/series         # Listar series
POST   /api/series         # Crear serie
GET    /api/episodes       # Listar episodios
POST   /api/episodes       # Crear episodio
```

### Categorías
```http
GET    /api/categories     # Listar categorías
POST   /api/categories     # Crear categoría
PUT    /api/categories/:id # Actualizar categoría
DELETE /api/categories/:id # Eliminar categoría
```

## 🗃️ Esquema de Base de Datos

### Tablas Principales

- **`videos`** - Almacena información de archivos de video
- **`movies`** - Información de películas
- **`series`** - Información de series
- **`episodes`** - Episodios de series
- **`categories`** - Categorías de contenido
- **`users`** - Usuarios del sistema

## 🔧 Configuración Avanzada

### Personalizar Calidades de Video
Edita la configuración de FFmpeg en `src/services/videoService.js` para agregar o modificar las calidades de transcodificación.

### Configurar CDN
Modifica `servers/nginx/nginx.conf` para personalizar el comportamiento del CDN y las reglas de caché.

### Escalabilidad
Para entornos de producción, considera:
- Usar un cluster de PostgreSQL
- Implementar múltiples instancias de MinIO
- Configurar load balancing con NGINX

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Para contribuir:

1. **Fork** el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios con commits descriptivos
4. Push a tu rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un **Pull Request**

### Estándares de Código
- Sigue las reglas de ESLint definidas en el proyecto
- Usa commits descriptivos siguiendo [Conventional Commits](https://www.conventionalcommits.org/)
- Añade tests para nuevas funcionalidades

## 📝 Licencia

Este proyecto está bajo la licencia **ISC**. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto y Soporte

- **✉️ Email**: [arellanestorillo@yahoo.com](mailto:arellanestorillo@yahoo.com)
- **🐙 GitHub**: [@KikeTorillo](https://github.com/KikeTorillo)
- **🐛 Issues**: [Reportar problemas](https://github.com/KikeTorillo/streamingAppBack/issues)

## 🙏 Reconocimientos

- Gracias a la comunidad de Node.js y Docker por las herramientas increíbles
- FFmpeg por hacer posible la transcodificación de video
- MinIO por la solución de almacenamiento S3-compatible

---

⭐ **¡Si este proyecto te resultó útil, no olvides darle una estrella!** ⭐