// ~/composables/useImage.js

// คืน URL ที่พร้อมใช้งานทันที (เหมาะใช้ตรง ๆ ใน template)
export const useImage = (src, fallback = '/image/image404.jpg') => {
  const normalize = (v) => {
    if (typeof v !== 'string') return fallback
    const s = v.trim()
    if (!s) return fallback
    if (s.startsWith('data:')) return s                      // data URL
    if (/^https?:[^/]/i.test(s)) return s.replace(/^https?:/i, m => `${m}//`) // https:xxx -> https://xxx
    if (/^https?:\/\//i.test(s)) return s                    // http(s)
    if (s.startsWith('/')) return s                          // /public
    return `/${s}`                                           // มองเป็นไฟล์ใต้ /public
  }
  return normalize(src ?? fallback)
}

// เผื่ออยากดึง helper มาใช้ซ้ำใน <script setup>
// export const useImage = (fallback = '/image/image494.jpg') => {
//   const getImage = (src, fb = fallback) => useImageUrl(src, fb)
//   return { getImage }
// }
