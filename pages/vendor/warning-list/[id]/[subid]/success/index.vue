<template>
    <div class="bg-zinc-100 min-h-screen flex flex-col items-center justify-center">
        <div class="p-6 max-w-md mb-10">
            <!-- Check Icon -->
            <div class="flex items-center justify-center w-16 h-16 !bg-green-600 p-1 rounded-full mx-auto">
                <!-- <i class="fas fa-check text-white text-3xl"></i> -->
                <i class="fa-solid fa-check text-white text-3xl"></i>
            </div>

            <!-- Title -->
            <h1 class="text-xl font-semibold mt-6 text-center">{{ t('จัดการใบเตือนสำเร็จ') }}</h1>

            <!-- Description -->
            <p class="text-gray-600 mt-2 text-center">
                {{ t('เจ้าหน้าที่จะตรวจสอบใบเตือนของคุณอีกครั้ง') }}
            </p>
        </div>
        <div class="p-6 max-w-md w-full ">
            <!-- Button -->
            <Button :loading="isloadingAxi" @click="navigateTo(`/vendor/manage-business/home/${route.params.id}`)" :label="t('กลับสู่หน้าหลัก')" severity="primary" rounded class="w-full" :pt="{
                root: {
                    class: '!border-primary-main'
                },
            }" />
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
const route = useRoute();

</script>

<style scoped>
/* Add custom styles here if needed */
</style>