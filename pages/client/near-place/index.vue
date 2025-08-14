<template>
  <div class="bg-zinc-100 min-h-screen">
    <LayoutsBaseHeader :title="t('สถานที่ใกล้ฉัน')" :showBack="true" backTo="/" :showMenu="false" />

    <section class="p-4">

      <!-- List -->
      <template>
        <div v-if="nearbyResults.length > 0" v-for="(p, index) in nearbyResults" :key="index"
          class="flex items-center space-x-4 border-b pb-4 cursor-pointer hover:bg-zinc-50">
          <img :src="p.image_profile" :alt="getI18n(p.shop_name_i18n, locale)"
            class="w-16 h-16 object-cover rounded-md" />
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-bold truncate">
              {{ getI18n(p.shop_name_i18n, locale) }}
            </h3>
            <p class="text-xs text-gray-500 truncate">
              {{ getI18n(p.shop_address_i18n, locale) }}
            </p>
            <p v-if="p.distance_km" class="text-xs text-gray-400 mt-1">
              {{ Number(p.distance_km).toFixed(2) }} km
            </p>
          </div>
          <div class="flex items-center text-orange-500">
            <i class="fa-solid fa-star mr-1"></i>
            <span class="text-sm font-semibold">{{ p.star }}</span>
          </div>
        </div>

        <SharedNoData v-else />
      </template>

      <!-- Actions -->

      <!-- Error -->
      <p v-if="error" class="text-red-600 text-sm mt-3">
        {{ error }}
      </p>
    </section>
  </div>
</template>

<script setup>
definePageMeta({ middleware: ['auth'] })

import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

import * as dataApi from './api/data.js'

// 1) ใช้ composable ที่คุณมี
const { lat, lon, source, ready, error, refresh } = useGetLatLon({
  // redirect ถ้าไม่มี lat/lon ทั้งคู่ (composable จะจัดการให้)
  redirectTo: '/profile/my-location'
})

const route = useRoute()
const loading = ref(false)
const nearbyResults = ref([])

// radius กำหนดได้จาก query หรือใช้ค่า default
const radiusKm = computed(() => Number(route.query.radius ?? 10))

// 2) ยิง API เมื่อพร้อมและมีทั้ง lat/lon
const loadNearPlace = async () => {
  if (!process.client) return
  // ป้องกันกรณี ready ยังไม่ true
  if (!ready.value) return
  // ป้องกันกรณี lat/lon ไม่ครบ (เผื่อคุณปิด redirect ใน composable ในอนาคต)
  if (lat.value == null || lon.value == null || lat.value === '' || lon.value === '') return

  try {
    loading.value = true
    const payload = {
      latitude: Number(lat.value),
      longitude: Number(lon.value),
      radius_km: radiusKm.value
    }
    const res = await dataApi.getNearPlace(payload)
    nearbyResults.value = Array.isArray(res?.data?.data) ? res.data.data : []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 3) รอจน ready -> ค่อยโหลด
watch(
  () => ready.value,
  (v) => {
    if (v) loadNearPlace()
  },
  { immediate: true }
)

// 4) ปุ่มรีเฟรช: ขอพิกัดใหม่ แล้วค่อยโหลดซ้ำ
const handleRefresh = async () => {
  await refresh()    // ขอ geolocation อีกครั้ง / ลอง cookie อีกครั้งตาม logic ใน composable
  await loadNearPlace()
}

// ถ้าต้องการโหลดซ้ำเมื่อ radius เปลี่ยน
watch(radiusKm, () => loadNearPlace())
</script>
