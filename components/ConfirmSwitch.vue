<template>
  <div>
    <van-switch
      :model-value="internalValue"
      @click="handleToggle"
      :size="size"
      :active-color="activeColor"
      :inactive-color="inactiveColor"
    />

<van-dialog
  v-model:show="showConfirm"
  title="ยืนยัน"
  :message="confirmMessage"
  show-cancel-button
  confirm-button-color="#202c54"
  class="formal-dialog"
  @confirm="confirmChange"
  @cancel="cancelChange"
/>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import { Dialog } from 'vant'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  messageOn: {
    type: String,
    default: 'คุณต้องการเปิดใช้งาน?'
  },
  messageOff: {
    type: String,
    default: 'คุณต้องการปิดการใช้งาน?'
  },
  size: {
    type: [String, Number],
    default: 24
  },
  activeColor: {
    type: String,
    default: '#20bc04'
  },
  inactiveColor: {
    type: String,
    default: '#dcdfe6'
  }
})

const emits = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)
const showConfirm = ref(false)
const pendingValue = ref(null)
const confirmMessage = ref('')

watch(() => props.modelValue, val => {
  internalValue.value = val
})

const handleToggle = () => {
  pendingValue.value = !internalValue.value
  confirmMessage.value = pendingValue.value ? props.messageOn : props.messageOff
  showConfirm.value = true
}

const confirmChange = () => {
  internalValue.value = pendingValue.value
  emits('update:modelValue', internalValue.value)
}

const cancelChange = () => {
  pendingValue.value = null
}
</script>

<style >
.formal-dialog .van-dialog__header {
  color: #202c54;
  font-weight: bold;
  font-size: 18px;
}

.formal-dialog .van-dialog__message {
  text-align: left;
  color: #333;
  font-size: 16px;
  line-height: 1.5;
  padding-top: 8px;
}

.formal-dialog .van-dialog__footer {
  padding-top: 16px;
}

.formal-dialog .van-button--default {
  background-color: #f2f2f2;
  color: #202c54;
  border: 1px solid #ccc;
}
</style>