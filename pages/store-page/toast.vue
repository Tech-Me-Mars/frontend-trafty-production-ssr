<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">ตัวอย่างการใช้งาน NotificationPopup</h2>
    <i class="fa-regular fa-file"></i>
    <!-- Test Buttons -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <van-button type="success" @click="showSuccess" class="w-full">
        แสดง Success (Auto Close)
      </van-button>

      <van-button type="warning" @click="showWarning" class="w-full">
        แสดง Warning (Manual Close)
      </van-button>

      <van-button type="danger" @click="showError" class="w-full">
        แสดง Error (No Redirect)
      </van-button>

      <div class="p-4">
        <button @click="startLoading" class="bg-blue-600 text-white px-4 py-2 rounded-lg">
          แสดง Vant Loading
        </button>

      </div>
    </div>
    <Button @click="loadApi()">ทดสอบยิง APi </Button>
    <!-- Axios Example -->
    <div class="bg-gray-100 p-4 rounded-lg">
      <h3 class="font-semibold mb-2">ตัวอย่างการใช้กับ Axios:</h3>
      <van-button type="primary" @click="simulateApiCall" :loading="loading" class="mb-4">
        {{ loading ? 'กำลังเรียก API...' : 'เรียก API (จำลอง)' }}
      </van-button>
    </div>

    <!-- Notification Popup Component -->
    <NotificationPopup v-model:visible="notification.visible" :state="notification.state" :title="notification.title"
      :detail="notification.detail" :timeout="notification.timeout" :redirect-url="notification.redirectUrl"
      :auto-close="notification.autoClose" @close="onNotificationClose" />
  </div>


  <VantBlockLoading :modelValue="loading" />
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
//   import NotificationPopup from './NotificationPopup.vue'

// Reactive data
const loading = ref(false)
const startLoading = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 3000)
}

const notification = reactive({
  visible: false,
  state: 'success',
  title: '',
  detail: '',
  timeout: 0,
  redirectUrl: null,
  autoClose: true
})

// Methods
const showNotification = (config) => {
  Object.assign(notification, {
    visible: true,
    ...config
  })
}

const loadApi = () => {
  // Simulate API call
try {
  axios.get('http://localhost:5000/test-203')
  .then(res => {
    console.log('✅ Status:', res.status)
    console.log('📦 Data:', res.data)
  })
  .catch(err => {
    console.error('❌ Error:', err.message)
  })
} catch (error) {
  console.error('❌ Error:', error.message)
}
}


const showSuccess = () => {
  showNotification({
    state: 'success',
    title: 'บันทึกข้อมูลสำเร็จ',
    detail: 'ข้อมูลของคุณได้ถูกบันทึกเรียบร้อยแล้ว',
    timeout: 1500,
    redirectUrl: null,
    autoClose: true
  })
}

const showWarning = () => {
  showNotification({
    state: 'warning',
    title: 'คำเตือน',
    detail: 'กรุณาตรวจสอบข้อมูลให้ครบถ้วนก่อนดำเนินการต่อ กดปุ่มตกลงเพื่อปิด',
    timeout: 0,
    redirectUrl: null,
    autoClose: false // ไม่นับถอยหลัง ต้องกดปุ่มปิด
  })
}

const showError = () => {
  showNotification({
    state: 'error',
    title: 'เกิดข้อผิดพลาด',
    detail: 'ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง',
    timeout: 2500,
    redirectUrl: null, // ไม่ redirect
    autoClose: true
  })
}

const simulateApiCall = async () => {
  loading.value = true

  try {
    // จำลองการเรียก API
    await new Promise(resolve => setTimeout(resolve, 2000))

    // จำลองความสำเร็จหรือล้มเหลวแบบสุ่ม
    if (Math.random() > 0.5) {
      // Success
      showNotification({
        state: 'success',
        title: 'API เรียกสำเร็จ',
        detail: 'ดึงข้อมูลจากเซิร์ฟเวอร์เรียบร้อยแล้ว',
        timeout: 3000,
        redirectUrl: '/results',
        autoClose: true
      })
    } else {
      // Error
      throw new Error('API Error')
    }
  } catch (error) {
    // Error handling
    showNotification({
      state: 'error',
      title: 'API ล้มเหลว',
      detail: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
      timeout: 4000,
      redirectUrl: null, // ไม่ redirect
      autoClose: true
    })
  } finally {
    loading.value = false
  }
}

const onNotificationClose = () => {
  console.log('Notification closed')
}


</script>

<style scoped>
/* Custom styles if needed */
</style>