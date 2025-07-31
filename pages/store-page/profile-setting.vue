<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const menuItems = [
  {
    label: 'แก้ไขข้อมูลส่วนตัว',
    icon: 'pi pi-user',
    route: '/profile/edit'
  },
  {
    label: 'แก้ไขรหัสผ่าน',
    icon: 'pi pi-lock',
    route: '/profile/change-password'
  }
]

const goTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.van-nav-bar {
  --van-nav-bar-background: #1c2b75;
  --van-nav-bar-text-color: white;
  --van-nav-bar-icon-color: white;
  --van-nav-bar-title-text-color: white;
  --van-nav-bar-height: 70px;
}
</style>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <van-nav-bar title="ตั้งค่าโปรไฟล์" left-arrow @click-left="$router.back()" />

    <!-- Menu List -->
    <ul class="bg-white divide-y divide-gray-100 mt-[1px]">
      <li
        v-for="item in menuItems"
        :key="item.label"
        @click="goTo(item.route)"
        class="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition"
      >
        <div class="flex items-center gap-4">
          <i :class="item.icon + ' text-indigo-800 text-lg w-6 text-center'" />
          <span class="text-gray-800 font-medium text-[15px]">{{ item.label }}</span>
        </div>
        <i class="pi pi-angle-right text-gray-400" />
      </li>
    </ul>
  </div>
</template>
