// ===== STORYBOOK CONFIG - PRESERVANDO TU CONFIGURACIÓN EXISTENTE + FIX DOCKER =====
// frontend/.storybook/main.js

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  // ✅ PRESERVANDO TUS STORIES ORIGINALES (incluye .mdx)
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  
  // ✅ PRESERVANDO TODOS TUS ADDONS AVANZADOS
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  
  // ✅ PRESERVANDO TU FRAMEWORK CONFIG
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  
  // ✅ PRESERVANDO TUS FEATURES
  "features": {
    "buildStoriesJson": true
  },
  
  // ✅ PRESERVANDO TU TEMA DARK
  "docs": {
    "theme": 'dark'
  },
  
  // ✅ AGREGANDO SOLO EL FIX DOCKER - SIN ROMPER NADA
  viteFinal: (config) => {
    // Solo agregar configuración Docker específica
    config.server = {
      ...config.server,
      host: '0.0.0.0',
      port: 6006,
      strictPort: true,
      // ✅ FIX: Deshabilitar auto-open en Docker
      open: false,
      // Configuración de HMR para Docker
      hmr: {
        port: 6006,
        host: '0.0.0.0'
      }
    };
    return config;
  }
};

export default config;