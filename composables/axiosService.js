// /composables/axiosService.js
import axios from 'axios'

// ป้องกันเรียก useRuntimeConfig ตอน import โมดูล
let _axiosConfigured = false
const ensureAxiosConfigured = () => {
  if (_axiosConfigured) return
  const config = useRuntimeConfig()
  axios.defaults.baseURL = config.public.api_url
  _axiosConfigured = true
}

// --- refresh guard กันยิงซ้ำพร้อมกัน ---
let _refreshingPromise = null
const refreshTokenOnce = async () => {
  if (_refreshingPromise) return _refreshingPromise

  _refreshingPromise = (async () => {
    try {
      const user_id = (await useDecryptedCookie('user_id')) || ''
      const refresh_token = (await useDecryptedCookie('refresh_token')) || ''

      if (!user_id || !refresh_token) throw new Error('NO_REFRESH_CREDS')

      // ยิง refresh โดยตรง (ไม่ใช้ request() กันวนลูป)
      const resp = await axios.post('/api/auth/refresh', {
        user_id,
        refresh_token,
      })

      const data = resp?.data || {}

      // อัปเดต cookie ตาม respond
      if (data?.access_token) {
        await useEncryptedCookie('token', data.access_token)
      }
      if (data?.refresh_token) {
        await useEncryptedCookie('refresh_token', data.refresh_token)
      }
      if (data?.user_id) {
        await useEncryptedCookie('user_id', data.user_id)
      }

      return data
    } finally {
      // ปลดล็อกรอบถัดไป
      _refreshingPromise = null
    }
  })()

  return _refreshingPromise
}

// ========== คง logic เดิมทุกอย่าง ==========
export const getToken = async () => {
  return (await useDecryptedCookie('token')) || ''
}

export async function request(method, url, data, auth = true) {
  ensureAxiosConfigured()

  const headers = {}
  const isloadingAxi = useState('isloadingAxi', () => true)
  isloadingAxi.value = true

  try {
    if (auth) {
      const token = await getToken()
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await axios({ method, url, data, headers })
    isloadingAxi.value = false
    return response
  } catch (error) {
    // ---------- เริ่มส่วนจัดการ error ----------
    // ถ้า 401: ลอง refresh แล้ว retry 1 ครั้ง
    if (error?.response?.status === 401 && auth) {
        // return;
      try {
        const refreshed = await refreshTokenOnce()

        // ได้ token ใหม่แล้ว -> ใส่ header แล้ว retry ทันที
        if (refreshed?.access_token) {
          headers['Authorization'] = `Bearer ${refreshed.access_token}`
          const retryResp = await axios({ method, url, data, headers })
          isloadingAxi.value = false
          return retryResp
        }

        // ถ้าไม่มี access_token ใหม่ ถือว่า refresh ไม่สำเร็จ -> ล้าง token
        useClearEncryptedCookie('token')
      } catch (e) {
        // refresh fail -> ล้าง token
        useClearEncryptedCookie('token')
      }
    }

    isloadingAxi.value = false
    console.error('request catch (error)', error)

    if (error.response?.status === 401) {
      console.warn('Token ไม่ถูกต้อง | หมดอายุ | ไม่มี Token')
      useClearEncryptedCookie('token') // 🔐 ลบ token จาก cookie
      // await navigateTo("/auth/login");
    } else if (error.response?.status === 403) {
      // await navigateTo("/auth/login");
      // await navigateTo("/Unauthorized");
    } else if (error.response?.status === 422) {
      console.log('Validation Error')
    } else if (error.response?.status === 500) {
      console.error('Server Error', error.response)
    }

    throw error
  }
}
