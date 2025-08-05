<template>
    <form @submit.prevent="handleSubmit" class="max-w-sm mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
      <div class="flex flex-col items-center gap-2">
        <div class="relative">
          <!-- Preview avatar -->
          <img
            :src="avatarPreview"
            alt="avatar"
            class="w-24 h-24 rounded-full border-2 border-zinc-200 object-cover"
          />
          <button
            v-if="avatarPreview !== defaultAvatar"
            type="button"
            class="absolute top-1 right-1 p-1 bg-white rounded-full shadow text-red-500 hover:bg-red-100"
            @click="resetAvatar"
            title="ลบรูป"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>
        <label class="block">
          <input id="upload1" type="file" accept="image/*" class="" @change="onFileChange" />
          <!-- <Button
            for="upload1"            label="เปลี่ยนรูป"
            icon="pi pi-image"
            class="mt-2 border border-blue-500 text-blue-600 !rounded-full bg-white hover:bg-blue-50"
            type="button"
          /> -->
        </label>
      </div>
      <div class="text-center">
        <Button type="submit" label="บันทึก" class="px-5 py-2 bg-blue-600 text-white rounded" />
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import Button from 'primevue/button'
  import 'primeicons/primeicons.css'
  
  // สมมุติ default/avatar ปัจจุบัน
  const defaultAvatar = '/avatar-default.png' // รูป default (ควรเตรียมไฟล์ไว้)
  const avatarUrl = ref('https://randomuser.me/api/portraits/men/32.jpg') // url จาก backend
  
  const avatarFile = ref(null) // เก็บไฟล์ใหม่ที่ user เลือก
  const avatarPreview = computed(() =>
    avatarFile.value
      ? URL.createObjectURL(avatarFile.value)
      : avatarUrl.value || defaultAvatar
  )
  
  function onFileChange(e) {
    const file = e.target.files[0]
    if (file) avatarFile.value = file
  }
  
  function resetAvatar() {
    avatarFile.value = null
    avatarUrl.value = defaultAvatar // reset กลับ
  }
  
  // ส่งไป backend
  async function handleSubmit() {
    const formData = new FormData()
    if (avatarFile.value) {
      formData.append('avatar', avatarFile.value)
    }
    // ...append field อื่นๆ (เช่น user_id)
    // ตัวอย่างส่งไป /api/user/profile
    await api.put('/api/user/profile', formData)
    alert('อัปเดตรูปเรียบร้อย!')
  }
  </script>
  