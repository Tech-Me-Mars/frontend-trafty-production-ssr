<template>

    <div>
        <div class="flex justify-between items-center mb-2">
            <h2 class="text-lg font-bold">{{ t('สถานที่แนะนำ') }}</h2>
            <NuxtLink to="/client/recommend-all" class="hover:underline cursor-pointer">{{ t('ดูทั้งหมด') }} <i
                    class="fa-solid fa-arrow-right rounded-sm text-gray-700"
                    style="background-color: #ddd6fe; font-size: 14px;"></i></NuxtLink>
        </div>
        <swiper :slides-per-view="2" space-between="16" class="h-52" :breakpoints="{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
        }">
            <swiper-slide v-for="(place, index) in resRecommendPlace" :key="index" class="relative group">
                <!-- <NuxtLink :to="`/client/information/${place.id}`">
                    <img :src="place.image_cover" :alt="place.shop_name"
                        class="w-full h-full object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-105" />
                </NuxtLink>
                <div
                    class="absolute bottom-0 left-0 bg-gradient-to-t from-black via-transparent to-transparent p-2 rounded-lg w-full">
                    <h3 class="text-white text-sm font-bold">{{ place.shop_name }}</h3>
                    <p class="text-white text-xs">{{ place.business_address }}</p>
                </div> -->
            </swiper-slide>
        </swiper>
    </div>
</template>

<script setup>
import { useEncryptedCookie, useDecryptedCookie, useClearEncryptedCookie } from '~/composables/useEncryptedCookie'
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import { ref, onMounted } from "vue";
import * as dataApi from "../api/data.js";


const resRecommendPlace = ref([])
const toNum = (v) => {
  if (v === null || v === undefined) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

// ขอพิกัดจาก browser, คืน null ถ้าไม่ได้
const tryGetGeolocation = async () => {
  if (process.server || !('geolocation' in navigator)) return null
  return await new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
      }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  })
}

const loadRecommendPlace = async () => {
  // อ่าน cookie (ของคุณเป็น encrypted cookie อยู่แล้ว)
  const set_province_id = await useDecryptedCookie('set_province_id')
  const set_latitude     = await useDecryptedCookie('set_latitude')
  const set_longitude    = await useDecryptedCookie('set_longitude')

  const provinceId = toNum(set_province_id)
  const latCookie  = toNum(set_latitude)
  const lonCookie  = toNum(set_longitude)

  // เงื่อนไข:
  // 1) ถ้ามี province_id -> ใช้ province (lat/lon = 0)
  // 2) ถ้ามี lat & lon -> ใช้พิกัดจาก cookie (province_id = 0)
  // 3) ถ้าไม่มีทั้งคู่ -> ขอ geolocation
  //    - ถ้าได้ -> ใช้พิกัดจาก geo (province_id = 0)
  //    - ถ้าไม่ได้ -> redirect ไป '/profile/my-location'

  let payload = null

  if (provinceId && provinceId > 0) {
    payload = {
      province_id: provinceId,
    }
  } else if (latCookie !== null && lonCookie !== null) {
    payload = {
      province_id: 0,               // ตาม requirement
      latitude: latCookie,
      longitude: lonCookie,
      radius_km: 0,
    }
  } else {
    // ไม่มีทั้ง province และ lat/lon -> ขอ geo
    const geo = await tryGetGeolocation()
    if (!geo) {
      // ขอไม่ได้/ผู้ใช้บล็อก -> ให้ redirect
      await navigateTo('/profile/my-location')
      return
    }
    payload = {
      province_id: 0,               // ตาม requirement
      longitude: geo.lon,
      latitude: geo.lat,
      radius_km: 10,
    }
  }

  try {
    const res = await dataApi.getPlaceNearRecommended(payload)
    resRecommendPlace.value = res?.data?.data ?? []
  } catch (error) {
    console.error(error)
    resRecommendPlace.value = []
  }
}
onMounted(() => {
    loadRecommendPlace();
});
</script>