<template>
  <div class="min-h-screen bg-zinc-50 flex flex-col ">
    <!-- Header -->
    <LayoutsBaseHeader
      :title="t('ส่งใบเตือน')"
      :showBack="true"
      :backTo="goBack()"
    />

    <!-- Form Section -->
    <section class="max-w-lg w-full mx-auto flex-1 px-4 pt-5">
              <label class="block text-gray-600 mb-1">สถานที่</label>
        <InputText
          v-model="shopName"
          placeholder="Riva cafe"
          class="w-full mb-4"
        />
      <!-- Input ร้านค้า -->
      <div class="bg-white rounded-xl shadow-sm border border-zinc-100 px-4 pt-7 pb-4">


        <div class="text-base font-semibold text-[#202c54] mb-2">
          ข้อที่ไม่ผ่านเกณฑ์มาตรฐานความปลอดภัย
        </div>

        <!-- ข้อที่ไม่ผ่าน -->
        <div v-for="(item, idx) in failedItems" :key="idx" class="mb-3">
          <div class="flex items-start gap-2">
            <i class="pi pi-times-circle text-red-500 text-lg mt-0.5"></i>
            <span class="text-gray-800 font-medium text-sm">{{ item.title }}</span>
          </div>
          <div class="pl-6">
            <div class="text-xs font-bold text-gray-700 mb-1 mt-1">หมายเหตุ</div>
            <div class="text-xs text-gray-500">
              {{ item.note }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ปุ่มล่างสุด -->
    <div class="max-w-lg w-full mx-auto px-4 py-4">
      <Button
        label="ส่งใบเตือน"
        class="w-full rounded-full !bg-[#202c54] !border-[#202c54] !text-white mb-2"
      rounded
      />
            <Button
            icon="pi pi-print"
        label="พิมพ์เอกสาร"
        class="w-full rounded-full "
      rounded
      outlined
      />
      <!-- <Button
        class="w-full rounded-full !border-[#202c54] !text-[#202c54] bg-white"
        style="height: 42px; font-weight: 600; font-size: 1rem;"
        outlined
      >
        <template #icon>
          <i class="pi pi-download mr-2 text-base"></i>
        </template>
        พิมพ์เอกสาร
      </Button> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
// import 'primeicons/primeicons.css'
// const { t } = useI18n()
const t = (s) => s
const goBack = () => '/'

// Demo state
const shopName = ref('Riva cafe')
const failedItems = [
  {
    title: '๒.๑ สถานบริการได้รับมาตรฐาน SHA',
    note: 'หมายเหตุที่กรอกเข้ามา',
  },
  {
    title: '๒.๑.๔ อาหารและเครื่องดื่มสะอาดปลอดภัย ถูกสุขอนามัย',
    note: 'หมายเหตุที่กรอกเข้ามา',
  },
  {
    title: '๒.๑.๕ ผู้ประกอบอาหารแต่งกายถูกหลักอนามัย มีการควบคุมประกอบอาหาร ฯลฯ',
    note: 'หมายเหตุที่กรอกเข้ามา',
  },
  {
    title: '๒.๑.๖ มีใบอนุญาตประกอบการโรงแรมถูกต้อง',
    note: 'หมายเหตุที่กรอกเข้ามา',
  },
]
</script>
