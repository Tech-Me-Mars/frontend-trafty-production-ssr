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
  // รับโครงจาก API ตรง ๆ: resInfo.business_social_media
  resInfo: {
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

// โดเมนจากลิงก์ (ไว้โชว์เป็นชื่อถ้าเป็น website)
const getHost = (url) => {
  try {
    const u = new URL(url)
    return u.hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

// ตรวจว่าเป็นแพลตฟอร์มโซเชียลยอดนิยมไหม
const isKnownBrand = (key = '') => {
  const k = key.toLowerCase()
  return (
    k.includes('facebook') || k.includes('line') || k.includes('discord') ||
    k.includes('twitter') || k.includes('x.com') || k.includes(' x') ||
    k.includes('instagram') || k.includes('youtube') || k.includes('tiktok')
  )
}

// สีตามแบรนด์ + website
const brandColor = (iconOrName = '') => {
  const key = (iconOrName || '').toLowerCase()
  if (key.includes('facebook')) return '#1877F2'
  if (key.includes('line'))     return '#00C300'
  if (key.includes('discord'))  return '#5865F2'
  if (key.includes('twitter') || key.includes('x-twitter') || key.includes(' x')) return '#14171A'
  if (key.includes('instagram')) return '#E1306C'
  if (key.includes('youtube'))   return '#FF0000'
  if (key.includes('tiktok'))    return '#000000'
  if (key.includes('website') || key.includes('globe')) return '#0ea5e9' // website
  return '#202c54'
}

// เป็น website ไหม? (ลิงก์ทั่วไป/ชื่อบอกว่าเว็บไซต์/ไอคอน globe)
const isWebsite = ({ icon, name, link }) => {
  const key = `${icon || ''} ${name || ''}`.toLowerCase()
  const nameLooksWebsite =
    key.includes('website') || key.includes('web') || key.includes('ไซต์') || key.includes('เว็บไซต์') || key.includes('เวบไซต์')
  const hasGlobeIcon = key.includes('globe')
  const urlHost = getHost(link)
  const hostLooksBrand = isKnownBrand(urlHost)
  return !hostLooksBrand && (nameLooksWebsite || hasGlobeIcon || !!urlHost)
}

// map ข้อมูลจาก API -> โครงที่ template ใช้
const socials = computed(() =>
  (props.resInfo || []).map(s => {
    const nameI18n = getI18nLocal(s.social_media_name_i18n)
    const link = s.social_media_link || s.social_link || '#'
    const iconRaw = s.icon || (s.social_type && s.social_type.icon) || ''

    const website = isWebsite({ icon: iconRaw, name: nameI18n, link })
    const icon = iconRaw || (website ? 'fa-solid fa-globe' : 'fa-solid fa-share-nodes')
    const bg = s.bg_color || brandColor(iconRaw || (website ? 'website' : nameI18n))
    const displayName = nameI18n || (website ? getHost(link) : '')

    return {
      id: s.id,
      name: displayName || 'website',
      icon,
      social_link: link,
      bg_color: bg,
    }
  })
)
</script>
