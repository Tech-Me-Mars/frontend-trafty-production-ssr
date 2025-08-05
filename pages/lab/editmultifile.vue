<script setup>
import { ref, onMounted } from 'vue'
const form = ref({
  name: '',
  document_urls: [],      // array ของ url
  document_files: []      // array ของไฟล์ใหม่ (File[])
})

const loadBusiness = async () => {
  const res = await api.get('/business/1')
  form.value = {
    ...res.data,
    document_files: []
  }
}

onMounted(loadBusiness)

const handleFilesChange = (e) => {
  // รองรับเลือกหลายไฟล์พร้อมกัน
  form.value.document_files.push(...Array.from(e.target.files))
}

const removeFileUrl = (idx) => {
  form.value.document_urls.splice(idx, 1)
}

const removeNewFile = (idx) => {
  form.value.document_files.splice(idx, 1)
}

const handleSubmit = async () => {
  const payload = new FormData()
  payload.append('name', form.value.name)
  // 1. ส่ง url ที่เหลือ (หลังลบแล้ว)
  payload.append('document_urls', JSON.stringify(form.value.document_urls))
  // 2. ส่งไฟล์ใหม่ (ถ้ามี)
  form.value.document_files.forEach(file => {
    payload.append('documents', file)
  })
  await api.put('/business/1', payload)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <input v-model="form.name" placeholder="ชื่อธุรกิจ" />

    <!-- Preview ไฟล์เดิม + ลบ -->
    <div v-if="form.document_urls.length" class="space-y-1">
      <div v-for="(url, idx) in form.document_urls" :key="url" class="flex items-center gap-2 bg-zinc-50 border p-2 rounded">
        <a :href="url" target="_blank" class="truncate flex-1">{{ url.split('/').pop() }}</a>
        <button
          type="button"
          class="text-red-500 hover:text-red-700"
          @click="removeFileUrl(idx)"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>
    </div>

    <!-- Preview ไฟล์ใหม่ที่เลือก -->
    <div v-if="form.document_files.length" class="space-y-1">
      <div v-for="(file, idx) in form.document_files" :key="file.name" class="flex items-center gap-2 bg-amber-50 border p-2 rounded">
        <span class="truncate flex-1">{{ file.name }}</span>
        <button
          type="button"
          class="text-red-500 hover:text-red-700"
          @click="removeNewFile(idx)"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>
    </div>

    <!-- อัปโหลดไฟล์ใหม่ (หลายไฟล์) -->
    <input type="file" multiple @change="handleFilesChange" />

    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">บันทึก</button>
  </form>
</template>
