// ใช้ใน Nuxt 3 / Vue 3
// วางไฟล์นี้ที่: /composables/useImage.ts
export function useImage(fallback = '/image/image494.jpg') {
    const normalize = (src?: unknown): string => {
      if (typeof src !== 'string') return fallback;
      const s = src.trim();
      if (!s) return fallback;
  
      // data URL
      if (s.startsWith('data:')) return s;
  
      // กรณีลืมใส่ '//' เช่น 'https:dododo/image.png'
      if (/^https?:[^/]/i.test(s)) {
        return s.replace(/^https?:/i, (m) => `${m}//`);
      }
  
      // http(s) ปกติ
      if (/^https?:\/\//i.test(s)) return s;
  
      // absolute path (เสิร์ฟจาก /public)
      if (s.startsWith('/')) return s;
  
      // อื่น ๆ ให้มองเป็นไฟล์ใน /public
      return `/${s}`;
    };
  
    /** ใช้ใน template: :src="getImage(image)" */
    const getImage = (src?: unknown): string => normalize(src);
  
    return { getImage };
  }
  