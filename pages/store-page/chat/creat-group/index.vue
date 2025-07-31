<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Header -->
    <LayoutsBaseHeader title="สร้างกลุ่ม" :showBack="false">
      <template #right>
        <button class="text-white text-xl">
          <i class="pi pi-times" />
        </button>
      </template>
    </LayoutsBaseHeader>

    <!-- Form -->
    <Form @submit="handleCreateGroup" class="flex-1 px-4 pt-4">
      <!-- Group Name Input -->
      <div class="mb-4">
        <label for="groupName" class="block text-sm font-medium text-gray-700 mb-1">ชื่อกลุ่ม</label>
        <IconField>
          <InputText
            id="groupName"
            v-model="groupName"
            class="w-full pr-10"
            placeholder="ระบุชื่อกลุ่ม"
            :class="{ 'p-invalid': errors.groupName }"
          />
          <InputIcon class="pi pi-plus-circle" />
        </IconField>
        <small class="text-red-500" v-if="errors.groupName">{{ errors.groupName }}</small>
      </div>

      <!-- First Message -->
      <div class="mb-6">
        <label for="firstMessage" class="block text-sm font-medium text-gray-700 mb-1">ข้อความแรก</label>
        <Textarea
          id="firstMessage"
          v-model="firstMessage"
          rows="4"
          autoResize
          class="w-full"
          placeholder="ระบุข้อความแจ้งเตือนหรือประกาศแรกของกลุ่ม"
          :class="{ 'p-invalid': errors.firstMessage }"
        />
        <small class="text-red-500" v-if="errors.firstMessage">{{ errors.firstMessage }}</small>
      </div>

      <!-- Send Button -->
      <div class="px-0 pb-6">
        <Button label="ส่งข้อความ" severity="primary" type="submit" rounded class="w-full" />
      </div>
    </Form>

    <!-- Floating Panel -->
    <van-floating-panel v-model:height="height" :anchors="anchors" :content-draggable="false">
      <div class="p-4 space-y-6 max-h-[75vh] overflow-y-auto">
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
              <Checkbox v-model="selectedBusinessTypes" :inputId="value" :value="value" class="mr-3" />
              <label :for="value" class="text-gray-700">{{ label }}</label>
            </div>
          </div>
        </div>

        <!-- Age Range Section -->
        <div>
          <h3 class="text-gray-800 font-medium mb-2">พื้นที่</h3>
          <div class="space-y-3">
            <div class="flex items-center" v-for="(label, value) in ageRanges" :key="value">
              <Checkbox v-model="selectedAgeRanges" :inputId="value" :value="value" class="mr-3" />
              <label :for="value" class="text-gray-700">{{ label }}</label>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <div class="pt-4">
          <Button 
            label="ขั้นต่อไป" 
            class="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-medium"
            @click="height = 0"
          />
        </div>
      </div>
    </van-floating-panel>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import { Form, useForm, useField } from 'vee-validate'
import * as yup from 'yup'

// VeeValidate Schema
const schema = yup.object({
  groupName: yup.string().required('กรุณาระบุชื่อกลุ่ม'),
  firstMessage: yup.string().required('กรุณาระบุข้อความแรก')
})

const { handleSubmit, errors } = useForm({ validationSchema: schema })
const { value: groupName } = useField('groupName')
const { value: firstMessage } = useField('firstMessage')

// Floating Panel
const anchors = [0, Math.round(window.innerHeight * 0.95)]
const height = ref(0) // ปิด panel เริ่มต้น

// Checkbox Data
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

// Form Submit
const handleCreateGroup = handleSubmit(values => {
  console.log('สร้างกลุ่ม:', values)
  height.value = anchors[1] // เปิด Floating Panel หลัง validate ผ่าน
})
</script>

<style scoped>
</style>
