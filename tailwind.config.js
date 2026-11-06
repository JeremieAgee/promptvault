/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F2F4F6',
        surface: '#FFFFFF',
        ink: '#14212B',
        muted: '#5A6B79',
        line: '#D3DAE0',
        accent: '#2F42D8',
        danger: '#B3261E',
      },
      fontFamily: { sans: ['"Schibsted Grotesk"', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
