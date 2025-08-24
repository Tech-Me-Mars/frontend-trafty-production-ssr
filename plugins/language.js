import { Locale } from 'vant'
import thTh from 'vant/es/locale/lang/th-Th'

Locale.use('th-Th', thTh)

import '@vant/touch-emulator'

export default defineNuxtPlugin((nuxtApp) => {
  // const vuetify = createVuetify({
  //     ssr: true,
  //     components,
  //     directives,
  // })
  //
  // nuxtApp.vueApp.use(vuetify)
})
