<template>
    <div class="bg-zinc-100 min-h-screen flex flex-col items-center justify-center">
        <div class="p-6 max-w-md mb-2">
            <!-- Check Icon -->
            <!-- <div class="flex items-center justify-center w-16 h-16 !bg-green-600 p-1 rounded-full mx-auto">
                <i class="fa-solid fa-check text-white text-3xl"></i>
            </div> -->

            <!-- Title -->
            <!-- <h1 class="text-xl font-semibold mt-6 text-center">{{ t('อนุมัติใบเตือนสำเร็จ') }}</h1> -->

        </div>
        <div class="p-6 max-w-md w-full ">

            <!-- Progress Circle Section -->
            <div class="flex justify-center items-center mb-8">
                <van-circle v-model:current-rate="currentRate" :rate="rate" :speed="100" :stroke-width="50"
                    :color="circleColor" layer-color="#ebedf0" size="140px" :text="text" />
            </div>


            <div v-if="resData?.status_business == false" class="text-center px-4 mb-20">
                <p class="text-xl font-bold text-gray-900">{{ t('ไม่ผ่านเกณฑ์') }}</p>
                <p class="text-sm text-gray-600 mt-2 text-primary-main">
                    {{ t('ไม่ผ่านเกณฑ์มาตราฐานความปลอดภัย กรุณาออกใบเตือนใหม่') }}
                </p>
            </div>

            <div v-if="resData?.status_business == true" class="text-center px-4 mb-20">
                <p class="text-xl font-bold text-gray-900">{{ t('ผ่านเกณฑ์') }}</p>
                <p class="text-sm text-gray-600 mt-2 text-primary-main">
                    {{ t('ผ่านเกณฑ์มาตราฐานความปลอดภัย ได้รับการอนุมัติเรียบร้อย') }}
                </p>
            </div>

            <NuxtLink to="/inspector/home">
                <Button :loading="isloadingAxi" :label="t('กลับสู่หน้าหลัก')" severity="primary" variant="outlined"
                    rounded class="w-full" :pt="{
                        root: {
                            class: '!border-primary-main'
                        },
                    }" />
            </NuxtLink>
        </div>

    </div>
</template>

<script setup>
definePageMeta({
    middleware: ["auth"],
});
import * as dataApi from "../api/data.js";

import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const isloadingAxi = useState("isloadingAxi");

const route = useRoute()

const resData = ref()
const loadData = async () => {
    try {
        const res = await dataApi.getCheckPassOrFail(route.params.id);
        resData.value = res.data.data;
        if (res.data.data?.status_business == false) {
            rate.value = res.data.data?.score_percent_failed
            currentRate.value = res.data.data?.score_percent_failed
        } else if (res.data.data?.status_business == true) {
            rate.value = res.data.data?.score_percent_pass
            currentRate.value = res.data.data?.score_percent_pass
        }

    } catch (error) {
        console.error(error)
    }
}
onMounted(() => {
    loadData();
})

const circleColor = computed(() => {
  return resData.value?.status_business ? "#15803d" : "#b91c1c"; // สีเขียวถ้าผ่าน, สีแดงถ้าไม่ผ่าน
});
const router = useRouter();
const currentRate = ref(0);
const rate = ref(0);
const text = computed(() => {
    return currentRate.value !== null && currentRate.value !== undefined
        ? `${currentRate.value.toFixed(2)}%`
        : "0%";
});
</script>

<style scoped>
/* Add custom styles here if needed */
</style>