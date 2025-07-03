# 🎬 StreamingApp - Plataforma Integral de Streaming

Plataforma completa de streaming que combina un backend Node.js, frontend React+Vite, Storybook para componentes, y servicios de infraestructura orquestados con Docker Compose.

## 🚀 Inicio Rápido

### ⚡ Comando Principal (TODO EN UNO)
```bash
# Desde la raíz del proyecto
npm run dev
```
Este comando ejecuta automáticamente:
- Backend API (puerto 3000)
- Frontend React+Vite (puerto 5173) 
- Storybook (puerto 6006)
- PostgreSQL + pgAdmin
- MinIO S3 + Panel
- CDN y Transcodificadores

### 📋 Configuración Inicial
```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd streamingAppBack

# 2. Copiar variables de entorno
npm run env:copy

# 3. Instalar dependencias (opcional - Docker las maneja automáticamente)
npm run install:all

# 4. Levantar toda la plataforma
npm run dev
```

## 🛠️ Scripts Principales Disponibles

### 🐳 **Gestión Docker (Recomendado para desarrollo)**
```bash
npm run dev          # Inicia toda la plataforma (Backend + Frontend + Storybook + Servicios)
npm run stop         # Detiene todos los servicios
npm run restart      # Reinicia todos los servicios
npm run clean        # Limpia contenedores, volúmenes e imágenes
npm run status       # Muestra el estado de todos los servicios
```

### 💻 **Desarrollo Local (Sin Docker)**
```bash
npm run dev:local    # Ejecuta backend, frontend y storybook en paralelo
npm run dev:backend  # Solo backend (requiere DB externa)
npm run dev:frontend # Solo frontend
npm run dev:storybook # Solo Storybook
```

### 🔧 **Servicios Individuales**
```bash
npm run up:backend   # Solo backend + base de datos + almacenamiento
npm run up:frontend  # Solo frontend
npm run up:storybook # Solo Storybook
npm run up:database  # Solo PostgreSQL + pgAdmin
npm run up:storage   # Solo MinIO
npm run up:cdn       # Solo CDN y transcodificadores
```

### 📊 **Monitoreo y Debug**
```bash
npm run logs         # Ver logs de todos los servicios
npm run logs:backend # Ver logs solo del backend
npm run logs:frontend # Ver logs solo del frontend
npm run monitor      # Monitorear recursos de contenedores
npm run health       # Verificar que todos los servicios respondan
npm run ports        # Ver qué puertos están en uso
```

### 🐚 **Acceso a Consolas**
```bash
npm run shell:backend  # Acceder al contenedor del backend
npm run shell:frontend # Acceder al contenedor del frontend
npm run shell:db      # Acceder a PostgreSQL CLI
```

## 🌐 URLs de Acceso

Una vez ejecutado `npm run dev`, acceder a:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Storybook:** http://localhost:6006
- **pgAdmin:** http://localhost:5050 (admin@gmail.com / root)
- **MinIO Panel:** http://localhost:9001 (admin / admin123)
- **CDN:** http://localhost:8082

## 📁 Estructura del Proyecto

```
streamingAppBack/
├── package.json              # 🎯 NUEVO: Scripts centralizados
├── docker-compose.yml        # Orquestación de servicios
├── example.env               # Variables de entorno de ejemplo
├── .env                      # Variables de entorno (crear desde example.env)
│
├── backend/app/              # 🔙 Backend Node.js + Express
│   ├── package.json         # Scripts específicos del backend
│   ├── index.js             # Punto de entrada del servidor
│   ├── routes/              # Rutas de la API
│   ├── models/              # Modelos de datos
│   └── middleware/          # Middleware personalizado
│
├── frontend/app/             # 🎨 Frontend React + Vite
│   ├── package.json         # Scripts específicos del frontend
│   ├── src/                 # Código fuente React
│   │   ├── components/      # Componentes siguiendo Atomic Design
│   │   │   ├── atoms/       # Componentes básicos
│   │   │   ├── molecules/   # Combinaciones de átomos
│   │   │   └── organisms/   # Componentes complejos
│   │   ├── pages/           # Páginas de la aplicación
│   │   └── services/        # Servicios y APIs
│   └── .storybook/          # Configuración de Storybook
│
└── servers/                  # 🏗️ Configuración de infraestructura
    ├── cdn/                 # Configuración del CDN
    ├── transcoderServers/   # Servidores de transcodificación
    ├── minio/               # Almacenamiento S3
    └── postgresQl/          # Base de datos
```

## 🎨 Sistema de Diseño y Storybook

### 📚 Filosofía: Atomic Design + Simplicidad
- **Átomos:** Componentes básicos (Button, Input, Card)
- **Moléculas:** Combinaciones funcionales (SearchBar, LoginForm)
- **Organismos:** Secciones complejas (Header, MovieGrid)

### ✅ Convenciones de Código OBLIGATORIAS
```javascript
// ✅ ÚNICO export permitido
function ComponentName() {
  return <div>...</div>;
}
export { ComponentName };

// ❌ PROHIBIDO
export const ComponentName = () => {}
export default ComponentName
```

### 🎯 Variables CSS del Sistema
```css
/* Usar SIEMPRE variables del sistema */
style={{ 
  padding: 'var(--space-md)',
  color: 'var(--color-primary)',
  borderRadius: 'var(--radius-lg)'
}}

/* ❌ PROHIBIDO hardcodear valores */
style={{ padding: '20px', color: '#ff0000' }}
```

### 📖 Stories de Storybook
**Para Átomos:** 6 stories obligatorias
- Default, Sizes, Variants, States, Interactive, Accessibility

**Para Moléculas:** Mínimo 5 stories
- Playground, Default, States + 2 específicas de funcionalidad

## 🔧 Configuración de Desarrollo

### 🐳 **Docker (Recomendado)**
- **Ventajas:** Todo configurado automáticamente, mismo entorno para todos
- **Uso:** `npm run dev` y listo
- **Hot Reload:** Automático en todos los servicios

### 💻 **Local (Desarrollo avanzado)**
- **Requisitos:** Node.js 18+, PostgreSQL, MinIO local
- **Configuración:** Ajustar variables en `.env`
- **Uso:** `npm run dev:local`

## 🚨 Resolución de Problemas

### ❌ Error "Puerto en uso"
```bash
npm run stop     # Detener todos los servicios
npm run clean    # Limpiar completamente
npm run dev      # Reiniciar
```

### ❌ Error de permisos Docker
```bash
sudo usermod -aG docker $USER
# Cerrar sesión y volver a iniciar
```

### ❌ Variables de entorno
```bash
npm run env:copy      # Copiar example.env a .env
npm run env:validate  # Verificar que las variables se cargan correctamente
```

### ❌ Problemas de conectividad
```bash
npm run health    # Verificar que todos los servicios respondan
npm run logs      # Ver logs para identificar errores
npm run ports     # Verificar que los puertos estén disponibles
```

## 📦 Gestión de Dependencias

### 🔄 Actualizar dependencias
```bash
npm run update:all      # Actualizar todas las dependencias
npm run update:backend  # Solo backend
npm run update:frontend # Solo frontend
```

### 🧹 Linting y formato
```bash
npm run lint          # Verificar calidad de código
npm run lint:fix      # Corregir problemas automáticamente
```

## 🏗️ Arquitectura de Servicios

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Frontend   │    │ Storybook   │    │   Backend   │
│   :5173     │    │   :6006     │    │   :3000     │
└─────┬───────┘    └─────────────┘    └─────┬───────┘
      │                                      │
      │              ┌─────────────┐        │
      └──────────────┤    CDN      ├────────┘
                     │   :8082     │
                     └─────┬───────┘
                           │
      ┌────────────────────┼────────────────────┐
      │                    │                    │
┌─────▼───────┐    ┌─────▼───────┐    ┌─────▼───────┐
│Transcoder1  │    │Transcoder2  │    │   MinIO     │
│             │    │             │    │ :9000/:9001 │
└─────────────┘    └─────────────┘    └─────┬───────┘
                                           │
                                     ┌─────▼───────┐
                                     │ PostgreSQL  │
                                     │ :5432/:5050 │
                                     └─────────────┘
```

## 🤝 Contribución

1. **Fork** del repositorio
2. **Crear rama:** `git checkout -b feature/nueva-funcionalidad`
3. **Seguir convenciones:** Ver guía de reglas del proyecto
4. **Commit:** Usar [conventional commits](https://www.conventionalcommits.org/es/v1.0.0/)
5. **Pull Request:** Descripción clara de los cambios

## 📄 Licencia

**ISC** - Ver archivo LICENSE para más detalles.

## 👨‍💻 Autor

**Kike Torillo**
- GitHub: [@KikeTorillo](https://github.com/KikeTorillo)
- Email: [arellanestorillo@yahoo.com](mailto:arellanestorillo@yahoo.com)

---

## 🎯 Migración desde el Sistema Anterior

### ✅ **Antes (desde backend/app):**
```bash
cd backend/app
npm run dev    # Solo levantaba Docker
```

### 🚀 **Ahora (desde raíz):**
```bash
npm run dev    # Levanta TODO: Backend + Frontend + Storybook + Servicios
```

### 📈 **Beneficios de la Nueva Estructura:**
- **✅ Gestión centralizada** - Un solo lugar para todos los scripts
- **✅ Flujo simplificado** - `npm run dev` inicia todo
- **✅ Scripts específicos** - Control granular cuando se necesite
- **✅ Monorepo organizado** - Workspaces para dependencias compartidas
- **✅ Mejor DX** - Experiencia de desarrollador mejorada