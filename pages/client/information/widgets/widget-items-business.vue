<template>
  <div class="bg-white p-4 border-zinc-200 overflow-hidden">
    <div class="px-4 pt-4">
      <h2 class="text-zinc-800 font-semibold text-[15px]">
        {{ t('รายการธุรกิจในแหล่งท่องเที่ยว') }}
      </h2>

      <ul class="mt-3">
        <li
          v-for="item in visibleItems"
          :key="item.id"
          class="flex items-center justify-between py-2 text-[15px]"
        >
          <!-- ชื่อ + จุดนำหน้า -->
          <div class="relative pl-4 pr-3 min-w-0">
            <span class="absolute left-0 top-1.5 block w-1.5 h-1.5 rounded-full bg-[#969ac1]"></span>
            <span class="text-zinc-900 truncate">{{ item.name }}</span>
          </div>
          <!-- ราคา -->
          <span class="text-zinc-900 whitespace-nowrap">
            {{ item.priceDisplay }}
          </span>
        </li>

        <!-- ไม่มีข้อมูล -->
        <li v-if="!items.length" class="py-2 text-sm text-zinc-500">
          {{ t('ยังไม่มีรายการ') }}
        </li>
      </ul>
    </div>

    <!-- ดูเพิ่มเติม -->
    <button
      v-if="items.length > limit"
      class="w-full flex items-center justify-center gap-1 py-3 text-sm text-gray-500 border-t bg-white"
      @click="expanded = !expanded"
      type="button"
    >
      <span>{{ expanded ? t('ซ่อน') : t('ดูเพิ่มเติม') }}</span>
      <i :class="expanded ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"></i>
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const props = defineProps({
  // รับจากพาเรนต์: resInfo?.business_list
  resInfo: {
    type: Array,
    default: () => []
  }
})

/* ---------- helpers ---------- */
const formatPrice = (val) => {
  if (val == null) return ''
  const s = String(val).trim()
  // ช่วงราคา: "250-400" หรือ "250 - 400"
  if (s.includes('-') || s.includes('–')) {
    const parts = s.split(/-|–/).map(p => p.trim())
    const f = parts
      .map(p => {
        const n = Number(p.replace(/[, ]/g, ''))
        return Number.isFinite(n) ? n.toLocaleString('th-TH') : p
      })
      .join(' - ')
    return `฿ ${f}`
  }
  // เดี่ยว
  const n = Number(s.replace(/[, ]/g, ''))
  return `฿ ${Number.isFinite(n) ? n.toLocaleString('th-TH') : s}`
}

/* ---------- map data ---------- */
const items = computed(() =>
  (props.resInfo || []).map(x => ({
    id: x.id,
    name: getI18n(x.business_list_name_i18n, locale.value), // auto-import จาก composables
    priceDisplay: formatPrice(x.business_list_price)
  }))
)

/* ---------- show more ---------- */
const limit = 4
const expanded = ref(false)
const visibleItems = computed(() => (expanded.value ? items.value : items.value.slice(0, limit)))
</script>
