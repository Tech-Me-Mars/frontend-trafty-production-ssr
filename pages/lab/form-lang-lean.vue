<template>
  <Card class="max-w-xl mx-auto mt-8">
   
    <template #content>

      <Form @submit="onSubmit()">
        <van-tabs v-model:active="activeTab" type="line" sticky animated color="#202c54">
          <van-tab v-for="(lang, idx) in langs" :title="lang.label" :name="idx" :key="lang.code">
            <div class="p-3 space-y-4">
              <!-- Name -->
              <div>
                <label :for="'name-' + lang.code" class="block mb-2 font-semibold">
                  {{ t('ชื่อรายการ') }} ({{ lang.label }}) <span v-if="lang.code !== 'cn'" class="text-red-500">*</span>
                </label>
                <InputText
                  :id="`name-${lang.code}`"
                  v-model="businessListName[lang.code]"
                  :placeholder="t('กรอกชื่อรายการ')"
                />
                <p v-if="errors[`business_list_name_i18n.${lang.code}`]" class="error-text">
                  {{ errors[`business_list_name_i18n.${lang.code}`] }}
                </p>
              </div>
              <!-- Price -->
              <div>
                <label :for="'price-' + lang.code" class="block mb-2 font-semibold">
                  {{ t('ราคา') }} ({{ lang.label }}) <span v-if="lang.code !== 'cn'" class="text-red-500">*</span>
                </label>
                <InputText
                  :id="`price-${lang.code}`"
                  v-model="businessListPrice[lang.code]"
                  :placeholder="t('กรอกราคา')"
                  type="text"
                />
                <p v-if="errors[`business_list_price_i18n.${lang.code}`]" class="error-text">
                  {{ errors[`business_list_price_i18n.${lang.code}`] }}
                </p>
              </div>
              <!-- Phone -->
              <div>
                <label for="phone" class="block mb-2 font-semibold">
                  {{ t('เบอร์โทร') }} ({{ lang.label }}) <span class="text-red-500">*</span>
                </label>
                <InputText
                  id="phone"
                  v-model="phone"
                  :placeholder="t('กรอกเบอร์โทร') + ` (${lang.label})`"
                  type="text"
                />
                <p v-if="errors.phone && activeTab === idx" class="error-text">
                  {{ errors.phone }}
                </p>
              </div>
            </div>
          </van-tab>
        </van-tabs>
        <div class="flex gap-2 mt-4">
          <Button :label="t('บันทึก')" type="submit" class="flex-1" :loading="isSubmitting" />
          <Button label="ยกเลิก" severity="secondary" @click="resetForm" type="button" />
        </div>
      </Form>
    </template>
  </Card>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as zod from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useI18n } from 'vue-i18n'
const { t, locale, setLocale } = useI18n();
const langs = [
  { code: 'th', label: 'ไทย', locale: 'th' },
  { code: 'en', label: 'English', locale: 'en' },
  { code: 'cn', label: '中文', locale: 'cn' }
];
const activeTab = ref(langs.findIndex(l => l.locale === locale.value) ?? 0);
// เมื่อเปลี่ยนแท็บ
watch(activeTab, (newIdx) => {
  setLocale(langs[newIdx].locale);
});
// เมื่อเปลี่ยน locale
watch(locale, (newLocale) => {
  const idx = langs.findIndex(l => l.locale === newLocale);
  if (idx !== -1) activeTab.value = idx;
});

const status = ref(true)
const isSubmitting = ref(false)
const business_id = 'ff8597c8-b5de-4cad-863a-d8eab99dbe0d'

const validationSchema = toTypedSchema(
  zod.object({
    business_list_name_i18n: zod.object({
      th: zod.string().min(1, 'กรุณากรอกชื่อภาษาไทย'),
      en: zod.string().min(1, 'Please enter name in English'),
      cn: zod.string().optional().or(zod.literal(''))
    }),
    business_list_price_i18n: zod.object({
      th: zod.string()
        .min(1, 'กรุณากรอกราคา (ไทย)')
        .regex(/^\d+(\.\d{1,2})?$/, 'รูปแบบราคาไม่ถูกต้อง'),
      en: zod.string()
        .min(1, 'Please enter price in English')
        .regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
      cn: zod.string().optional().or(zod.literal(''))
        .refine((val) => !val || /^\d+(\.\d{1,2})?$/.test(val), {
          message: 'ราคาไม่ถูกต้อง'
        })
    }),
    phone: zod.string().min(1, t('กรุณากรอกเบอร์โทร')),
  })
)
const { handleSubmit, errors, handleReset } = useForm({ validationSchema })

const { value: businessListNameTh } = useField('business_list_name_i18n.th', undefined, { initialValue: '' })
const { value: businessListNameEn } = useField('business_list_name_i18n.en', undefined, { initialValue: '' })
const { value: businessListNameCn } = useField('business_list_name_i18n.cn', undefined, { initialValue: '' })
const { value: businessListPriceTh } = useField('business_list_price_i18n.th', undefined, { initialValue: '' })
const { value: businessListPriceEn } = useField('business_list_price_i18n.en', undefined, { initialValue: '' })
const { value: businessListPriceCn } = useField('business_list_price_i18n.cn', undefined, { initialValue: '' })
const { value: phone } = useField('phone', undefined, { initialValue: '' })

const businessListName = ref({
  get th() { return businessListNameTh.value },
  set th(v) { businessListNameTh.value = v },
  get en() { return businessListNameEn.value },
  set en(v) { businessListNameEn.value = v },
  get cn() { return businessListNameCn.value },
  set cn(v) { businessListNameCn.value = v }
})
const businessListPrice = ref({
  get th() { return businessListPriceTh.value },
  set th(v) { businessListPriceTh.value = v },
  get en() { return businessListPriceEn.value },
  set en(v) { businessListPriceEn.value = v },
  get cn() { return businessListPriceCn.value },
  set cn(v) { businessListPriceCn.value = v }
})

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true
  try {
    const payload = {
      business_id,
      business_list_name_i18n: values.business_list_name_i18n,
      business_list_price_i18n: values.business_list_price_i18n,
      phone: values.phone,
      status: status.value
    }
    console.log('Payload to send:', payload)
    alert('บันทึกข้อมูลสำเร็จ!')
  } catch (error) {
    alert('เกิดข้อผิดพลาด: ' + error.message)
  } finally {
    isSubmitting.value = false
  }
})

const resetForm = () => {
  handleReset()
  status.value = true
  activeTab.value = 0
}
</script>
