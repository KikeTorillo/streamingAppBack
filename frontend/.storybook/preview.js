/** @type { import('@storybook/react-vite').Preview } */
// .storybook/preview.js
import '../src/app/App.css'; // o el path donde defines tus :root variables
const preview = {
  parameters: {
    actions: { },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'var(--bg-primary)' },
        { name: 'dark', value: 'var(--bg-secondary)' },
      ],
    },
    options: {
      storySort: {
        order: ['Intro', 'Components', ['Atoms', 'Molecules', 'Organisms']],
      },
    },
  },
};

export default preview;