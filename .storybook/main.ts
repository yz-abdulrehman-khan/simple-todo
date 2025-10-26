import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  viteFinal: async (config) => {
    // Configure path aliases to match vite.config.ts
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
      '@/components': path.resolve(__dirname, '../src/components'),
      '@/hooks': path.resolve(__dirname, '../src/hooks'),
      '@/services': path.resolve(__dirname, '../src/services'),
      '@/types': path.resolve(__dirname, '../src/types'),
      '@/utils': path.resolve(__dirname, '../src/utils'),
      '@/helpers': path.resolve(__dirname, '../src/helpers'),
      '@/configs': path.resolve(__dirname, '../src/configs'),
      '@/constants': path.resolve(__dirname, '../src/constants'),
      '@/enums': path.resolve(__dirname, '../src/enums'),
      '@/validations': path.resolve(__dirname, '../src/validations'),
      '@/transformers': path.resolve(__dirname, '../src/transformers'),
      '@/pages': path.resolve(__dirname, '../src/pages'),
      '@/layouts': path.resolve(__dirname, '../src/layouts'),
      '@/styles': path.resolve(__dirname, '../src/styles'),
    };
    return config;
  }
};
export default config;