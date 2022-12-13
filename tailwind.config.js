/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '0px',
        // => @media (min-width: 576px) { ... }
  
        'md': '700px',
        // => @media (min-width: 960px) { ... }
  
        'lg': '1100px',
        // => @media (min-width: 1440px) { ... }
      }
    },
  },
  plugins: [],
}
