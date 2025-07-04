import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  // Detectar si es build o desarrollo
  const isProduction = command === 'build'
  
  return {
    plugins: [react()],
    
    // Aliases útiles para imports más limpios
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@services': path.resolve(__dirname, './src/services'),
        '@assets': path.resolve(__dirname, './src/assets'),
      },
    },
    
    // Variables globales
    define: {
      __APP_VERSION__: JSON.stringify('1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    
    // DESARROLLO: Mantiene tu configuración actual
    server: {
      host: '0.0.0.0',
      port: 5173,
      hmr: {
        port: 5173,
        host: 'localhost'
      },
    },
    
    // PRODUCCIÓN: Optimizado para Synology
    build: {
      outDir: 'dist',
      sourcemap: false,           // Sin sourcemaps = menos espacio en NAS
      minify: 'esbuild',          // Compresión máxima
      
      // Chunks para mejor cache en NAS
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@headlessui/react', 'react-icons'],
            video: ['hls.js', 'video.js'],
          },
        },
      },
      
      // Límite de chunk size
      chunkSizeWarningLimit: 1000,
    },
  }
})