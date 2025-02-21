# **Streaming Video App Backend**

## **Descripción del Proyecto**

Este proyecto es un backend para una plataforma de transmisión de contenido multimedia (películas, series, etc.). Permite subir videos, transcodificarlos en diferentes calidades, almacenarlos en un servidor MinIO (compatible con Amazon S3) y gestionar metadatos en una base de datos PostgreSQL. Además, utiliza NGINX como servidor web para servir el contenido y proporciona una API RESTful para interactuar con la aplicación.

El sistema está diseñado para ser modular, escalable y fácil de mantener. Utiliza Docker para orquestar los servicios necesarios (NGINX, MinIO, PostgreSQL, pgAdmin, etc.) y garantizar que el entorno sea consistente en cualquier máquina.

## **Características Principales**

1. **Subida y Transcodificación de Videos:**
   - Los videos se suben al servidor, se transcodifican en múltiples calidades (480p, 720p, 1080p) y se almacenan en MinIO.
   - Se genera una URL prefirmada para acceder a los videos.

2. **Gestión de Categorías:**
   - Las categorías permiten clasificar películas y series (por ejemplo, Acción, Comedia, Drama, etc.).

3. **Base de Datos:**
   - Se utiliza PostgreSQL para almacenar metadatos de videos, series, películas y categorías.
   - Incluye tablas para `videos`, `categories`, `series`, `episodes` y `movies`.

4. **Servidor Web (NGINX):**
   - NGINX actúa como un CDN (Content Delivery Network) para servir videos y caché.

5. **Administración de Base de Datos:**
   - pgAdmin se incluye para administrar y monitorear la base de datos PostgreSQL.

6. **Autenticación y Seguridad:**
   - Implementa autenticación basada en tokens JWT para proteger las rutas de la API.

---

## **Estructura del Proyecto**

streamingvideoappback/

├── docker-compose.yml → Archivo de configuración de Docker Compose

├── package.json → Dependencias y scripts del proyecto

├── clean.js → Script para limpiar contenedores y carpetas locales

├── index.js → Archivo principal del servidor Node.js

├── aws.js → Configuración de MinIO

├── servers/ → Carpetas para configuraciones específicas de servicios

│ ├── cdn/ → Configuración de NGINX CDN

│ ├── minio/ → Configuración de MinIO

│ ├── postgresQl/ → Configuración de PostgreSQL

│ └── transcoderServers/ → Configuración de servidores de transcodificación

├── utils/ → Funciones auxiliares (transcodificación, URLs, etc.)

└── README.md → 

Documentación del proyecto
---
## **Requisitos Previos**

Antes de ejecutar el proyecto, asegúrate de tener instaladas las siguientes herramientas:

1. **Node.js (v16 o superior):**
   - Descarga desde [nodejs.org](https://nodejs.org/).

2. **Docker y Docker Compose:**
   - Instala Docker desde [docker.com](https://www.docker.com/).

3. **PostgreSQL Client (opcional):**
   - Si deseas conectarte directamente a la base de datos, puedes usar herramientas como `pgAdmin` o `psql`.

4. **Variables de Entorno:**
   - Asegúrate de configurar las variables de entorno necesarias en un archivo `.env`. Un ejemplo de archivo `.env` podría verse así:
   
		   # Configuración de PostgreSQL
		   DB_NAME=my_api
		   DB_USER=admin
		   DB_PASSWORD=your_password

		   # Configuración de MinIO
		   MINIO_ROOT_USER=minioadmin
		   MINIO_ROOT_PASSWORD=minioadmin
		   MINIO_REGION=us-east-1
		   NGINX_IP_ADDRESS_MINIO=192.168.0.10

		   # Configuración de NGINX
		   NGINX_IP_ADDRESS_CDN=192.168.0.11
		   NGINX_CDN_SERVER1_PORT=8082
		   NGINX_TRANSCODER1=192.168.0.12
		   NGINX_TRANSCODER2=192.168.0.13

		   # Red personalizada
		   SUBNET=192.168.0.0/24
		   GATEWAY=192.168.0.1


## **Comandos Útiles**

1. **Instalar Dependencias:**

		npm install

2. **Levantar el Proyecto:**

		npm run dev

	Este comando inicia los contenedores Docker y el servidor Node.js en modo desarrollo (con nodemon).

3. **Detener los Contenedores**

		npm run stop

	Detiene todos los contenedores sin eliminar las carpetas locales.

4. **Limpiar Todo (Contenedores + Carpetas Locales)**

		npm run clean

	Detiene los contenedores y elimina las carpetas locales montadas como volúmenes (por ejemplo, nginx_cache, aws3DataMinio, postgres_data).

5. **Iniciar el Servidor Sin Docker**

		npm start

	Inicia el servidor Node.js directamente (sin usar Docker).

6. **Ejecutar Linting**

		npm run lint

Verifica errores de formato y estilo en el código utilizando ESLint.

## **Dependencias Principales**
	Backend
	Express: Framework para crear el servidor HTTP.
	PostgreSQL (pg): Cliente para interactuar con la base de datos.
	MinIO (minio): SDK para interactuar con el servidor de almacenamiento MinIO.
	FFmpeg (fluent-ffmpeg): Herramienta para transcodificar videos.
	JWT (jsonwebtoken): Biblioteca para manejar tokens de autenticación.
	Multer: Middleware para manejar la subida de archivos.
	Bcrypt: Biblioteca para cifrar contraseñas.
	Desarrollo
	Nodemon: Reinicia automáticamente el servidor cuando detecta cambios.
	ESLint + Prettier: Herramientas para verificar y formatear el código.


## **Acceso a los Servicios**

1. API REST
La API estará disponible en http://localhost:3000.
2. MinIO Console
Accede a la interfaz de administración de MinIO en http://localhost:9001.
Usuario: minioadmin
Contraseña: minioadmin
3. pgAdmin
Accede a pgAdmin en http://localhost:5050.
Correo electrónico: pgadmin@example.com
Contraseña: your_password
4. NGINX CDN
Accede al servidor NGINX en http://localhost:8082.

## **Contribuciones**

Si deseas contribuir al proyecto, sigue estos pasos:

Haz un fork del repositorio.
Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).
Realiza tus cambios y haz commit (git commit -m "Añadir nueva funcionalidad").
Sube los cambios (git push origin feature/nueva-funcionalidad).
Abre un Pull Request.

Licencia
Este proyecto está bajo la licencia ISC . Consulta el archivo LICENSE para más detalles.

Contacto
Si tienes preguntas o sugerencias, no dudes en contactarme:

Correo: arellanestorillo@yahoo.com
GitHub: KikeTorillo
