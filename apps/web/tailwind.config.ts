import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/cicero/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        supabase: {
          primary: '#3ecf8e',
          'primary-deep': '#24b47e',
          'primary-soft': '#4ade80',
          ink: '#171717',
          'ink-secondary': '#212121',
          'ink-mute': '#707070',
          'ink-mute-2': '#9a9a9a',
          'ink-faint': '#b2b2b2',
          canvas: '#ffffff',
          'canvas-soft': '#fafafa',
          'canvas-night': '#1c1c1c',
          'canvas-night-soft': '#202020',
          hairline: '#dfdfdf',
          'hairline-strong': '#c7c7c7',
          'hairline-cool': '#ededed',
          'hairline-cool-2': '#efefef',
          'hairline-cool-3': '#d4d4d4',
        },
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
