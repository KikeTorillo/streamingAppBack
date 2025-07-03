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
};

export default config;