<template>
    <div class="bg-zinc-100 min-h-screen">
      <!-- เนื้อหาให้กึ่งกลางแนวตั้ง (กันทับปุ่มล่างด้วย pb แบบ dynamic) -->
      <div class="max-w-md mx-auto px-6">
        <div
          class="min-h-[calc(100vh-120px)] grid place-content-center text-center"
          :style="{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 88px)' }"
        >
          <div class="flex items-center justify-center w-16 h-16 !bg-green-600 p-1 rounded-full mx-auto">
            <i class="fa-solid fa-check text-white text-3xl"></i>
          </div>
  
          <h1 class="text-xl font-semibold mt-6">{{ t('บันทึกข้อมูลแล้ว') }}</h1>
  
          <p class="text-primary-main mt-2">
            {{ t('ตอนนี้คุณอยู่ในสถานะการรออนุมัติจากเจ้าหน้าที่ หลังจากที่ได้รับการอนุมัติแล้ว แหล่งท่องเที่ยวของคุณจะถูกแสดงในหน้าเว็บไซต์') }}
          </p>
        </div>
      </div>
  
      <!-- ปุ่มชิดขอบล่างจอ -->
      <div
        class="fixed bottom-0 left-0 right-0 z-30"
        :style="{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }"
      >
        <div class="max-w-md mx-auto px-4 py-3">
          <Button
            @click="finish()"
            :loading="isloadingAxi"
            :label="t('เริ่มต้นเลย')"
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
  import { useFormStore } from '@/store/businessStore.js'
  const formStore = useFormStore()
  const isloadingAxi = useState('isloadingAxi')
  const route = useRoute()
  
  const finish = async () => {
    await formStore.$reset();
    navigateTo(`/vendor/manage-business/home/${route.query.bussiness_id}`)
  }
  </script>
  