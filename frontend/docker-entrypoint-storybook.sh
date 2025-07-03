#!/bin/sh
# Script de inicio robusto para Storybook en Docker

echo "🚀 Iniciando Storybook en Docker..."

# Función para limpiar procesos zombie
cleanup() {
    echo "🧹 Limpiando procesos anteriores..."
    # Matar cualquier proceso de node/storybook anterior
    pkill -f "storybook" || true
    pkill -f "node" || true
    sleep 2
}

# Limpiar al inicio
cleanup

# Trap para limpiar al salir
trap cleanup EXIT

# Verificar que estamos en el directorio correcto
cd /app

# Verificar que las dependencias están instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

echo "✅ Iniciando Storybook en puerto 6006..."

# Ejecutar Storybook con configuración específica para Docker
exec npx storybook dev \
    --port 6006 \
    --host 0.0.0.0 \
    --no-open \
    --quiet \
    --disable-telemetry