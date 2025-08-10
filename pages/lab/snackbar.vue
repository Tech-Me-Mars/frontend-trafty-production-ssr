<template>
  <NotifyMessage v-model:show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
    :life="toast.life" />

  <div class="">
    <van-button type="primary" @click="triggerNotify">ทดสอบ Toast</van-button>
    <van-button type="primary" @click="triggerNotify2">ทดสอบ Toast</van-button>
    <van-button type="primary" @click="triggerNotify3">ทดสอบ Toast</van-button>
  </div>


</template>

<script setup>
import { ref } from 'vue'
import NotifyMessage from '~/components/NotifyMessage.vue'

const toast = ref({
  show: false,
  type: null,
  title: null,
  message: null,
  life: null, // ถ้าใส่เลข = แสดง auto close
})

const triggerNotify = () => {
  toast.value = {
    show: true,
    type: 'primary',
    title: 'สำเร็จ',
    message: 'ข้อมูลถูกบันทึกแล้ว',
    life: 3000
  }
}
const triggerNotify2 = () => {
  toast.value = {
    show: true,
    type: 'success',
    title: 'สำเร็จ',
    message: 'ข้อมูลถูกบันทึกแล้ว',
    life: null
  }
}

const triggerNotify3 = () => {
  toast.value = {
    show: true,
    type: 'danger',
    title: 'สำเร็จ',
    message: 'ข้อมูลถูกบันทึกแล้ว',
    life: 3000
  }
}


</script>
