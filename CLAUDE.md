# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Key Commands

### Development (Docker-based - Recommended)
```bash
npm run dev          # Start complete platform: backend + frontend + storybook + services
npm run dev:down     # Stop all services
npm run dev:restart  # Restart all services
npm run dev:logs     # View logs from all services
```

### Local Development (without Docker)
```bash
npm run dev:local    # Run backend, frontend, and storybook locally
npm run dev:backend  # Start backend only (requires external DB)
npm run dev:frontend # Start frontend only  
npm run dev:storybook # Start storybook only
```

### Build & Production
```bash
npm run build        # Build frontend for production
npm run prod         # Start production environment
npm run prod:down    # Stop production environment
```

### Code Quality
```bash
npm run lint         # Run ESLint on both backend and frontend
npm run lint:fix     # Auto-fix linting issues
npm run test         # Run frontend tests with Vitest
npm run test:storybook # Run Storybook tests
```

### Individual Services
```bash
npm run up:backend   # Start backend + database + storage
npm run up:frontend  # Start frontend only
npm run up:database  # Start PostgreSQL + pgAdmin
npm run up:storage   # Start MinIO storage
```

## Architecture Overview

This is a **monorepo streaming platform** with the following structure:

### Core Components
- **Backend**: Node.js/Express API (`backend/app/`)
- **Frontend**: React/Vite SPA (`frontend/app/`)
- **Storybook**: Component library for UI development
- **Database**: PostgreSQL with pgAdmin
- **Storage**: MinIO S3-compatible storage
- **CDN**: Custom NGINX-based content distribution

### Key Services and Ports
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Storybook: http://localhost:6006
- pgAdmin: http://localhost:5050
- MinIO Console: http://localhost:9001
- CDN: http://localhost:8082

## Code Architecture

### Backend (`backend/app/`)
- **MVC Pattern**: Routes → Services → Models
- **Authentication**: JWT with Passport.js strategies
- **Database**: PostgreSQL with connection pooling
- **File Processing**: FFmpeg for video transcoding
- **Storage**: MinIO for media files
- **API Routes**: RESTful endpoints for movies, series, episodes, users, categories

### Frontend (`frontend/app/`)
- **Architecture**: Atomic Design pattern
  - `atoms/`: Basic components (Button, Input, Card)
  - `molecules/`: Component combinations (SearchBar, LoginForm)
  - `organisms/`: Complex sections (DataTable, AdminSidebar)
  - `templates/`: Page layouts
- **State Management**: React Context API
- **Routing**: React Router v7
- **Styling**: CSS modules with design system variables
- **Services**: Axios-based API clients

### Design System Rules
- Use **named exports only**: `export { ComponentName }`
- Use CSS variables: `var(--color-primary)`, `var(--space-md)`
- Storybook stories required for all components
- Component structure: `ComponentName/ComponentName.jsx`, `ComponentName.css`, `ComponentName.stories.jsx`

## Development Workflow

1. **Setup**: Run `npm run dev` to start all services
2. **Frontend Development**: Components auto-reload on save
3. **Backend Development**: API auto-reloads with nodemon
4. **Storybook**: Component development and testing
5. **Database**: Access via pgAdmin or `npm run shell:db`

## Testing

- **Frontend**: Vitest with browser testing via Playwright
- **Storybook**: Automated component testing
- **Test Command**: `npm run test` (runs frontend tests)
- **Storybook Tests**: `npm run test:storybook`

## Environment Configuration

- Copy `example.env` to `.env` for local development
- Docker services use environment variables for database, storage, and API connections
- Production uses `docker-compose.yml`, development uses `docker-compose.dev.yml`

## Key Files

- `package.json`: Centralized npm scripts for monorepo management
- `docker-compose.yml`: Production service orchestration
- `docker-compose.dev.yml`: Development service orchestration
- `frontend/app/vite.config.js`: Vite configuration with path aliases
- `frontend/app/vitest.workspace.js`: Test configuration
- `backend/app/index.js`: Backend entry point

## Common Tasks

- **Add new component**: Create in appropriate atomic design folder with .jsx, .css, and .stories.jsx files
- **Add new API endpoint**: Create route in `backend/app/routes/`, service in `services/`, and schema in `schemas/`
- **Database changes**: Modify `servers/postgresQl/init.sql` and rebuild containers
- **Media processing**: Utilities in `backend/app/utils/` for video transcoding and image processing