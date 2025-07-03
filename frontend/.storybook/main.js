// ===== STORYBOOK CONFIG - FIX ERROR 426 WEBSOCKET =====
// frontend/.storybook/main.js

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  // ✅ Stories configuration
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  
  // ✅ Addons
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  
  // ✅ Framework
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  
  // ✅ Features
  "features": {
    "buildStoriesJson": true
  },
  
  // ✅ Docs theme
  "docs": {
    "theme": 'dark'
  },
  
  // 🔥 FIX CRÍTICO: Configuración Docker/WebSocket
  viteFinal: (config) => {
    config.server = {
      ...config.server,
      host: '0.0.0.0',
      port: 6006,
      strictPort: true,
      open: false,
      // 🚀 FIX ERROR 426: WebSocket configuration
      hmr: {
        port: 6006,
        host: '0.0.0.0',
        // ✅ CRÍTICO: Configuración WebSocket para Docker
        clientPort: 6006,
        // ✅ Evitar problemas de proxy
        overlay: false
      },
      // 🔧 Configuración adicional para Docker
      watch: {
        usePolling: true,
        interval: 100
      }
    };

    // 🛡️ Fix para modo desarrollo
    if (config.mode === 'development') {
      config.define = {
        ...config.define,
        global: 'globalThis'
      };
    }

    return config;
  }
};

export default config;