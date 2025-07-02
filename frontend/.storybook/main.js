// ===== STORYBOOK CONFIG - FIX PARA ARCHIVOS JSX =====
// frontend/.storybook/main.js

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  // ✅ FIX: Remover .mdx ya que no tienes archivos MDX
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  
  // ✅ TUS ADDONS ACTUALES
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  
  // ✅ FRAMEWORK CONFIG
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  
  // ✅ FEATURES
  "features": {
    "buildStoriesJson": true
  },
  
  // ✅ TEMA DARK
  "docs": {
    "theme": 'dark'
  },
  
  // ✅ CONFIG DOCKER/VITE
  viteFinal: (config) => {
    config.server = {
      ...config.server,
      host: '0.0.0.0',
      port: 6006,
      strictPort: true,
      open: false,
      hmr: {
        port: 6006,
        host: '0.0.0.0'
      }
    };
    return config;
  }
};

export default config;