const buildTimestamp = new Date().getTime();
export default defineNuxtConfig({
  ssr: true,
  runtimeConfig: {
    cookieSecret: process.env.COOKIE_SECRET,
    longdoMapKey: process.env.LONGDO_MAP_KEY, // 🔒 ใช้ฝั่ง server เท่านั้น
    public: {
      
    }
  },

  experimental: {
    emitRouteChunkError: "manual", // Enables custom chunk error handling
  },
  hooks: {
    "vue:error"({ error, redirect }) {
      console.error("Error encountered:", error);
      redirect("/error");
    },
  },
  vue: {
    defineModel: true,
    propsDestructure: true
  },
  cache: false,

  app: {
    buildAssetsDir: `_nuxt_${Date.now()}/`,
    head: {
      title: 'traffy',
      meta: [
        { charset: 'utf-8' },
        { 'http-equiv': 'cache-control', content: 'public, max-age=3600' },
      ],
      link: [
        { rel: 'icon', href: `/image/logo_erp.png?Date=${buildTimestamp}` },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Material+Icons' },
        // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Thai', fetchpriority: 'low' }
      ],
      script: [
        // {
        //   src: "https://api.longdo.com/map3/?key=1e7c1b91542a627c2f556824f98e9977",
        //   type: "text/javascript",
        // },
      ],
    },
  },

  modules: ['@pinia/nuxt','@primevue/nuxt-module', '@nuxtjs/tailwindcss', '@vant/nuxt', '@nuxtjs/google-fonts', '@nuxtjs/i18n', '@nuxtjs/leaflet'

  ],
  i18n: {
    lazy: true,
    langDir: 'locales/',
    // strategy: 'prefix_except_default', // เพิ่ม prefix เฉพาะ locale ที่ไม่ใช่ default
    strategy: 'no_prefix',
    locales: [
      {
        code: "th",
        iso: "th",
        name: "ไทย",
        file: "th-TH.json",
        flag: '/image/flag/flag-thailand.png'
      },
      {
        code: "en",
        iso: "en",
        name: "English(US)",
        file: "en-US.json",
        flag: '/image/flag/flag-us.png'
      },
      {
        code: "cn",
        iso: "cn",
        name: "Chinese(CH)",
        file: "ch-Ch.json",
        flag: '/image/flag/flag-china.png'
      },
    ],
    defaultLocale: "th",
  },
  googleFonts: {
    families: {
      'Noto+Sans+Thai': [400, 500, 700], // น้ำหนักที่ต้องการ
    },
    display: 'swap', // การโหลดฟอนต์ (swap ช่วยลด FOUC - Flash of Unstyled Content)
    prefetch: true, // ล่วงหน้าเพื่อประสิทธิภาพ
    preconnect: true, // เพิ่ม preconnect สำหรับ Google Fonts
    inject: true, // แทรกลิงก์ฟอนต์อัตโนมัติใน <head>
  },

  primevue: {
    importTheme: { from: '@/themes/mytheme.js' },
    options: {
      ripple: false, // เปิดเอฟเฟกต์ Ripple
      // inputVariant: 'filled', // สไตล์อินพุตแบบเติมสี
      
      // theme: {
      //   preset: Aura, // ธีม Aura
      //   options: {
      //     darkModeSelector: "light",
      //     cssLayer: {
      //       name: 'primevue',
      //       order: 'tailwind-base, primevue, tailwind-utilities',
      //     }
      //   }
      // }
      // pt:{
        // button:{
        //   root:{
        //     class: '!border-primary-main'
        // },
        // }
      // }
    }
  },

  css: [
    '@/assets/css/tailwind.css', // โหลด Tailwind ก่อน
    'primeicons/primeicons.css',
    'material-design-icons-iconfont/dist/material-design-icons.css',
    '@fortawesome/fontawesome-free/css/all.css',
    '@/assets/css/MarkerCluster.Default.css'
    // 'https://fonts.googleapis.com/css?family=Material+Icons' // ใช้ URL ที่ถูกต้อง
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: '2024-11-19',

  nitro: {
    routeRules: {
      // ป้องกันการแคช assets เก่า
      '/_nuxt/**': { headers: { 'cache-control': 'no-cache, no-store, must-revalidate' } },
      '/**': { headers: { 'cache-control': 'max-age=0, must-revalidate' } },
    },
  },
});