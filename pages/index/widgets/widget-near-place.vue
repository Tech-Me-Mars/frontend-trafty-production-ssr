<template>
    <div class="p-4">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold">{{ t('สถานที่ใกล้ฉัน') }}</h2>
            <NuxtLink to="/client/near-place" class="hover:underline cursor-pointer">{{ t('ดูทั้งหมด') }} <i
          class="fa-solid fa-arrow-right rounded-sm text-gray-700"
          style="background-color: #ddd6fe; font-size: 14px;"></i></NuxtLink>

        </div>
        <div class="space-y-4">
            <div v-for="(place, index) in nearbyPlaces" :key="index"
                class="flex items-center space-x-4 border-b pb-4 cursor-pointer" @click="navigateTo(`/client/information/${place.id}`)">
                <img :src="place.image_profile" :alt="place.shop_name" class="w-16 h-16 object-cover rounded-md" />
                <div class="flex-1">
                    <h3 class="text-sm font-bold">{{ place.shop_name }}</h3>
                    <p class="text-xs text-gray-500">{{ place.shop_address }}</p>
                </div>
                <div class="flex items-center text-orange-500">
                    <i class="fa-solid fa-star mr-1"></i>
                    <span class="text-sm font-semibold">{{ place.star }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import * as dataApi from "../api/data.js";
const nearbyPlaces = ref([])
const loadNearPlace = async () => {
    try {
        const res = await dataApi.getNearPlace();
        nearbyPlaces.value = res.data.data;
    } catch (error) {

    }
}
onMounted(()=>loadNearPlace())

</script>