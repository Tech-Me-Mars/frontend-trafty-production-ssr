<template>
  <div class="bg-zinc-100 min-h-screen flex flex-col">
    <!-- เนื้อหากลางจอ -->
    <div class="flex-1 flex items-center justify-center px-4 pb-28">
      <div class="p-6 max-w-md w-full">
        <div class="flex items-center justify-center w-16 h-16 !bg-green-600 p-1 rounded-full mx-auto">
          <i class="fa-solid fa-check text-white text-3xl"></i>
        </div>
        <h1 class="text-xl font-semibold mt-6 text-center">{{ t('จัดการใบเตือนสำเร็จ') }}</h1>
        <p class="text-gray-600 mt-2 text-center">
          {{ t('เจ้าหน้าที่จะตรวจสอบใบเตือนของคุณอีกครั้ง') }}
        </p>
      </div>
    </div>

    <!-- แถบปุ่มล่าง (fixed) -->
    <div class="fixed bottom-0 left-0 right-0 ">
      <div class="max-w-md mx-auto w-full p-6">
        <Button
          :loading="isloadingAxi"
          outlined
          @click="navigateTo(`/vendor/manage-business/home/${route.query.BusinessId}`)"
          :label="t('กลับสู่หน้าหลัก')"
          severity="primary"
          rounded
          class="w-full"
          :pt="{ root: { class: '!border-primary-main' } }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: ['auth'] })
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const isloadingAxi = useState('isloadingAxi')
const route = useRoute()
</script>
