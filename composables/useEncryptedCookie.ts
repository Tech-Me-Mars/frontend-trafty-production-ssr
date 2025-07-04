export async function useEncryptedCookie(key: string, value: any) {
  const { data } = await useFetch('/api/encrypt', {
    method: 'POST',
    body: { data: value }
  })

  if (data.value?.encrypted) {
    useCookie(key).value = data.value.encrypted
  }
}

export async function useDecryptedCookie(key: string) {
  const cookie = useCookie<string>(key)
  if (!cookie.value) return null

  const { data } = await useFetch('/api/decrypt', {
    method: 'POST',
    body: { encrypted: cookie.value }
  })

  return data.value?.data || null
}

// ❌ ลบ cookie เฉพาะ key
export function useClearEncryptedCookie(key: string) {
  useCookie(key).value = null
}

// 🧹 ลบ cookie หลาย key พร้อมกัน
export function useClearEncryptedCookies(keys: string[]) {
  keys.forEach(key => useCookie(key).value = null)
}

// 🔥 ลบ cookie ทั้งหมดที่ระบบคุณใช้
export function useClearAllEncryptedCookies() {
  if (process.client) {
    const cookies = document.cookie.split(';')

    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.slice(0, eqPos).trim() : cookie.trim()

      // ลบ cookie ด้วยชื่อ (set max-age = 0)
      document.cookie = `${name}=; Path=/; Max-Age=0`
    }
  }
}
