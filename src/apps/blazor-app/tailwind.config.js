/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{razor, html, cshtml}'],
  theme: {
    extend: {},
    colors: {
      'primary': {
        '100': '#e2e8f0',
        '900': '#1a365d',
      }
    }
  },
  plugins: [],
}

