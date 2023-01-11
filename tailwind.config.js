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
        'midSm' : '450px',
        'md': '750px',
        // => @media (min-width: 960px) { ... }
  
        'lg': '968px',
        // => @media (min-width: 1440px) { ... }
        'xl': '1800px',
        'xxl': '2350px'
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        special: {
          light: '#85d7ff',
          DEFAULT: '#121212',
          dark: '#009eeb',
        },
        button: '#464646',
        buttonText: '#BDBDBD',
        buttonActiveText: '#121212',
        teal: "#ADFFD8",
        green: "#228B22"
    },


       
      
    }
  },
  plugins: [require('tailwind-scrollbar')],
  variants: {
      scrollbar: ['rounded']
  }
}
