<template>
  <div class="mt-4">
    <h2 class="text-lg font-bold text-gray-700">{{ $t('หมวดหมู่') }}</h2>

    <swiper
      class="mt-4"
      :slides-per-view="4"
      space-between="20"
      pagination
      @slideChange="onSlideChange"
      :breakpoints="{
        768: { slidesPerView: 5 },
        1024: { slidesPerView: 6 }
      }"
    >
      <!-- 1 slide = 2 items บนล่าง -->
      <swiper-slide
        v-for="(pair, index) in groupedCategory"
        :key="index"
        class="flex flex-col items-center space-y-4"
      >
        <div
          v-for="item in pair"
          :key="item.id"
          class="flex flex-col items-center text-center"
        >
          <NuxtLink
            :to="`/client/category/${item.id}`"
            :style="{ backgroundColor: item.bg_color }"
            class="p-3 rounded-lg shadow-md cursor-pointer transform transition-transform hover:scale-105"
          >
            <img :src="item.image" class="w-9 h-9 md:w-12 md:h-12" alt="Category Image" />
          </NuxtLink>
          <span class="mt-2 text-sm font-medium text-gray-800 text-ellipsis whitespace-nowrap w-16 overflow-hidden">
            {{ item.business_type_name }}
          </span>
        </div>
      </swiper-slide>
    </swiper>

    <!-- Progress Bar -->
    <div class="max-w-[3rem] mx-auto">
      <div class="relative w-full h-1.5 bg-gray-300 rounded-full mt-4">
        <div
          class="absolute top-0 left-0 h-1.5 bg-[#281c74] rounded-full transition-all"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import { ref, onMounted, computed } from "vue";
import * as dataApi from "../api/data.js";

const resCategoryType = ref([]);
const currentSlideIndex = ref(0);
const progressPercentage = ref(0);

// ✅ จัดกลุ่มละ 2
const groupedCategory = computed(() => {
  const result = [];
  const items = resCategoryType.value;
  for (let i = 0; i < items.length; i += 2) {
    result.push(items.slice(i, i + 2));
  }
  return result;
});

function onSlideChange(swiper) {
  currentSlideIndex.value = swiper.activeIndex;
  progressPercentage.value = ((swiper.activeIndex + swiper.params.slidesPerView) / groupedCategory.value.length) * 100;
}

async function loadBusinessType() {
  try {
    const res = await dataApi.getBusinessType();
    resCategoryType.value = res.data.data;
  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
  loadBusinessType();
});
</script>
