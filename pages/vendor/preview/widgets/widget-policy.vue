<template>
  <div class="bg-white border border-zinc-100 overflow-hidden">
    <!-- Header -->
    <div class="p-4 border-b flex items-center justify-between">
      <h1 class="text-lg font-bold">{{ t('มาตรฐานความปลอดภัย') }}</h1>
      <NuxtLink :to="`/vendor/preview/policy-full/${route.params.id}`" class="text-gray-500 text-sm hover:text-gray-700 transition">
        {{ t('ดูทั้งหมด') }} <i class="fa-solid fa-chevron-right"></i>
      </NuxtLink>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="p-4">
      <div class="h-4 w-40 bg-zinc-200 rounded mb-4 animate-pulse"></div>
      <ul class="space-y-3">
        <li v-for="n in 6" :key="n" class="flex items-start space-x-3">
          <div class="w-5 h-5 rounded-full bg-zinc-200 animate-pulse mt-0.5"></div>
          <div class="flex-1">
            <div class="h-4 bg-zinc-200 rounded w-[90%] mb-2 animate-pulse"></div>
            <div class="h-3 bg-zinc-200 rounded w-[70%] animate-pulse"></div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Content -->
    <div v-else class="p-4">
      <!-- Title / Shop name if available -->

      <!-- List -->
      <ul v-if="items.length" class="space-y-5">
        <li
          v-for="(item, index) in items"
          :key="index"
          class="flex items-start space-x-3"
        >
          <i
            v-if="item.FieldValue === '1'"
            class="fa-solid fa-circle-check text-blue-700 mt-1"
          ></i>
          <i
            v-else
            class="fa-solid fa-circle-xmark text-red-600 mt-1"
          ></i>

          <div class="flex-1">
            <span class="block">
              {{ getI18n(item.questions_field_name_display) }}
            </span>

            <!-- แสดงรายละเอียดเสริม (ถ้ามี) -->
            <div v-if="item.items && item.items.length" class="mt-1 text-xs text-zinc-500">
              <ul class="list-disc ms-5 space-y-0.5">
                <li v-for="(sub, idx) in item.items" :key="idx">
                  {{ typeof sub === 'string' ? sub : JSON.stringify(sub) }}
                </li>
              </ul>
            </div>

            <!-- แสดงค่าที่ตอบ (fallback) -->

          </div>
        </li>
      </ul>

      <!-- Empty state -->
      <div v-else class="text-sm text-zinc-500 py-2">
        {{ t('ยังไม่มีรายการ') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import * as dataApi from '../api/data.js'

const { t, locale } = useI18n()
const route = useRoute()

const isLoading = ref(true)
const resPolicy = ref([])

/**
 * แปลง JSON string i18n -> ข้อความตามภาษา
 */


/**
 * แสดงคำตอบใน Badge (เผื่อกรณีไม่ใช่ 1/0)
 */
const displayChoice = (val) => {
  if (val === '1') return t('มี / ปฏิบัติ')
  if (val === '0') return t('ไม่มี / ไม่ปฏิบัติ')
  return val ?? '-'
}

/**
 * ดึงชื่อร้าน/สถานที่จากข้อมูลตัวแรก (ถ้ามี)
 */


/**
 * สร้างรายการ item สำหรับแสดงผล (flat list)
 * ใช้ทุก element ใน resPolicy เป็นหนึ่งแถว
 */
const items = computed(() => {
  return (resPolicy.value || [])
    .map((x) => ({
      questions_field_name_display: x?.questions_field_name_display,
      FieldValue: String(x?.FieldValue ?? ''),
      index: x?.index ?? '',
      items: x?.items ?? []
    }))
    .slice(0, 10) // ✅ limit 10
})

const loadPolicy = async () => {
  try {
    isLoading.value = true
    // ถ้ามี API จริง
    const res = await dataApi.getSurveyAuditAllByBusinessId(route.params.id)
    // สมมติ API ส่งกลับ data.data = array รูปแบบเดียวกับตัวอย่าง
    resPolicy.value = Array.isArray(res?.data?.data) ? res.data.data : []

    // ถ้าอยากทดสอบกับ mock (ใส่ไว้เป็น comment)
    // resPolicy.value = [
    //   { FieldValue: '1', questions_field_name_display: '{"th":"ตัวอย่างข้อ 1","en":"Ex 1","cn":""}', index: 1, items: [] },
    //   { FieldValue: 'ไม่มี /ไม่ปฏิบัติ', questions_field_name_display: '{"th":"ตัวอย่างข้อ 2","en":"Ex 2","cn":""}', index: 2, items: ['รายละเอียดเพิ่มเติม A'] },
    // ]
  } catch (err) {
    console.error(err)
    resPolicy.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(loadPolicy)
</script>

<style scoped>
/* เพิ่ม touch-friendly spacing เล็กน้อยบนจอเล็ก */
@media (max-width: 480px) {
  li > span {
    line-height: 1.4;
  }
}
</style>
