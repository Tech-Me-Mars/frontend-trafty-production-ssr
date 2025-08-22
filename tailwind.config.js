/** @type {import('tailwindcss').Config} */
export default {
  
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans Thai"', 'sans-serif'],
      },
      colors: {
        bg:{
          main:'#EEF0F3'
        },
        primary: {
          // 202c54
          main: '#303484', // ชื่อหลัก primary
          second: '#202c54'
          // dark: '#202c54',    // เฉดมืด (กำหนดเพิ่มตามต้องการ)
          // light: '#202c54',   // เฉดสว่าง (กำหนดเพิ่มตามต้องการ)
        },
      },
    },
  },
  plugins: [require('tailwindcss-primeui')]
}

