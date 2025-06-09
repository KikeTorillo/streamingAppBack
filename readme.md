# 🎬 StreamingApp Backend

Una plataforma backend completa para streaming de contenido multimedia que permite gestionar películas, series y episodios con transcodificación automática de video, almacenamiento distribuido y CDN integrado.

## 🚀 Características Principales

- **📤 Gestión de Videos**: Subida y transcodificación automática en múltiples calidades usando FFmpeg
- **🎭 Catálogo Multimedia**: Sistema completo para películas, series, episodios y categorías
- **☁️ Almacenamiento S3**: Integración con MinIO (compatible con Amazon S3)
- **🔒 Autenticación JWT**: Sistema seguro con estrategias local y JWT
- **🌐 CDN Multi-Servidor**: NGINX como CDN principal + servidores de transcodificación
- **📊 Base de Datos**: PostgreSQL con scripts de inicialización
- **🐳 Arquitectura Dockerizada**: Orquestación completa con Docker Compose
- **📡 API Testing**: Colecciones Bruno para pruebas de API

## 🏗️ Arquitectura del Sistema

```
                    ┌─────────────────┐
                    │   Client/API    │
                    │   Requests      │
                    └─────────┬───────┘
                              │
                    ┌─────────▼───────┐
                    │   Express API   │
                    │   (Node.js)     │
                    └─────────┬───────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼───────┐    ┌────────▼────────┐    ┌──────▼──────┐
│  PostgreSQL   │    │     MinIO S3    │    │ NGINX CDN   │
│   Database    │    │    Storage      │    │   Server    │
└───────────────┘    └─────────────────┘    └──────┬──────┘
                                                    │
                                          ┌─────────┴─────────┐
                                          │                   │
                                   ┌──────▼──────┐    ┌──────▼──────┐
                                   │ Transcoder1 │    │ Transcoder2 │
                                   │   Server    │    │   Server    │
                                   └─────────────┘    └─────────────┘
```

## 📁 Estructura del Proyecto

```
streamingAppBack/
├── app/                           # 🏠 Aplicación principal Node.js
│   ├── config/                   # ⚙️ Configuraciones de la aplicación
│   │   └── config.js            # 🔧 Configuración principal
│   ├── documentation/            # 📚 Documentación técnica
│   │   ├── comandosServerNgix.html
│   │   ├── docker_install_instructions_updated.html
│   │   └── vodKaltura.html
│   ├── libs/                     # 📚 Librerías compartidas
│   │   └── postgresPool.js      # 🗄️ Pool de conexiones PostgreSQL
│   ├── middleware/               # 🔧 Middleware de Express  
│   │   ├── authHandler.js       # 🔐 Manejo de autenticación
│   │   ├── errorHandler.js      # ❌ Manejo de errores
│   │   ├── upload.js            # 📤 Subida de archivos
│   │   └── validatorHandler.js  # ✅ Validación de datos
│   ├── routes/                   # 🛣️ Definición de rutas API
│   │   ├── authRouter.js        # 🔑 Rutas de autenticación
│   │   ├── categoriesRoutes.js  # 📂 Rutas de categorías
│   │   ├── episodesRouter.js    # 📺 Rutas de episodios
│   │   ├── moviesRoutes.js      # 🎬 Rutas de películas
│   │   ├── seriesRoutes.js      # 📻 Rutas de series
│   │   ├── usersRoutes.js       # 👥 Rutas de usuarios
│   │   └── index.js             # 🏠 Router principal
│   ├── schemas/                  # 📋 Esquemas de validación
│   │   ├── categoriesSchemas.js
│   │   ├── episodesSchema.js
│   │   ├── moviesSchemas.js
│   │   ├── seriesSchemas.js
│   │   └── usersSchemas.js
│   ├── services/                 # 🛎️ Lógica de negocio
│   │   ├── authService.js       # 🔐 Servicio de autenticación
│   │   ├── categoriesService.js # 📂 Servicio de categorías
│   │   ├── moviesService.js     # 🎬 Servicio de películas
│   │   ├── seriesService.js     # 📻 Servicio de series
│   │   └── usersService.js      # 👥 Servicio de usuarios
│   ├── utils/                    # 🧰 Utilidades y helpers
│   │   ├── auth/                # 🔐 Estrategias de autenticación
│   │   │   ├── strategies/
│   │   │   │   ├── jwtStrategy.js
│   │   │   │   └── localStrategy.js
│   │   │   └── index.js
│   │   ├── sql/                 # 🗄️ Utilidades SQL
│   │   │   └── updateAbtraction.js
│   │   ├── aws.js               # ☁️ Integración AWS/MinIO
│   │   ├── configMediaQualities.js # 🎥 Configuración de calidades
│   │   ├── configureAuditContext.js # 📊 Context de auditoría
│   │   ├── ffmpegOptions.js     # 🎞️ Opciones de FFmpeg
│   │   ├── fileHelpers.js       # 📁 Helpers de archivos
│   │   ├── getPresignedUrl.js   # 🔗 URLs pre-firmadas
│   │   ├── imageProcessor.js    # 🖼️ Procesador de imágenes
│   │   ├── mp4-transcoder.js    # 🎬 Transcodificador MP4
│   │   ├── subtitleProcessor.js # 📝 Procesador de subtítulos
│   │   ├── transcodeSettings.js # ⚙️ Configuración transcodificación
│   │   └── vod-unique-url.js    # 🔗 URLs únicas para VOD
│   ├── dockerfile.app           # 🐳 Dockerfile para producción
│   ├── dockerfile.appdev        # 🐳 Dockerfile para desarrollo
│   ├── index.js                 # 🚀 Punto de entrada de la app
│   ├── package.json             # 📦 Dependencias del backend
│   └── package-lock.json        # 🔒 Lockfile de dependencias
├── collections/                  # 🧪 Colecciones de pruebas Bruno
│   ├── Auth/                    # 🔐 Pruebas de autenticación
│   ├── categories/              # 📂 Pruebas de categorías
│   ├── Episodes/                # 📺 Pruebas de episodios
│   ├── Movies/                  # 🎬 Pruebas de películas
│   ├── Series/                  # 📻 Pruebas de series
│   ├── users/                   # 👥 Pruebas de usuarios
│   ├── environments/            # 🌍 Entornos de prueba
│   └── bruno.json               # ⚙️ Configuración Bruno
├── servers/                      # 🖥️ Configuración de servidores
│   ├── cdn/                     # 🌐 Servidor CDN principal
│   │   ├── nginx_cache/         # 💾 Caché de NGINX
│   │   ├── index.html          # 🏠 Página de inicio CDN
│   │   └── nginx.conf.template  # ⚙️ Template configuración NGINX
│   ├── minio/                   # ☁️ Servidor MinIO
│   │   ├── aws3DataMinio/       # 💾 Datos de MinIO
│   │   └── init-minio.sh        # 🚀 Script inicialización MinIO
│   ├── postgresQl/              # 🗄️ Servidor PostgreSQL
│   │   ├── postgres_data/       # 💾 Datos de PostgreSQL
│   │   ├── Dockerfile           # 🐳 Dockerfile PostgreSQL
│   │   └── init.sql             # 🗄️ Script inicialización BD
│   ├── transcoderServers/       # 🎞️ Servidores de transcodificación
│   │   ├── transcoder1/         # 🎬 Servidor transcodificador 1
│   │   └── transcoder2/         # 🎬 Servidor transcodificador 2
│   ├── dockerfile               # 🐳 Dockerfile general servidores
│   └── entrypoint.sh           # 🚀 Script de entrada servidores
├── clean.js                     # 🧹 Script limpieza contenedores
├── docker-compose.yml           # 🐳 Orquestación completa
├── .editorconfig               # 🎨 Configuración del editor
├── .env                        # 🔑 Variables de entorno
├── .gitignore                  # 🚫 Archivos ignorados Git
└── readme.md                   # 📖 Documentación
```

## 🛠️ Stack Tecnológico

### Backend Core
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web RESTful
- **PostgreSQL** - Base de datos relacional con pool de conexiones
- **MinIO** - Almacenamiento de objetos S3-compatible

### Procesamiento de Video
- **FFmpeg** - Transcodificación de video multi-calidad
- **fluent-ffmpeg** - Wrapper Node.js para FFmpeg
- **Transcodificadores distribuidos** - Servidores dedicados para procesamiento

### Seguridad & Autenticación
- **Passport.js** - Estrategias de autenticación (Local + JWT)
- **JWT** (jsonwebtoken) - Tokens de autenticación
- **bcrypt** - Cifrado seguro de contraseñas
- **Multer** - Manejo seguro de uploads

### Infraestructura
- **Docker & Docker Compose** - Containerización completa
- **NGINX** - CDN principal + servidores de transcodificación
- **pgAdmin** - Administración PostgreSQL

### Testing & Development
- **Bruno** - Cliente API para testing
- **Nodemon** - Auto-reload en desarrollo
- **ESLint** - Linting de código

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
Edita el archivo `.env` con tu configuración:
```env
# 🗄️ PostgreSQL
DB_NAME=streaming_api
DB_USER=admin
DB_PASSWORD=secure_password_2024
DB_HOST=postgres
DB_PORT=5432

# ☁️ MinIO S3
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin123
MINIO_REGION=us-east-1
IP_ADDRESS_MINIO=192.168.0.10

# 🌐 NGINX CDN
NGINX_IP_ADDRESS_CDN=192.168.0.11
NGINX_CDN_SERVER1_PORT=8082
NGINX_TRANSCODER1=192.168.0.12
NGINX_TRANSCODER2=192.168.0.13

# 🌐 Red Docker
SUBNET=192.168.0.0/24
GATEWAY=192.168.0.1

# 🔑 JWT & Auth
JWT_SECRET=your_super_secret_jwt_key_here_2024
SESSION_SECRET=your_session_secret_key

# 🔧 App Configuration
NODE_ENV=development
PORT=3000
```

### 3. Instalar Dependencias
```bash
# Dependencias principales
npm install

# Dependencias de la aplicación
cd app && npm install && cd ..
```

## 🚀 Ejecutar el Proyecto

### Modo Desarrollo (Recomendado)
```bash
npm run dev
```
Inicia todos los servicios Docker con auto-reload.

### Comandos Disponibles

```bash
# Desarrollo con auto-reload
npm run dev

# Producción
npm start

# Solo aplicación Node.js (sin Docker)
npm run app:start

# Gestión de contenedores
npm run stop          # Detener servicios
npm run clean         # Limpiar contenedores y volúmenes
npm run logs          # Ver logs de servicios

# Desarrollo y testing
npm run lint          # Verificar código con ESLint
npm run test:api      # Ejecutar pruebas con Bruno
```

## 🌐 Acceso a Servicios

| Servicio | URL | Credenciales | Descripción |
|----------|-----|--------------|-------------|
| 🔌 **API REST** | http://localhost:3000 | - | API principal del backend |
| ☁️ **MinIO Console** | http://localhost:9001 | `minioadmin` / `minioadmin123` | Administración almacenamiento |
| 📊 **pgAdmin** | http://localhost:5050 | `pgadmin@example.com` / `password` | Administración PostgreSQL |
| 🌐 **CDN Principal** | http://localhost:8082 | - | Servidor CDN NGINX |
| 🎬 **Transcoder 1** | http://localhost:8083 | - | Servidor transcodificación 1 |
| 🎬 **Transcoder 2** | http://localhost:8084 | - | Servidor transcodificación 2 |

## 📚 API Endpoints

### 🔐 Autenticación (`/api/auth`)
```http
POST /api/auth/login           # Iniciar sesión
POST /api/auth/register        # Registro de usuario
POST /api/auth/recovery        # Recuperación de contraseña
POST /api/auth/change-password # Cambiar contraseña
```

### 👥 Usuarios (`/api/users`)
```http
GET    /api/users              # Listar usuarios
POST   /api/users              # Crear usuario
GET    /api/users/:id          # Obtener usuario por ID
PUT    /api/users/:id          # Actualizar usuario
DELETE /api/users/:id          # Eliminar usuario
```

### 📂 Categorías (`/api/categories`)
```http
GET    /api/categories         # Listar categorías
POST   /api/categories         # Crear categoría
GET    /api/categories/:id     # Obtener categoría por ID
PUT    /api/categories/:id     # Actualizar categoría
DELETE /api/categories/:id     # Eliminar categoría
```

### 🎬 Películas (`/api/movies`)
```http
GET    /api/movies             # Listar películas
GET    /api/movies/search      # Buscar películas
POST   /api/movies             # Crear película
GET    /api/movies/:id         # Obtener película por ID
PUT    /api/movies/:id         # Actualizar película
DELETE /api/movies/:id         # Eliminar película
```

### 📻 Series (`/api/series`)
```http
GET    /api/series             # Listar series
GET    /api/series/search      # Buscar series
POST   /api/series             # Crear serie
GET    /api/series/:id         # Obtener serie por ID
PUT    /api/series/:id         # Actualizar serie
DELETE /api/series/:id         # Eliminar serie
```

### 📺 Episodios (`/api/episodes`)
```http
GET    /api/episodes           # Listar episodios
POST   /api/episodes           # Crear episodio
GET    /api/episodes/:id       # Obtener episodio por ID
PUT    /api/episodes/:id       # Actualizar episodio
DELETE /api/episodes/:id       # Eliminar episodio
```

## 🧪 Testing con Bruno

El proyecto incluye colecciones completas de Bruno para testing de la API:

```bash
# Instalar Bruno (si no lo tienes)
npm install -g @usebruno/cli

# Ejecutar pruebas de desarrollo
bru run collections --env Develop

# Ejecutar pruebas en NAS
bru run collections --env Nas

# Ejecutar colección específica
bru run collections/Movies --env Develop
```

### Entornos Disponibles
- **Develop**: Entorno de desarrollo local
- **Nas**: Entorno de red NAS

## 🎥 Procesamiento de Video

### Configuración de Calidades
El sistema transcodifica automáticamente videos en múltiples calidades:
- **480p** - Calidad estándar
- **720p** - HD
- **1080p** - Full HD

### Configuración Personalizada
Edita `app/utils/configMediaQualities.js` para:
- Agregar nuevas calidades
- Modificar bitrates
- Configurar códecs

### Servidores de Transcodificación
- **Transcoder 1**: Procesamiento principal
- **Transcoder 2**: Procesamiento secundario/backup

## 🗄️ Base de Datos

### Inicialización Automática
El sistema inicializa automáticamente:
- Tablas principales
- Índices optimizados
- Datos de prueba (opcional)

### Tablas Principales
- **`users`** - Usuarios del sistema
- **`categories`** - Categorías de contenido
- **`movies`** - Catálogo de películas
- **`series`** - Información de series
- **`episodes`** - Episodios de series
- **`video_files`** - Archivos de video y metadatos

## 🔧 Configuración Avanzada

### Personalizar NGINX
Edita `servers/cdn/nginx.conf.template` para:
- Configurar reglas de caché
- Añadir headers personalizados
- Configurar compresión

### Configurar MinIO
Modifica `servers/minio/init-minio.sh` para:
- Crear buckets adicionales
- Configurar políticas
- Establecer usuarios

### Red Docker
Ajusta las IPs en `.env` según tu configuración:
```env
SUBNET=192.168.0.0/24
GATEWAY=192.168.0.1
```

## 🧹 Mantenimiento

```bash
# Ver estado de servicios
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs -f app

# Reiniciar servicio específico
docker-compose restart app

# Backup de base de datos
docker-compose exec postgres pg_dump -U admin streaming_api > backup.sql

# Limpiar caché de NGINX
docker-compose exec cdn nginx -s reload
```

## 🐛 Solución de Problemas

### Problemas Comunes

**🔴 Error: Puerto ocupado**
```bash
# Verificar puertos en uso
netstat -tulpn | grep :3000
sudo lsof -i :3000

# Cambiar puerto en .env si es necesario
PORT=3001
```

**🔴 Error: Contenedor no inicia**
```bash
# Ver logs detallados
docker-compose logs [servicio]

# Reconstruir contenedores
docker-compose build --no-cache
docker-compose up -d
```

**🔴 Error: Base de datos no conecta**
```bash
# Verificar estado PostgreSQL
docker-compose exec postgres pg_isready

# Recrear volumen de datos
npm run clean
npm run dev
```

**🔴 Error: MinIO no accesible**
```bash
# Verificar configuración MinIO
docker-compose logs minio

# Recrear buckets
docker-compose restart minio
```

**🔴 Error: FFmpeg no funciona**
```bash
# Verificar instalación FFmpeg en contenedor
docker-compose exec app ffmpeg -version

# Reconstruir imagen de la app
docker-compose build app
```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Para contribuir:

1. **Fork** el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Realiza cambios y pruebas: `npm run test:api`
4. Commit: `git commit -m "feat: nueva funcionalidad"`
5. Push: `git push origin feature/nueva-funcionalidad`
6. Abre un **Pull Request**

### Convenciones
- Usa [Conventional Commits](https://www.conventionalcommits.org/)
- Ejecuta `npm run lint` antes de hacer commit
- Añade pruebas Bruno para nuevos endpoints
- Actualiza documentación si es necesario

## 📄 Licencia

Este proyecto está bajo la licencia **ISC**. Ver [LICENSE](LICENSE) para detalles.

## 📞 Contacto

- **📧 Email**: [arellanestorillo@yahoo.com](mailto:arellanestorillo@yahoo.com)
- **🔗 GitHub**: [@KikeTorillo](https://github.com/KikeTorillo)
- **🐛 Issues**: [Reportar problema](https://github.com/KikeTorillo/streamingAppBack/issues)

---

⭐ **¡Si este proyecto te resultó útil, dale una estrella!** ⭐