<script setup>
// CustomDatePicker.vue
import { computed } from 'vue'
import DatePicker from 'primevue/datepicker'

// รับ modelValue แบบ defineModel (Nuxt 3, Vue 3.4+)
const modelValue = defineModel({ type: String, default: '' })

// computed (two-way sync) แปลง modelValue(string) <-> Date
const dateValue = computed({
  get() {
    return modelValue.value ? new Date(modelValue.value) : null
  },
  set(date) {
    if (!date) {
      modelValue.value = ''
      return
    }
    // format date to yyyy-MM-dd
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    modelValue.value = `${yyyy}-${mm}-${dd}`
  }
})
</script>

<template>
  <DatePicker
    v-model="dateValue"
    :dateFormat="'yy-mm-dd'"
    :inputClass="'custom-border'"

    placeholder="ปี-เดือน-วัน"
    showIcon
  />
</template>
