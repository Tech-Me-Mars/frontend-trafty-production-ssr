<template>
  <div class="flex flex-wrap items-center gap-4 mt-4" v-if="socials.length">
    <div v-for="s in socials" :key="s.id">
      <a
        :href="s.social_link"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-center w-7 h-7 rounded-full shadow-sm hover:opacity-90 transition"
        :style="{ backgroundColor: s.bg_color }"
        :aria-label="s.name"
      >
        <i :class="s.icon" class="text-white text-[14px]"></i>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const props = defineProps({
  // รับ array จาก API โดยตรง: business_social_media
  business_social_media: {
    type: Array,
    default: () => []
  }
})

// helper ดึงข้อความตามภาษา (รองรับทั้ง object และ string JSON)
const getI18nLocal = (val) => {
  if (!val) return ''
  try {
    const o = typeof val === 'string' ? JSON.parse(val) : val
    return o?.[locale.value] ?? o?.th ?? Object.values(o || {})[0] ?? ''
  } catch {
    return ''
  }
}

const getHost = (url) => {
  try {
    const u = new URL(url)
    return u.hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

const ensureHttp = (url) => {
  if (!url) return '#'
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

const isKnownBrandKey = (key = '') => {
  const k = key.toLowerCase()
  return (
    k.includes('facebook') || k.includes('line') || k.includes('discord') ||
    k.includes('twitter') || k.includes('x-twitter') || k === 'x' || k.includes('instagram') ||
    k.includes('youtube') || k.includes('tiktok')
  )
}

const brandColor = (key = '') => {
  const k = key.toLowerCase()
  if (k.includes('facebook')) return '#1877F2'
  if (k.includes('line'))     return '#00C300'
  if (k.includes('discord'))  return '#5865F2'
  if (k.includes('twitter') || k.includes('x-twitter') || k === 'x') return '#14171A'
  if (k.includes('instagram')) return '#E1306C'
  if (k.includes('youtube'))   return '#FF0000'
  if (k.includes('tiktok'))    return '#000000'
  if (k.includes('globe') || k.includes('website')) return '#0ea5e9'
  return '#202c54'
}

const socials = computed(() =>
  (props.business_social_media || []).map((s) => {
    const nameI18n = getI18nLocal(s.social_media_name_i18n)
    const linkRaw = s.social_media_link || s.social_link || ''
    const link = ensureHttp(linkRaw)
    const iconRaw = s.icon || ''
    const keyForColor = iconRaw || nameI18n || getHost(link)

    // ถ้า icon เป็นแบรนด์อยู่แล้ว ให้คง icon นั้นไว้
    const hasBrandIcon = isKnownBrandKey(iconRaw)
    // ถ้าไม่มี brand icon ให้ fallback เป็น globe
    const icon = hasBrandIcon ? iconRaw : 'fa-solid fa-globe'

    const bg = s.bg_color || brandColor(hasBrandIcon ? iconRaw : 'website')
    const displayName = nameI18n || getHost(link) || 'website'

    return {
      id: s.id,
      name: displayName,
      icon,
      social_link: link,
      bg_color: bg,
    }
  })
)
</script>
