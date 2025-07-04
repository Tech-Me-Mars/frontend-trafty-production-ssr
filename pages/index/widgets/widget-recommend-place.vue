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
                <NuxtLink :to="`/client/information/${place.id}`">
                    <img :src="place.image_cover" :alt="place.shop_name"
                        class="w-full h-full object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-105" />
                </NuxtLink>
                <div
                    class="absolute bottom-0 left-0 bg-gradient-to-t from-black via-transparent to-transparent p-2 rounded-lg w-full">
                    <h3 class="text-white text-sm font-bold">{{ place.shop_name }}</h3>
                    <p class="text-white text-xs">{{ place.business_address }}</p>
                </div>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import { ref, onMounted } from "vue";
import * as dataApi from "../api/data.js";


const resRecommendPlace = ref([])
const loadRecommendPlace = async () => {
    try {
        const res = await dataApi.getRecommendPlace();
        resRecommendPlace.value = res.data.data;
    } catch (error) {
        console.error(error);
    }
}

onMounted(() => {
    loadRecommendPlace();
});
</script>