<script setup>
import { useRouter } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import * as zod from 'zod';
import { useI18n } from 'vue-i18n';
import { useEncryptedCookie,useClearAllEncryptedCookies } from '~/composables/useEncryptedCookie';
import * as dataApi from "./api/data.js";

onMounted(async () => {
      await useClearAllEncryptedCookies();
});
// I18n setup
const { t } = useI18n();

// Router setup
const router = useRouter();

// Form state
const isloadingAxi = useState('isloadingAxi');

// Fields for form
const { value: username, errorMessage: usernameError } = useField('username');
const { value: password, errorMessage: passwordError } = useField('password');

// Validation schema using zod
const validationSchema = zod.object({
  username: zod
    .string()
    .nonempty(t('กรุณากรอกชื่อผู้ใช้')) // แสดงข้อความ validation ถ้าชื่อผู้ใช้เป็นค่าว่าง
    .min(3, t('ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร')),
  password: zod
    .string()
    .min(6, t('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'))
    .nonempty(t('กรุณากรอกรหัสผ่าน')),
});

// Handle form submission
const onSubmit = async () => {
  try {
    // Check validation before submit
    const isValid = await validationSchema.safeParseAsync({ username: username.value, password: password.value });
    if (!isValid.success) {
      return;
    }

    // Prepare payload and call API
    const payload = {
      username: username.value,  // ใช้ username แทน email
      password: password.value,
    };
    const res = await dataApi.login(payload);
    
    // Save token and user role in encrypted cookies
    await useEncryptedCookie("token", res.data.data.access_token);
    await useEncryptedCookie("role_id", res.data.data.user?.role_id);

    // Redirect after successful login (you can change the route as needed)
    router.push('/');  // ตัวอย่างการเปลี่ยนหน้าไปที่ dashboard

  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-start bg-white">
    <div class="w-full">
      <img src="/image/bg/login-header.png" alt="login-header" class="w-full object-cover w-10 h-10"
        style="border-bottom-left-radius: 50% 10%; border-bottom-right-radius: 50% 10%; width: 100%; height: 11rem;" />
    </div>
    <div class="z-10 w-full max-w-md px-4">
      <div class="bg-white rounded-lg p-1">

        <!-- Language Select -->
        <div class="flex justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900 mb-4">เข้าสู่ระบบ</h2>
          <Dropdown v-model="locale" :options="['ไทย', 'EN']" class="w-32" />
        </div>

        <div class="mb-4">
          <IconField>
            <InputIcon class="pi pi-user" /> <!-- ใช้ icon สำหรับ username -->
            <InputText v-model="username" class="w-full" placeholder="กรุณากรอกชื่อผู้ใช้" />
          </IconField>
          <!-- Error message for username -->
          <p v-if="usernameError" class="text-red-500 text-sm">{{ usernameError }}</p>
        </div>

        <!-- Password -->
        <div class="mb-4">
          <IconField>
            <InputIcon class="pi pi-lock" />
            <InputText type="password" v-model="password" class="w-full" placeholder="กรุณากรอกรหัสผ่าน" />
          </IconField>
          <!-- Error message for password -->
          <p v-if="passwordError" class="text-red-500 text-sm">{{ passwordError }}</p>
        </div>

        <!-- Links -->
        <div class="flex justify-between text-sm mb-4 text-primary">
          <NuxtLink to="/register" class="hover:underline">สมัครสมาชิก</NuxtLink>
          <NuxtLink to="/forgot-password" class="hover:underline">ลืมรหัสผ่าน?</NuxtLink>
        </div>

        <!-- Login Button -->
        <Button label="เข้าสู่ระบบ" class="w-full bg-indigo-800 hover:bg-indigo-900 text-white" @click="onSubmit" />

        <!-- Or Divider -->
        <div class="flex items-center my-6">
          <div class="flex-grow h-px bg-gray-300"></div>
          <span class="px-3 text-sm text-gray-500">or login with</span>
          <div class="flex-grow h-px bg-gray-300"></div>
        </div>

        <!-- Google Button -->
        <Button class="w-full border border-gray-300 text-gray-700 flex items-center justify-center gap-2" outlined>
          <img src="/image/social-button/google.png" alt="Google" class="w-5 h-5" />
          Continue with Google
        </Button>

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
