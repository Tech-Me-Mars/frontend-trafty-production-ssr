<template>
  <div class="bg-primary-main text-white px-4 py-3 flex items-center justify-between h-[56px]">
    <!-- Left -->
    <div class="flex items-center gap-2 min-w-0">

      <img v-if="showIcon == true" src="/image/logo_erp.png" style="width: 50px;" alt="">
      <!-- ปุ่ม back -->

      <button-icon-back v-if="showBack" @click="handleBack" />
      <drawer-menu v-if="showMenu == true" />


      <!-- custom content -->
      <slot name="left" />

      <!-- Default title (optional) -->
      <h1 class="text-base font-semibold truncate" v-if="title">{{ title }}</h1>
    </div>

    <!-- Right -->
    <div>
      <slot name="right" />

      <span class="text-center flex justify-center px-2 py-2" v-if="close" @click="clickClose()">
        <i class="pi pi-times pr-2 cursor-pointer text-lg font-bold " />

      </span>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  title: { type: String, required: true },
  showBack: { type: Boolean, default: false }, // ใช้ $router.back()
  showIcon: { type: Boolean, default: false }, // ใช้ $router.back()
  close: { type: Boolean, default: false }, // ใช้ $router.back()
  backTo: { type: String, default: '' },       // URL ที่จะกลับไปแบบ custom
  showMenu: { type: Boolean, default: false }  // แสดง hamburger แทน back
})

const handleBack = () => {
  if (props.backTo) {
    router.push(props.backTo)
  } else {
    router.back()
  }
}

const clickClose = () => {
  if (props.backTo) {
    router.push(props.backTo)
  } else {
    router.back()
  }
}
</script>
