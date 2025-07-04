<script setup>
import { useEncryptedCookie, useDecryptedCookie,useClearEncryptedCookie } from '~/composables/useEncryptedCookie'

const name = ref('')
const email = ref('')
const decrypted = ref(null)

const save = async () => {
  await useEncryptedCookie('secure-user', name.value)
  decrypted.value = await useDecryptedCookie('secure-user')
}

onMounted(async () => {
  decrypted.value = await useDecryptedCookie('secure-user')
})

const clear = () => {
  useClearEncryptedCookie('secure-user')
}
</script>

<template>
  <div>
    <input v-model="name" placeholder="ชื่อ" />
    <input v-model="email" placeholder="อีเมล" />
    <button @click="save">บันทึก</button>
    <button @click="clear">ลบ</button>
    
    <pre>{{ decrypted }}</pre>
  </div>
</template>
