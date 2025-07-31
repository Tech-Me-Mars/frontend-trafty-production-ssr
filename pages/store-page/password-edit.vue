<script setup>
import { ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

// toggle loading
const isSubmitting = ref(false)

// Schema
const schema = yup.object({
  old_password: yup.string().required('กรุณากรอกรหัสเดิม'),
  new_password: yup.string()
    .required('กรุณากรอกรหัสใหม่')
    .min(8, 'ต้องมีอย่างน้อย 8 ตัว')
    .max(20)
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).+$/, 'ต้องมีทั้งตัวอักษร ตัวเลข และสัญลักษณ์'),
  confirm_password: yup.string()
    .required('กรุณายืนยันรหัสผ่านใหม่')
    .oneOf([yup.ref('new_password')], 'รหัสผ่านไม่ตรงกัน')
})

// useForm
const { handleSubmit } = useForm({ validationSchema: schema })

// Fields
const { value: old_password, errorMessage: oldError } = useField('old_password')
const { value: new_password, errorMessage: newError } = useField('new_password')
const { value: confirm_password, errorMessage: confirmError } = useField('confirm_password')

// submit
const onSubmit = handleSubmit(values => {
  isSubmitting.value = true
  console.log('✅ ส่งข้อมูล:', values)
  setTimeout(() => {
    isSubmitting.value = false
    alert('บันทึกรหัสผ่านใหม่เรียบร้อย')
  }, 1000)
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="min-h-screen bg-gray-100 pb-24">
      <van-nav-bar title="แก้ไขรหัสผ่าน" left-arrow @click-left="$router.back()" />

      <div class="bg-white rounded-xl shadow-sm p-6 mx-4 mt-6 space-y-6">
        <h2 class="text-lg font-bold text-gray-800">รหัสผ่าน</h2>
        <p class="text-sm text-gray-600 leading-5">
          รหัสผ่านต้องมีความยาว 8–20 ตัวอักษร<br />
          ประกอบด้วยตัวอักษร ตัวเลข และสัญลักษณ์
        </p>

        <!-- OLD PASSWORD -->
        <div>
          <FloatLabel>
            <Password
              v-model="old_password"
              inputId="old_password"
              class="!w-full"
              inputClass="custom-border w-full"
              toggleMask
              :feedback="false"
            />
            <label for="old_password" class="label-input">รหัสเดิม</label>
          </FloatLabel>
          <small class="text-red-500 text-xs">{{ oldError }}</small>
        </div>

        <!-- NEW PASSWORD -->
        <div>
          <FloatLabel>
            <Password
              v-model="new_password"
              inputId="new_password"
              class="!w-full"
              inputClass="custom-border w-full"
              toggleMask
              :feedback="false"
            />
            <label for="new_password" class="label-input">รหัสผ่านใหม่</label>
          </FloatLabel>
          <small class="text-red-500 text-xs">{{ newError }}</small>
        </div>

        <!-- CONFIRM PASSWORD -->
        <div>
          <FloatLabel>
            <Password
              v-model="confirm_password"
              inputId="confirm_password"
              class="!w-full"
              inputClass="custom-border w-full"
              toggleMask
              :feedback="false"
            />
            <label for="confirm_password" class="label-input">ยืนยันรหัสผ่านใหม่</label>
          </FloatLabel>
          <small class="text-red-500 text-xs">{{ confirmError }}</small>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="fixed bottom-4 inset-x-4 px-4">
        <Button
          label="บันทึก"
          :loading="isSubmitting"
          class="w-full bg-indigo-800 text-white rounded-full py-3"
          type="submit"
        />
      </div>
    </div>
  </form>
</template>
