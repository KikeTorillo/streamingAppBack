## **Descripción del Proyecto**

Este proyecto es la interfaz de usuario (frontend) para una plataforma de transmisión de contenido multimedia (películas, series, etc.). Está construido con **React**, utiliza **Vite** como herramienta de desarrollo y se conecta a un backend para gestionar la subida, transcodificación y reproducción de videos.

La aplicación permite a los usuarios:
- Subir videos al servidor.
- Visualizar contenido multimedia en diferentes calidades.
- Navegar por categorías y detalles de películas/series.
- Interactuar con una API RESTful para gestionar datos.

---

## **Características Principales**

1. **Subida de Videos:**
   - Los usuarios pueden subir videos utilizando la biblioteca `react-dropzone`.
   - Los videos se envían al backend para su procesamiento y almacenamiento.

2. **Reproducción de Contenido:**
   - Los videos se reproducen directamente desde el servidor CDN (NGINX).

3. **Navegación Dinámica:**
   - La navegación está gestionada por `react-router-dom`, lo que permite una experiencia fluida entre páginas.

4. **Conexión con el Backend:**
   - Se utiliza `axios` para realizar solicitudes HTTP al backend.

5. **Modo de Desarrollo y Producción:**
   - Configurado con Vite para un desarrollo rápido y una construcción optimizada para producción.

---

## **Estructura del Proyecto**

streamingvideoappfront/

├── public/ → Archivos estáticos (imágenes, íconos, etc.)

├── src/ → Código fuente de la aplicación

│ ├── components/ → Componentes reutilizables

│ ├── pages/ → Páginas principales de la aplicación

│ ├── services/ → Servicios para interactuar con la API

│ ├── App.jsx → Componente principal de la aplicación

│ └── main.jsx → Punto de entrada de la aplicación

├── .env → Variables de entorno

├── package.json → Dependencias y scripts del proyecto

├── vite.config.js → Configuración de Vite

└── README.md → Documentación del proyecto


---

## **Requisitos Previos**

Antes de ejecutar el proyecto, asegúrate de tener instaladas las siguientes herramientas:

1. **Node.js (v18 o superior):**
   - Descarga desde [nodejs.org](https://nodejs.org/).

2. **Backend en Ejecución:**
   - Asegúrate de que el backend esté en funcionamiento. Consulta el repositorio del backend para más detalles.

3. **Variables de Entorno:**
   - Crea un archivo `.env` en la raíz del proyecto y configura las siguientes variables:

			VITE_API_KEY=1ogC7RKV419Y5XssdtcvmuRJ8RcCu451a
			VITE_FRONT_URL_LOCAL=http://localhost:5173
			VITE_MODE=local
			VITE_HOST_LOCAL=http://192.168.0.177:3000

## **Comandos Útiles**

Instalar Dependencias

	npm install

Levantar el Proyecto en Modo Desarrollo

	npm run dev

Este comando inicia el servidor de desarrollo en http://localhost:5173.

Construir el Proyecto para Producción

	npm run build
	
Genera una versión optimizada del proyecto en la carpeta dist.

Previsualizar la Versión de Producción

	npm run preview

Inicia un servidor local para previsualizar la versión de producción.

Ejecutar Linting

	npm run lint

Verifica errores de formato y estilo en el código utilizando ESLint.

## **Dependencias Principales**

Frontend

	React: Biblioteca para construir interfaces de usuario.
	React DOM: Integración de React con el DOM.
	React Router DOM: Gestiona la navegación entre páginas.
	React Dropzone: Permite la subida de archivos mediante arrastrar y soltar.
	Axios: Cliente HTTP para realizar solicitudes al backend.
	Desarrollo
	Vite: Herramienta de desarrollo rápida para React.
	ESLint: Verifica y corrige problemas de estilo en el código.
	TypeScript (opcional): Soporte para tipos estáticos (configurado pero no obligatorio).


Variables de Entorno

	VITE_API_KEY

Clave de autenticación para interactuar con la API del backend.

	VITE_FRONT_URL_LOCAL

URL local del frontend durante el desarrollo (http://localhost:5173).

	VITE_MODE

Modo de ejecución (local,development,production).

	VITE_HOST_LOCAL

URL del backend durante el desarrollo (http://192.168.0.177:3000).



## **Acceso a la Aplicación**

Frontend en Desarrollo:

Accede a la aplicación en http://localhost:5173.

Backend:

Asegúrate de que el backend esté disponible en http://192.168.0.177:3000.

## **Contribuciones**

Si deseas contribuir al proyecto, sigue estos pasos:

- Haz un fork del repositorio.
- Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).
- Realiza tus cambios y haz commit (git commit -m "Añadir nueva funcionalidad").
- Sube los cambios (git push origin feature/nueva-funcionalidad).
- Abre un Pull Request.

## **Licencia**

Este proyecto está bajo la licencia ISC . Consulta el archivo LICENSE para más detalles.

## **Contacto**
Si tienes preguntas o sugerencias, no dudes en contactarme:

Correo: arellanestorillo@yahoo.com
GitHub: KikeTorillo
