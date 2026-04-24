/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        slate:    '#4D5C60',
        amethyst: '#525266',
        charcoal: '#383838',
        mist:     '#D1E0DE',
        keylime:  '#E7F0CC',
      },
      fontFamily: {
        display: ['"PP Neue Montreal"', 'Inter', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
