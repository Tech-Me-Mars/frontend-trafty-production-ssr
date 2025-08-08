// ~/composables/getI18n.ts

/**
 * รับ object i18n กับ lang, คืนค่า string พร้อม fallback (lang > en > th)
 * @param i18nObj เช่น { th: '', en: '', cn: '' }
 * @param lang 'th' | 'en' | 'cn'
 */
export function getI18n(
  i18nObj?: Record<string, string>,
  lang: string = 'th'
): string {
  if (!i18nObj) return ''
  if (i18nObj[lang]?.trim()) return i18nObj[lang]
  if (i18nObj['en']?.trim()) return i18nObj['en']
  if (i18nObj['th']?.trim()) return i18nObj['th']
  if (i18nObj['cn']?.trim()) return i18nObj['cn']
  return ''
}
