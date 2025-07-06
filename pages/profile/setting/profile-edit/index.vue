<script setup>
import { ref } from 'vue'
import { useForm, useField, Form } from 'vee-validate'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const toast = ref({
    show: false,
    type: null,
    title: null,
    message: null,
    life: null, // ถ้าใส่เลข = แสดง auto close
})

// avatar
const previewImage = ref('/avartar-default.png')
const fileInput = ref(null)
const isloadingAxi = useState('isloadingAxi')

const router = useRouter()

// ✅ validation schema
const schema = yup.object({
    username: yup.string().required(t('กรุณากรอกชื่อบัญชี')),
    phone: yup.string().required(t('กรุณากรอกเบอร์โทร')).matches(/^0\d{9}$/, t('เบอร์โทรไม่ถูกต้อง')),
    email: yup.string().required(t('กรุณากรอกอีเมล')).email(t('อีเมลไม่ถูกต้อง')),
    gender: yup.string().required(t('กรุณากรอกเพศ')),
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
        if (file.size > 2 * 1024 * 1024) {
            // แจ้งเตือน
            toast.value = {
                show: true,
                type: 'warning',
                title: 'แจ้งเตือน',
                message: 'ไม่สามารถอัปโหลดไฟล์ที่มีขนาดเกิน 2MB ได้',
                life: null
            }
            event.target.value = null // reset file input
            return
        }
        previewImage.value = URL.createObjectURL(file)
    }
}

// ✅ on submit
const onSubmit = handleSubmit((values) => {
    console.log('submitted values:', values)
})
</script>

<template>
    <NotifyMessage v-model:show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
        :life="toast.life" />
    <Form @submit="onSubmit">
        <div class="min-h-screen bg-gray-100 pb-24">
            <!-- Top Nav -->
            <LayoutsBaseHeader :title="t('แก้ไขข้อมูลส่วนตัว')" :showIcon="false" :showBack="true" :close="false"
                :showMenu="false"></LayoutsBaseHeader>

            <!-- Avatar Upload -->
            <div class="flex justify-center mt-6 relative">
                <label for="avatarUpload" class="relative cursor-pointer">
                    <img :src="previewImage" class="w-24 h-24 rounded-full border-4 border-white shadow" />
                    <div class="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">
                        <i class="pi pi-camera text-gray-700 text-sm"></i>
                    </div>
                    <input id="avatarUpload" type="file" accept="image/*" class="hidden" @change="onUploadImage"
                        ref="fileInput" />
                </label>
            </div>

            <!-- Form Fields -->
            <div class="bg-white rounded-xl shadow-sm p-6 mx-4 mt-6 space-y-4">
                <!-- Username -->
                <div>
                    <label class="text-sm text-gray-500">{{ t('ชื่อบัญชี') }}</label>
                    <InputText v-model="username" class="w-full  custom-border" />
                    <small class="text-red-500 text-xs">{{ usernameError }}</small>
                </div>

                <!-- Phone -->
                <div>
                    <label class="text-sm text-gray-500">{{ t('เบอร์โทรศัพท์') }}</label>
                    <InputText v-model="phone" class="w-full  custom-border" />
                    <small class="text-red-500 text-xs">{{ phoneError }}</small>
                </div>

                <!-- Email -->
                <div>
                    <label class="text-sm text-gray-500">{{ t('อีเมล') }}</label>
                    <InputText v-model="email" class="w-full custom-border" />
                    <small class="text-red-500 text-xs">{{ emailError }}</small>
                </div>

                <!-- Gender -->
                <div>
                    <label class="text-sm text-gray-500">{{ t('เพศ') }}</label>
                    <InputText v-model="gender" class="w-full custom-border" />
                    <small class="text-red-500 text-xs">{{ genderError }}</small>
                </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-center mt-4 px-4">
                <Button :loading="isloadingAxi" :label="t('ลงทะเบียน')" type="submit" severity="primary" rounded
                    class="w-full max-w-md" :pt="{ root: { class: '!border-primary-main' } }" />
            </div>
        </div>
    </Form>
</template>
