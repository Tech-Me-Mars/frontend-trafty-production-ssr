<script setup>
import { ref } from 'vue'
import { useForm, useField, Form } from 'vee-validate'
import * as yup from 'yup'

// avatar
const previewImage = ref('/avartar-default.png')
const fileInput = ref(null)
const isloadingAxi = useState('isloadingAxi')

const router = useRouter()

// ✅ validation schema
const schema = yup.object({
  username: yup.string().required('กรุณากรอกชื่อบัญชี'),
  phone: yup.string().required('กรุณากรอกเบอร์โทร').matches(/^0\d{9}$/, 'เบอร์โทรไม่ถูกต้อง'),
  email: yup.string().required('กรุณากรอกอีเมล').email('อีเมลไม่ถูกต้อง'),
  gender: yup.string().required('กรุณากรอกเพศ'),
})

// ✅ initialize form
const { handleSubmit } = useForm({ validationSchema: schema })

// ✅ fields
const { value: username, errorMessage: usernameError } = useField('username', undefined, { initialValue: '' })
const { value: phone, errorMessage: phoneError } = useField('phone', undefined, { initialValue: '' })
const { value: email, errorMessage: emailError } = useField('email', undefined, { initialValue: '' })
const { value: gender, errorMessage: genderError } = useField('gender', undefined, { initialValue: '' })

// ✅ avatar upload
const onUploadImage = (event) => {
  const file = event.target.files[0]
  if (file) {
    previewImage.value = URL.createObjectURL(file)
  }
}

// ✅ on submit
const onSubmit = handleSubmit((values) => {
  console.log('submitted values:', values)
})
</script>

<style scoped>
.van-nav-bar {
  --van-nav-bar-background: #1c2b75;
  --van-nav-bar-text-color: white;
  --van-nav-bar-title-text-color: white;
}
</style>

<template>
  <Form @submit="onSubmit">
    <div class="min-h-screen bg-gray-100 pb-24">
      <!-- Top Nav -->
      <van-nav-bar title="แก้ไขข้อมูลส่วนตัว" left-arrow @click-left="router.back()" />

      <!-- Avatar Upload -->
      <div class="flex justify-center mt-6 relative">
        <label for="avatarUpload" class="relative cursor-pointer">
          <img :src="previewImage" class="w-24 h-24 rounded-full border-4 border-white shadow" />
          <div class="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">
            <i class="pi pi-camera text-gray-700 text-sm"></i>
          </div>
          <input id="avatarUpload" type="file" accept="image/*" class="hidden" @change="onUploadImage" ref="fileInput" />
        </label>
      </div>

      <!-- Form Fields -->
      <div class="bg-white rounded-xl shadow-sm p-6 mx-4 mt-6 space-y-4">
        <!-- Username -->
        <div>
          <label class="text-sm text-gray-500">ชื่อบัญชี</label>
          <InputText v-model="username" class="w-full  custom-border" />
          <small class="text-red-500 text-xs">{{ usernameError }}</small>
        </div>

        <!-- Phone -->
        <div>
          <label class="text-sm text-gray-500">เบอร์โทรศัพท์</label>
          <InputText v-model="phone" class="w-full  custom-border" />
          <small class="text-red-500 text-xs">{{ phoneError }}</small>
        </div>

        <!-- Email -->
        <div>
          <label class="text-sm text-gray-500">อีเมล</label>
          <InputText v-model="email" class="w-full custom-border" />
          <small class="text-red-500 text-xs">{{ emailError }}</small>
        </div>

        <!-- Gender -->
        <div>
          <label class="text-sm text-gray-500">เพศ</label>
          <InputText v-model="gender" class="w-full custom-border" />
          <small class="text-red-500 text-xs">{{ genderError }}</small>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center mt-4 px-4">
                        <Button :loading="isloadingAxi" label="ลงทะเบียน" type="submit" severity="primary" rounded
                            class="w-full max-w-md" :pt="{ root: { class: '!border-primary-main' } }" />
                    </div>
    </div>
  </Form>
</template>
