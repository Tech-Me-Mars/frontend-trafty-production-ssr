<template>
    <div class="bg-zinc-100 min-h-screen flex flex-col items-center justify-center">
        <div class="p-6 max-w-md mb-10">
            <!-- Check Icon -->
            <div class="flex items-center justify-center w-16 h-16 !bg-green-600 p-1 rounded-full mx-auto">
                <!-- <i class="fas fa-check text-white text-3xl"></i> -->
                <i class="fa-solid fa-check text-white text-3xl"></i>
            </div>

            <!-- Title -->
            <h1 class="text-xl font-semibold mt-6 text-center">{{ t('บันทึกข้อมูลแล้ว') }}</h1>

            <!-- Description -->
            <p class="text-gray-600 mt-2 text-center">
                <!-- {{ t('ตอนนี้คุณอยู่ในสถานะการรออนุมัติจากเจ้าหน้าที่ หลังจากที่ได้รับการอนุมัติแล้ว แหล่งท่องเที่ยวของคุณจะถูกแสดงในหน้าเว็บไซต์') }} -->
                  {{ t('บันทึกข้อมูลเรียบร้อยแล้ว กรุณาประเมินแบบมาตรฐานความปลอดภัย') }}
            </p>
        </div>
        <div class="p-6 max-w-md w-full ">
            <!-- Button -->

            <Button @click="finish()" :loading="isloadingAxi" :label="t('เริ่มต้นเลย')" severity="primary" rounded
                class="w-full" :pt="{
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
import { useFormStore } from "@/store/businessStore.js";
const formStore = useFormStore(); // ใช้ Pinia Store
const isloadingAxi = useState("isloadingAxi");
const route = useRoute()

const finish = async () => {
    await formStore.$reset();
    navigateTo(`/vendor/manage-business/home/${route.query.bussiness_id}`)
}
</script>

<style scoped>
/* Add custom styles here if needed */
</style>