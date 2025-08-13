// ~/composables/getI18n.ts

export type I18nLike = string | Record<string, unknown> | null | undefined

// map alias จีน -> cn
const aliasMap: Record<string, string> = {
  zh: 'cn',
  'zh-cn': 'cn', zh_CN: 'cn',
  'zh-hans': 'cn', zh_hans: 'cn',
  'zh-hant': 'cn', zh_hant: 'cn',
  'zh-tw': 'cn', zh_TW: 'cn',
}

const normalizeLang = (lang: string = 'th') => {
  const l = String(lang).toLowerCase()
  return aliasMap[l] ?? l
}

// แปลง input ให้เป็น object ปลอดภัย
const toRecord = (i18n: I18nLike): Record<string, unknown> => {
  if (!i18n) return {}
  if (typeof i18n === 'string') {
    try {
      const obj = JSON.parse(i18n)
      return obj && typeof obj === 'object' ? (obj as Record<string, unknown>) : {}
    } catch {
      return {}
    }
  }
  if (typeof i18n === 'object') return i18n as Record<string, unknown>
  return {}
}

const getFirstNonEmpty = (rec: Record<string, unknown>, keys: string[]): string => {
  for (const k of keys) {
    const v = rec[k]
    if (v == null) continue
    const s = typeof v === 'string' ? v : String(v)
    if (s.trim()) return s
  }
  return ''
}

/**
 * รับ object/JSON-string i18n + lang แล้วคืนค่าตามลำดับ fallback
 * ค่าเริ่มต้น: lang > en > th > cn (รองรับ alias จีนอัตโนมัติ)
 *
 * @param i18nObj  เช่น { th: '', en: 'x', cn: '' } หรือ JSON string
 * @param lang     'th' | 'en' | 'cn' | 'zh' | 'zh-CN' | ฯลฯ
 * @param customFallback  กำหนด fallback เพิ่มเอง เช่น ['th','en','cn']
 */
export function getI18n(
  i18nObj?: I18nLike,
  lang: string = 'th',
  customFallback?: string[]
): string {
  const rec = toRecord(i18nObj)
  const ln = normalizeLang(lang)

  // รวม fallback order และ normalize + unique
  const baseOrder = customFallback?.length
    ? [ln, ...customFallback.map(normalizeLang)]
    : [ln, 'en', 'th', 'cn']

  // ขยาย alias ของจีนเพื่อช้อนคีย์ที่มาจาก backend หลากรูปแบบ
  const expandWithAliases = (keys: string[]) => {
    const out: string[] = []
    for (const k of keys) {
      const nk = normalizeLang(k)
      out.push(nk)
      if (nk === 'cn') {
        out.push('zh', 'zh-cn', 'zh_CN', 'zh-hans', 'zh_hans', 'zh-hant', 'zh_hant', 'zh-tw', 'zh_TW')
      }
    }
    return Array.from(new Set(out))
  }

  const keys = expandWithAliases(baseOrder)
  return getFirstNonEmpty(rec, keys)
}
