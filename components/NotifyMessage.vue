<template>
  <van-notify
    v-model:show="internalShow"
    :type="type"
    :color="textColor"
    :background="bgColor"
    position="top"
  >
    <div class="flex justify-between items-center w-full">
      <div>
        <div v-if="title" class="font-bold text-base text-left">{{ title }}</div>
        <div class="text-sm">{{ message }}</div>
      </div>
      <van-icon
        v-if="props.life === null"
        name="cross"
        class="ml-2 cursor-pointer"
        @click="closeNotify"
      />
    </div>
  </van-notify>
</template>

<script setup>
import { computed, watch, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  type: { type: String, default: 'primary' }, // primary, success, danger, warning
  life: { type: Number, default: null }, // null = แสดงค้างไว้
  title: { type: String, default: '' },
  message: { type: String, required: false },
})

const emit = defineEmits(['update:show'])

const bgColor = computed(() => ({
  primary: '#202c54',
  success: '#07c160',
  danger: '#ee0a24',
  warning: '#fc9003',
}[props.type] ?? '#202c54'))

const textColor = '#fff'

const internalShow = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val),
})

let timer = null
let isUnmounted = false

watch([() => props.show, () => props.life], async ([val, life]) => {
  clearTimeout(timer)

  if (val && typeof life === 'number' && life > 0) {
    await nextTick()
    timer = setTimeout(() => {
      if (!isUnmounted) emit('update:show', false)
    }, life)
  }
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  isUnmounted = true
})

const closeNotify = () => {
  emit('update:show', false)
}
</script>

<style scoped>
.van-notify {
  padding: 12px 16px;
}
</style>
