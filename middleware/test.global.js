import { useDecryptedCookie } from '~/composables/useEncryptedCookie';

// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
//   const token = await useDecryptedCookie('token') // <- เข้ารหัสไว้แล้ว

//   if (!token) {
//     return navigateTo('/auth/login')
//   }
if (process.client) {
const token = localStorage.getItem('token')

console.log('middddd',token)
    
}
})
