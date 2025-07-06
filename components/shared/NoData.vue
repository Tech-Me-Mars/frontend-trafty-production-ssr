<template>
  <div class="text-center text-gray-500 py-8">
    <!-- Empty State Icon -->
    <div class="mb-4">
      <i :class="iconClass"></i>
    </div>

    <!-- Title Message -->
    <div class="text-lg font-medium mb-2">
      <slot>
        {{ title || t('ไม่พบข้อมูล') }}
      </slot>
    </div>

    <!-- Subtitle/Detail -->
    <div class="text-sm text-gray-400">
      <slot name="subtitle">
        {{ detail || t('ไม่มีข้อมูลที่จะแสดง') }}
      </slot>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  icon: {
    type: String,
    default: 'pi pi-inbox'
  },
  iconSize: {
    type: String,
    default: 'text-6xl'
  },
  iconColor: {
    type: String,
    default: 'text-gray-400'
  },
  title: {
    type: String,
    default: ''
  },
  detail: {
    type: String,
    default: ''
  }
})

const iconClass = computed(() => {
  return `${props.icon} ${props.iconSize} ${props.iconColor}`
})
</script>
