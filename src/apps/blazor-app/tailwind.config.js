/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{razor, html, cshtml}'],
  theme: {
    extend: {},
    colors: {
      'primary': {
        '50': '#f2f2f2',
        '100': '#e6e6e6',
        '200': '#cccccc',
        '300': '#b3b3b3',
        '400': '#999999',
        '500': '#808080',
      }
    }
  },
  plugins: [],
}

