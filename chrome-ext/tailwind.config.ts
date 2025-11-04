import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#667eea',
          light: '#7c91f0',
          dark: '#5568d3',
        },
        secondary: {
          DEFAULT: '#764ba2',
          light: '#8b5fb8',
          dark: '#5f3d84',
        },
        border: {
          DEFAULT: '#e1e8ed',
          light: '#f0f3f5',
          dark: '#c8d2db',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
} satisfies Config
