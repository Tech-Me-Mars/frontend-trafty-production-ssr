import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

// กำหนด Custom Preset
const MyPreset = definePreset(Aura, {
    semantic: {
        primary: { 
            50: '#f2f4fa',   // เฉดสีอ่อนมาก
            100: '#d9e0f0',  // เฉดสีอ่อน
            200: '#b0bede',  // เฉดสีอ่อนขึ้นมา
            300: '#7f94c2',  // สีโทนกลาง-อ่อน
            400: '#5a72a9',  // เฉดสีใกล้เคียง (เทากับฟ้า)
            500: '#202c54',  // Primary สีหลัก
            600: '#1b2547',  // เฉดเข้ม
            700: '#151d39',  // เฉดเข้มขึ้น
            800: '#10162b',  // เฉดเข้มมาก
            900: '#0b0f1e',  // เฉดมืดสุด
            950: '#05080f'   // เฉดดำอมฟ้า
        },
        secondary: { 
            50: '#f3f0fc',   
            100: '#e4dcfa',  
            200: '#c6b7f3',  
            300: '#a391eb',  
            400: '#7d6be3',  
            500: '#281c74',  
            600: '#211764',  
            700: '#1a1252',  
            800: '#130d40',  
            900: '#0c092e',  
            950: '#06061c'   
        },
        success: { 
            50: '#ecfdf5',   
            100: '#d1fae5',  
            200: '#a7f3d0',  
            300: '#6ee7b7',  
            400: '#34d399',  
            500: '#10b981',  
            600: '#059669',  
            700: '#047857',  
            800: '#065f46',  
            900: '#064e3b',  
            950: '#022c22'   
        },
        info: { 
            50: '#eff6ff',   
            100: '#dbeafe',  
            200: '#bfdbfe',  
            300: '#93c5fd',  
            400: '#60a5fa',  
            500: '#3b82f6',  
            600: '#2563eb',  
            700: '#1d4ed8',  
            800: '#1e40af',  
            900: '#1e3a8a',  
            950: '#172554'   
        },
        warning: { 
            50: '#fff7ed',   
            100: '#ffedd5',  
            200: '#fed7aa',  
            300: '#fdba74',  
            400: '#fb923c',  
            500: '#f97316',  
            600: '#ea580c',  
            700: '#c2410c',  
            800: '#9a3412',  
            900: '#7c2d12',  
            950: '#431407'   
        },
        error: { 
            50: '#fef2f2',   
            100: '#fee2e2',  
            200: '#fecaca',  
            300: '#fca5a5',  
            400: '#f87171',  
            500: '#ef4444',  
            600: '#dc2626',  
            700: '#b91c1c',  
            800: '#991b1b',  
            900: '#7f1d1d',  
            950: '#450a0a'   
        },
    },
});

// การกำหนดค่า Preset และตัวเลือกธีม
export default {
    preset: MyPreset,
    options: {
        darkModeSelector: '.p-dark', // เลือกโหมดมืดเมื่อมี class .p-dark
        // cssLayer: {
        //     name: 'primevue',
        //     // order: 'tailwind-base, primevue, tailwind-utilities', // ลำดับของ CSS Layers
        //     // order: 'tailwind-utilities,tailwind-base, primevue, ', // ลำดับของ CSS Layers
        
        // },
        cssLayer: false

    },
};
