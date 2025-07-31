<template>
  <div class="min-h-screen bg-white flex flex-col">

    <!-- ปุ่มแสดง Floating Panel -->
    <div class="p-4">
      <Button 
        label="เปิดแบบฟอร์ม" 
        class="bg-blue-900 text-white py-2 px-4 rounded-lg w-full"
        @click="height = anchors[1]"
      />
    </div>

    <!-- Floating Panel -->
    <van-floating-panel v-model:height="height" :anchors="anchors" :content-draggable="true">
      <div class="p-4 space-y-6 max-h-[75vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">แจ้งเตือนกลุ่ม</h2>
          <button class="text-gray-500 text-xl" @click="height = 0">
            <i class="pi pi-times" />
          </button>
        </div>

        <!-- Business Type Section -->
        <div>
          <h3 class="text-gray-800 font-medium mb-2">ประเภทธุรกิจ</h3>
          <div class="space-y-3">
            <div class="flex items-center" v-for="(label, value) in businessTypes" :key="value">
              <Checkbox 
                v-model="selectedBusinessTypes" 
                :inputId="value" 
                :value="value" 
                class="mr-3"
              />
              <label :for="value" class="text-gray-700">{{ label }}</label>
            </div>
          </div>
        </div>

        <!-- Age Range Section -->
        <div>
          <h3 class="text-gray-800 font-medium mb-2">พื้นที่</h3>
          <div class="space-y-3">
            <div class="flex items-center" v-for="(label, value) in ageRanges" :key="value">
              <Checkbox 
                v-model="selectedAgeRanges" 
                :inputId="value" 
                :value="value" 
                class="mr-3"
              />
              <label :for="value" class="text-gray-700">{{ label }}</label>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
          <Button 
            label="ขั้นต่อไป" 
            class="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-medium"
            @click="handleSubmit"
          />
        </div>
      </div>
    </van-floating-panel>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'

// ค่า anchor และ panel height
const anchors = [
  0,
  Math.round(window.innerHeight * 0.95),
]
const height = ref(anchors[1]) // เริ่มต้นไม่แสดง

// ค่าที่เลือก
const selectedBusinessTypes = ref(['market'])
const selectedAgeRanges = ref(['0-19'])

const businessTypes = {
  market: 'ตลาดนัด ตลาดสดชุมชน ถนนคนเดิน',
  floating: 'ตะลิง',
  mall: 'ผู้เช่า ม.ตต สำ',
  department: 'แผง',
  shop: 'ม่วนน้ำร้อน น้ำพุร้อน'
}

const ageRanges = {
  '0-19': '0 - 19 กม.',
  '20-39': '20 - 39 กม.',
  '40-59': '40 - 59 กม.',
  '60+': '60 กม. ขึ้นไป'
}

const handleSubmit = () => {
  console.log('Selected business types:', selectedBusinessTypes.value)
  console.log('Selected age ranges:', selectedAgeRanges.value)
  height.value = 0 // ปิด panel
}
</script>

<style scoped>

</style>
