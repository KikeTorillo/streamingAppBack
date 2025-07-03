#!/bin/sh
# Script de inicio robusto para Storybook en Docker

echo "🚀 Iniciando Storybook en Docker..."

# Función para verificar si el puerto está en uso
check_port() {
    netstat -tln | grep -q ":6006 "
    return $?
}

# Función para limpiar procesos y puertos
cleanup() {
    echo "🧹 Limpiando procesos y puertos anteriores..."
    
    # Matar todos los procesos node y storybook
    pkill -9 -f "storybook" 2>/dev/null || true
    pkill -9 -f "node" 2>/dev/null || true
    
    # Esperar un momento
    sleep 3
    
    # Si el puerto sigue ocupado, buscar y matar el proceso específico
    if check_port; then
        echo "⚠️  Puerto 6006 aún ocupado, buscando proceso..."
        PID=$(netstat -tlnp 2>/dev/null | grep ":6006" | awk '{print $7}' | cut -d'/' -f1)
        if [ ! -z "$PID" ]; then
            echo "🔪 Matando proceso PID: $PID"
            kill -9 $PID 2>/dev/null || true
        fi
    fi
    
    # Esperar un poco más
    sleep 2
}

# Limpiar al inicio
cleanup

# Verificar que el puerto está libre
if check_port; then
    echo "❌ ERROR: Puerto 6006 sigue ocupado después de la limpieza"
    echo "Esperando 10 segundos adicionales..."
    sleep 10
    cleanup
fi

# Trap para limpiar al salir
trap cleanup EXIT INT TERM

# Verificar que estamos en el directorio correcto
cd /app

# Verificar que las dependencias están instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

echo "✅ Puerto 6006 libre. Iniciando Storybook..."

# Usar el script docker:storybook del package.json
exec npm run docker:storybook