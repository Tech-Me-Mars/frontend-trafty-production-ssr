<template>
    <div class="bg-zinc-100 min-h-screen flex flex-col items-center justify-center">
        <div class="p-6 max-w-md mb-10">
            <!-- Check Icon -->
            <div class="flex items-center justify-center w-16 h-16 !bg-green-600 p-1 rounded-full mx-auto">
                <!-- <i class="fas fa-check text-white text-3xl"></i> -->
                <i class="fa-solid fa-check text-white text-3xl"></i>
            </div>

            <!-- Title -->
            <h1 class="text-xl font-semibold mt-6 text-center">{{ t('ส่งใบเตือนสำเร็จ') }}</h1>
            
        </div>
        <div class="p-6 max-w-md w-full ">
            <!-- Button -->
            <NuxtLink to="/inspector/home">
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

</script>

<style scoped>
/* Add custom styles here if needed */
</style>