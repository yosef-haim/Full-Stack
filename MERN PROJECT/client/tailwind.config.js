/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,css}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

module.exports = {
  content: [/*...*/],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in forwards',
      },
    },
  },
  plugins: [],
}



