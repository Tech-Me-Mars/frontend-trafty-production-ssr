<template>
    <div class="bg-zinc-100 min-h-screen flex flex-col items-center justify-center">
        <div class="p-6 max-w-md mb-10">
            <!-- Check Icon -->
            <div class="flex items-center justify-center w-16 h-16 !bg-green-600 p-1 rounded-full mx-auto">
                <!-- <i class="fas fa-check text-white text-3xl"></i> -->
                <i class="fa-solid fa-check text-white text-3xl"></i>
            </div>

            <!-- Title -->
            <h1 class="text-xl font-semibold mt-6 text-center">{{ t('ทำแบบประเมินสำเร็จ') }}</h1>

            <!-- Description -->
            <p class="text-gray-600 mt-2 text-center max-w-[14rem] md:max-w-[25rem] lg:max-w-none">
                {{ t('การประเมินมาตรฐานความปลอดภัยแหล่งท่องเที่ยวของคุณอยู่ที่') }} {{ resSurveyBusiness?.score_percent }} %
            </p>
        </div>
        <div class="p-6 max-w-md w-full ">
            <!-- Button -->
            <NuxtLink :to="`/vendor/manage-business/home/${route.params.id}`">
                <Button :loading="isloadingAxi" :label="t('กลับสู่หน้าหลัก')" severity="primary" variant="outlined" rounded class="w-full" :pt="{
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
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const isloadingAxi = useState("isloadingAxi");
import * as dataApi from "./api/data.js";
const route = useRoute();

const resSurveyBusiness=ref()
const loadSurveyBusiness= async()=>{
    try {
        const res = await dataApi.getSuveyBusiness(route.params.id)
        resSurveyBusiness.value =res.data.data
    } catch (error) {
        console.error(error)
    }
}
onMounted(()=>{
    loadSurveyBusiness();
})
</script>

<style scoped>
/* Add custom styles here if needed */
</style>