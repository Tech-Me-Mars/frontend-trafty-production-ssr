<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const menuItems = [
  {
    label: 'ตั้งค่าโปรไฟล์',
    icon: 'pi pi-cog',
    to: '/profile/settings'
  },
  {
    label: 'รายการโปรด',
    icon: 'pi pi-heart',
    to: '/favorites'
  },
  {
    label: 'เกี่ยวกับเรา',
    icon: 'pi pi-info-circle',
    to: '/about'
  },
  {
    label: 'ข้อกำหนดและเงื่อนไขความเป็นส่วนตัว',
    icon: 'pi pi-file',
    to: '/terms'
  },
  {
    label: 'ภาษา',
    icon: 'pi pi-language',
    to: '/language'
  }
]

const goTo = (path) => {
  router.push(path)
}
</script>
<style >
.van-nav-bar {
  --van-nav-bar-background: #1c2b75;
  --van-nav-bar-text-color: white;
  --van-nav-bar-title-text-color: white;
}
</style>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Top Bar -->
    <!-- <div class="bg-[#0a1e6e] text-white px-4 py-3 flex items-center justify-between relative">
      <div class="flex items-center gap-2">
        <img src="/avartar-default.png" alt="logo" class="w-8 h-8" />
        <span class="text-white font-semibold text-base">Smart Travel Safety</span>
      </div>
      <button @click="$router.back()">
        <i class="pi pi-times text-lg text-white" />
      </button>
    </div> -->
    <van-nav-bar
      title=""
      right-text=""
      :border="false"
    >
      <template #title>
        <div class="flex items-center gap-2">
          <img src="/image/logo_erp.png" alt="logo" class="w-6 h-6" />
          <span class="text-white font-semibold text-sm">Smart Travel Safety</span>
        </div>
      </template>
      <template #right>
        <button @click="$router.back()">
          <i class="pi pi-times text-white text-xl" />
        </button>
      </template>
    </van-nav-bar>

    <!-- Profile Section -->
    <div class="bg-white py-4 px-6 flex items-center gap-4 border-b">
      <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl">
        <i class="pi pi-user" />
      </div>
      <div>
        <div class="font-semibold text-gray-800">maya</div>
        <div class="text-sm text-gray-500">yourname@gmail.com</div>
      </div>
    </div>

    <!-- Menu List -->
    <ul class="bg-white divide-y divide-gray-100">
      <li
        v-for="item in menuItems"
        :key="item.label"
        class="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition"
        @click="goTo(item.to)"
      >
        <div class="flex items-center gap-4">
          <i :class="item.icon + ' text-[20px] text-indigo-900'" />
          <span class="text-sm text-gray-800">{{ item.label }}</span>
        </div>
        <i class="pi pi-angle-right text-gray-400" />
      </li>
    </ul>
  </div>
</template>
