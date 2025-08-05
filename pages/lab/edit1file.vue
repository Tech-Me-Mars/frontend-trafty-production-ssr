<script setup>
import { ref, onMounted } from 'vue'
const form = ref({
  name: '',
  address: '',
  document_url: '', // เก็บ url ไฟล์เดิม
  document_file: null // ใช้เก็บไฟล์ใหม่ (ถ้ามี)
})

const loadBusiness = async () => {
  const res = await api.get('/business/1')
  form.value = {
    ...res.data,
    document_file: null // set ไว้ให้ว่าง
  }
}
onMounted(loadBusiness)

const handleFileChange = (e) => {
  form.value.document_file = e.target.files[0]
}

const handleSubmit = async () => {
  const payload = new FormData()
  payload.append('name', form.value.name)
  payload.append('address', form.value.address)
  if (form.value.document_file) {
    payload.append('document', form.value.document_file) // ถ้ามีไฟล์ใหม่
  } else {
    payload.append('document_url', form.value.document_url) // ส่ง url เดิม
  }
  await api.put('/business/1', payload)
}
</script>

<template>
    <form @submit.prevent="handleSubmit">
      <input v-model="form.name" placeholder="ชื่อธุรกิจ" />
      <input v-model="form.address" placeholder="ที่อยู่" />
      <!-- File preview + upload -->
      <div v-if="form.document_url">
        <a :href="form.document_url" target="_blank">ดูไฟล์เดิม</a>
      </div>
      <input type="file" @change="handleFileChange" />
      <button type="submit">บันทึก</button>
    </form>
  </template>