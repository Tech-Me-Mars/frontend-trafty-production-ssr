<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'
import { useI18n } from 'vue-i18n'
import { useEncryptedCookie, useClearAllEncryptedCookies } from '~/composables/useEncryptedCookie'
import * as dataApi from './api/data.js'

onMounted(async () => {
  await useClearAllEncryptedCookies()
})

// i18n
const optionsLang = ref([
  { label: 'ไทย', value: 'th' },
  { label: 'EN', value: 'en' },
])
const { t, locale, setLocale } = useI18n()
const localeLang = ref(locale.value || 'th')
const onLangChange = (e) => {
  const val = e?.value ?? localeLang.value
  locale.value = val
  setLocale?.(val)
}

// Router
const router = useRouter()

// Loading (รวมกับ isSubmitting ของ vee-validate ได้)
const isloadingAxi = useState('isloadingAxi', () => false)

// === Validation schema (ใช้ zod + toTypedSchema) ===
const schema = zod.object({
  username: zod
    .string({ required_error: t('กรุณากรอกชื่อผู้ใช้') })
    .min(1, t('กรุณากรอกชื่อผู้ใช้'))
    .min(3, t('ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร')),
  password: zod
    .string({ required_error: t('กรุณากรอกรหัสผ่าน') })
    .min(1, t('กรุณากรอกรหัสผ่าน'))
    .min(4, t('รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร')),
})

// === useForm: ใช้ validationSchema และดึง errors จาก useForm ===
const { handleSubmit, errors, isSubmitting, setErrors, resetForm } = useForm({
  validationSchema: toTypedSchema(schema),
  // initialValues: { username: '', password: '' },
})

// === ฟิลด์ ===
const { value: username } = useField('username')
const { value: password } = useField('password')

// JWT parser
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

// === Submit (ใช้ handleSubmit ของ useForm จะจัดการ validate และคืน errors ให้อัตโนมัติ) ===
const onSubmit = handleSubmit(async (values) => {
  isloadingAxi.value = true
  try {
    // Login
    const res = await dataApi.login({
      username: values.username,
      password: values.password,
    })

    const rawToken = res?.data?.access_token
    if (!rawToken) throw new Error('NO_TOKEN')

    // Save token (encrypted cookie)
    await useEncryptedCookie('token', rawToken)

    // Decode & save role info
    const decoded = parseJwt(rawToken)
    if (decoded) {
      await useEncryptedCookie('role_id', decoded.role_id || '')
      await useEncryptedCookie('role_name', decoded.role_name || '')
    }

    // ---- เก็บ user_id / refresh_token จากผลลัพธ์ login (ถ้ามี) ----
    if (res?.data?.user_id) {
      await useEncryptedCookie('user_id', res.data.user_id)
    }
    if (res?.data?.refresh_token) {
      await useEncryptedCookie('refresh_token', res.data.refresh_token)
    }

    // ---- เรียก Refresh Token ทันที เพื่อรับโทเค็นระยะยาว ----
    try {
      const user_id = res?.data?.user_id || (await useDecryptedCookie('user_id'))
      const refresh_token = res?.data?.refresh_token || (await useDecryptedCookie('refresh_token'))

      if (user_id && refresh_token) {
        const refreshed = await dataApi.refreshToken({ user_id, refresh_token })
        const newAccess = refreshed?.data?.access_token
        const newRefresh = refreshed?.data?.refresh_token
        const newUserId = refreshed?.data?.user_id

        if (newAccess) await useEncryptedCookie('token', newAccess)
        if (newRefresh) await useEncryptedCookie('refresh_token', newRefresh)
        if (newUserId) await useEncryptedCookie('user_id', newUserId)
      } else {
        console.warn('ไม่มี user_id หรือ refresh_token จากผล login; ข้ามการ refresh ครั้งแรก')
      }
    } catch (e) {
      console.error('Refresh token หลัง login ล้มเหลว:', e)
      // ถ้าอยากบังคับให้กลับไปหน้า login เมื่อ refresh fail ให้เคลียร์ token และ redirect ที่นี่
      // await useClearAllEncryptedCookies()
      // return router.push('/auth/login')
    }

    // เข้าสู่หน้าหลัก
    router.push('/')
  } catch (err) {
    // map error ไปที่ฟิลด์ด้วย setErrors ของ useForm
    setErrors({
      username: t('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'),
      password: t('โปรดลองอีกครั้ง'),
    })
    console.error(err)
  } finally {
    isloadingAxi.value = false
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-start bg-white">
    <!-- Header image -->
    <div class="w-full">
      <img src="/image/bg/login-header.png" alt="login-header" class="w-full object-cover"
        style="border-bottom-left-radius: 50% 10%; border-bottom-right-radius: 50% 10%; width: 100%; height: 11rem;" />
    </div>

    <div class="z-10 w-full max-w-md px-4">
      <div class="bg-white rounded-lg p-1">
        <!-- Language Select -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-900">{{ t('เข้าสู่ระบบ') }}</h2>
          <Dropdown v-model="localeLang" :options="optionsLang" optionLabel="label" optionValue="value" class="w-32"
            @change="onLangChange" />
        </div>

        <!-- Form -->
        <form class="space-y-4" @submit.prevent="onSubmit" novalidate>
          <!-- Username -->
          <div>
            <IconField>
              <InputIcon class="pi pi-user" />
              <InputText v-model="username" class="w-full" :placeholder="t('กรุณากรอกชื่อผู้ใช้')"
                :class="{ 'p-invalid': !!errors.username }" aria-invalid="true" aria-describedby="username-help" />
            </IconField>
            <p v-if="errors.username" id="username-help" class="text-red-500 text-sm mt-1">
              {{ errors.username }}
            </p>
          </div>

          <!-- Password -->
          <div>
            <IconField>
              <InputIcon class="pi pi-lock" />
              <InputText type="password" v-model="password" class="w-full" :placeholder="t('กรุณากรอกรหัสผ่าน')"
                :class="{ 'p-invalid': !!errors.password }" aria-invalid="true" aria-describedby="password-help" />
            </IconField>
            <p v-if="errors.password" id="password-help" class="text-red-500 text-sm mt-1">
              {{ errors.password }}
            </p>
          </div>

          <!-- Links -->
          <div class="flex justify-between text-sm mb-2 text-primary">
            <NuxtLink to="/register" class="hover:underline">{{ t('สมัครสมาชิก') }}</NuxtLink>
            <NuxtLink to="/forgot-password" class="hover:underline">{{ t('ลืมรหัสผ่าน?') }}</NuxtLink>
          </div>

          <!-- Login Button -->
          <Button :label="t('เข้าสู่ระบบ')" class="w-full bg-indigo-800 hover:bg-indigo-900 text-white" type="submit"
            :loading="isloadingAxi || isSubmitting" :disabled="isloadingAxi || isSubmitting" />

          <!-- Divider -->
          <!-- <div class="flex items-center my-6">
            <div class="flex-grow h-px bg-gray-300"></div>
            <span class="px-3 text-sm text-gray-500">{{ t('หรือเข้าสู่ระบบด้วย') }}</span>
            <div class="flex-grow h-px bg-gray-300"></div>
          </div> -->

          <!-- Google Button -->
          <!-- <Button class="w-full border border-gray-300 text-gray-700 flex items-center justify-center gap-2" outlined type="button">
            <img src="/image/social-button/google.png" alt="Google" class="w-5 h-5" />
            {{ t('เข้าสู่ระบบด้วย Google') }}
          </Button> -->
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.van-nav-bar {
  --van-nav-bar-background: #281c74;
  --van-nav-bar-text-color: white;
  --van-nav-bar-icon-color: white;
  --van-nav-bar-title-text-color: white;
  --van-nav-bar-height: 70px;
}
</style>
