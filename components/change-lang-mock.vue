<template>
  <img
    :src="selectedFlag"
    alt="Flag"
    class="w-8 h-8 self-start cursor-pointer"
    @click="navigateTo('/profile/language')"
  />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  useEncryptedCookie,
  useDecryptedCookie,
  useClearEncryptedCookie,
} from '~/composables/useEncryptedCookie'

const { t, locales, locale, setLocale } = useI18n()
const flag = ref(null)
const languageName = ref('')

// 📦 ใช้ computed เพื่อให้ img src อัปเดตตาม cookie
const selectedFlag = computed(() => {
  return flag.value || '/image/flag/flag-thailand.png'
})

// ✅ อ่าน cookie ที่เข้ารหัสไว้ และตั้งค่า fallback ถ้าไม่มี
onMounted(async () => {
  let selectedLanguage = await useDecryptedCookie('selectedLanguage')

  if (
    !selectedLanguage ||
    !selectedLanguage.code ||
    !selectedLanguage.name ||
    !selectedLanguage.flag
  ) {
    selectedLanguage = {
      code: 'th',
      name: 'ไทย',
      flag: '/image/flag/flag-thailand.png',
    }

    await useEncryptedCookie('selectedLanguage', selectedLanguage)
  }

  flag.value = selectedLanguage.flag
  languageName.value = selectedLanguage.name
})
</script>
