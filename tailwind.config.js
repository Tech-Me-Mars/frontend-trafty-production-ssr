/** @type {import('tailwindcss').Config} */
export default {
  
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans Thai"', 'sans-serif'],
      },
      colors: {
        primary: {
          main: '#202c54', // ชื่อหลัก primary
          // dark: '#202c54',    // เฉดมืด (กำหนดเพิ่มตามต้องการ)
          // light: '#202c54',   // เฉดสว่าง (กำหนดเพิ่มตามต้องการ)
        },
      },
    },
  },
  plugins: [require('tailwindcss-primeui')]
}

