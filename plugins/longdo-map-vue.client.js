import LongDoMap from "longdo-map-vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(LongDoMap, {
    load: {
      apiKey: "f38639d33e37f4e422cd8085d997d55f", // 🔹 ใส่ API Key ของคุณที่นี่
    },
  });
});

// import Vue from 'vue'
// import LongdoMap from 'longdo-map-vue'

// Vue.use(LongdoMap, {
//   load: {
//     apiKey: 'f38639d33e37f4e422cd8085d997d55f', // 🔹 ใส่ API Key ของคุณที่นี่
//   },
// })
