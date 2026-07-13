/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#101415',
        surface: '#101415',
        primary: '#ddb7ff',
        'on-primary': '#490080',
        secondary: '#bec6e0',
        tertiary: '#c0c1ff',
        'on-surface': '#e0e3e5',
        'on-surface-variant': '#cfc2d6',
        'surface-container': '#1d2022',
        'outline-variant': '#4d4354',
        'inverse-primary': '#842bd2',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
