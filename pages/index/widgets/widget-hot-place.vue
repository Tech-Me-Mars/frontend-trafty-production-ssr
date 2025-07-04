<template>

  <div class="mt-8">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-lg font-bold">{{ t('กำลังเป็นที่นิยม') }}</h2>
      <NuxtLink to="/client/hot-all" class="hover:underline cursor-pointer">{{ t('ดูทั้งหมด') }} <i
          class="fa-solid fa-arrow-right rounded-sm text-gray-700"
          style="background-color: #ddd6fe; font-size: 14px;"></i></NuxtLink>

    </div>
    <!-- <div class="grid grid-cols-2 gap-4">
          <div v-for="(place, index) in resHotPlace" :key="index" class="relative h-52">
            <NuxtLink :to="`/client/information/${place.id}`">
              <img :src="place.image_cover" :alt="place.shop_name" class="w-full h-full object-cover rounded-lg" />
            </NuxtLink>
            <div
              class="absolute bottom-0 left-0 bg-gradient-to-t from-black via-transparent to-transparent p-2 rounded-lg w-full">
              <h3 class="text-white text-sm font-bold">{{ place.shop_name }}</h3>
              <p class="text-white text-xs">{{ place.shop_address }}</p>
            </div>
          </div>
        </div> -->
    <swiper :slides-per-view="2" space-between="16" class="h-auto" :breakpoints="{
      640: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 4 },
    }">
      <swiper-slide v-for="(pair, index) in groupedPlaces" :key="index" style="  display: flex!important;
  flex-direction: column!important;
  gap: 1rem!important;">
        <template v-for="place in pair" :key="place.id">
          <NuxtLink :to="`/client/information/${place.id}`" class="relative group rounded-lg overflow-hidden shadow-lg">
            <div class="relative h-40 w-full">
              <img :src="place.image_cover" :alt="place.shop_name"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div class="absolute bottom-0 left-0 bg-gradient-to-t from-black via-transparent to-transparent p-2 w-full">
              <h3 class="text-white text-sm font-bold">{{ place.shop_name }}</h3>
              <p class="text-white text-xs">{{ place.shop_address }}</p>
            </div>
          </NuxtLink>
        </template>
      </swiper-slide>
    </swiper>
  </div>
</template>
<style>
/* .swiper-slide {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
} */
</style>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import { ref, onMounted } from "vue";
import * as dataApi from "../api/data.js";



const resHotPlace = ref([])
const loadHotPlace = async () => {
  try {
    const res = await dataApi.getHotPlace();
    resHotPlace.value = res.data.data;
  } catch (error) {
    console.error(error);
  }
}
const groupedPlaces = computed(() => {
  const pairs = [];
  for (let i = 0; i < resHotPlace.value.length; i += 2) {
    pairs.push(resHotPlace.value.slice(i, i + 2));
  }
  return pairs;
});

onMounted(() => {
  loadHotPlace();
});
</script>