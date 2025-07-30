<template>
  <Card class="max-w-xl mx-auto mt-8">
    <template #content>
        <pre class="mb-4 p-2 bg-gray-100 text-xs">{{ JSON.stringify(errors, null, 2) }}</pre>
      <Form @submit="onSubmit()">
        <div class="mb-4">
          <h3 class="text-lg font-semibold mb-3">เพิ่มรายการธุรกิจ</h3>
        </div>

        <TabView v-model:activeIndex="activeTab" class="mb-4">
          <TabPanel v-for="lang in langs" :key="lang.code" :header="lang.label">
            <div class="p-3 space-y-4">
              <div class="field">
                <label :for="'name-' + lang.code" class="block mb-2 font-semibold">
                  ชื่อรายการ ({{ lang.label }})
                  <span v-if="lang.code !== 'cn'" class="text-red-500">*</span>
                </label>
                <InputText 
                  :id="`name-${lang.code}`"
                  v-model="businessListName[lang.code]"
                  :class="{ 
                    'p-invalid': errors[`business_list_name_i18n.${lang.code}`],
                    'w-full': true 
                  }" 
                  :placeholder="`กรอกชื่อรายการ${lang.label}`"
                />
                <!-- แสดงข้อความข้อผิดพลาด -->
                <p v-if="errors[`business_list_name_i18n.${lang.code}`]" class="error-text">
                  {{ errors[`business_list_name_i18n.${lang.code}`] }}
                </p>
              </div>

              <div class="field">
                <label :for="'price-' + lang.code" class="block mb-2 font-semibold">
                  ราคา ({{ lang.label }})
                  <span v-if="lang.code !== 'cn'" class="text-red-500">*</span>
                </label>
                <InputText 
                  :id="`price-${lang.code}`"
                  v-model="businessListPrice[lang.code]"
                  :class="{ 
                    'p-invalid': errors[`business_list_price_i18n.${lang.code}`],
                    'w-full': true 
                  }" 
                  :placeholder="`กรอกราคา (${lang.label})`"
                  type="text"
                />
                <!-- แสดงข้อความข้อผิดพลาด -->
                <p v-if="errors[`business_list_price_i18n.${lang.code}`]" class="error-text">
                  {{ errors[`business_list_price_i18n.${lang.code}`] }}
                </p>
              </div>

              <!-- แสดงข้อมูลที่กรอกแล้ว (สำหรับดีบัก) -->
              <div v-if="businessListName[lang.code] || businessListPrice[lang.code]" 
                   class="mt-3 p-2 bg-gray-50 rounded text-sm">
                <div v-if="businessListName[lang.code]">
                  <strong>ชื่อ:</strong> {{ businessListName[lang.code] }}
                </div>
                <div v-if="businessListPrice[lang.code]">
                  <strong>ราคา:</strong> {{ businessListPrice[lang.code] }}
                </div>
              </div>
            </div>
          </TabPanel>
        </TabView>

        <div class="field flex items-center mb-4">
          <Checkbox v-model="status" :binary="true" inputId="status" />
          <label for="status" class="ml-2 font-semibold">เปิดใช้งาน</label>
        </div>

        <div class="flex gap-2">
          <Button 
            label="บันทึก" 
            type="submit" 
            class="flex-1"
            :loading="isSubmitting"
          />
          <Button 
            label="ยกเลิก" 
            severity="secondary" 
            @click="resetForm"
            type="button"
          />
        </div>

        <!-- Debug Information -->
        <details class="mt-4 text-xs">
          <summary class="cursor-pointer text-gray-500">Debug Info</summary>
          <pre class="mt-2 p-2 bg-gray-100 rounded overflow-auto">{{ JSON.stringify({ 
            businessListName: businessListName, 
            businessListPrice: businessListPrice, 
            errors 
          }, null, 2) }}</pre>
        </details>
      </Form>
    </template>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as zod from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

// ✅ กำหนดภาษา
const langs = [
  { code: 'th', label: 'ไทย' },
  { code: 'en', label: 'English' },
  { code: 'cn', label: '中文' }
]

const activeTab = ref(0)
const status = ref(true)
const isSubmitting = ref(false)

// ✅ Zod Schema - validate เฉพาะไทย/อังกฤษ บังคับ, จีนไม่บังคับ
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
          message: '价格格式不正确'
        })
    })
  })
)

// ✅ useForm hook
const { handleSubmit, errors, handleReset } = useForm({
  validationSchema,
})

// ✅ แก้ไข: ใช้ useField แยกแต่ละภาษา
const { value: businessListNameTh } = useField('business_list_name_i18n.th', null, { initialValue: '' })
const { value: businessListNameEn } = useField('business_list_name_i18n.en', null, { initialValue: '' })
const { value: businessListNameCn } = useField('business_list_name_i18n.cn', null, { initialValue: '' })

const { value: businessListPriceTh } = useField('business_list_price_i18n.th', null, { initialValue: '' })
const { value: businessListPriceEn } = useField('business_list_price_i18n.en', null, { initialValue: '' })
const { value: businessListPriceCn } = useField('business_list_price_i18n.cn', null, { initialValue: '' })

// ✅ สร้าง computed objects เพื่อให้ใช้งานง่าย
const businessListName = ref({
  get th() { return businessListNameTh.value },
  set th(val) { businessListNameTh.value = val },
  get en() { return businessListNameEn.value },
  set en(val) { businessListNameEn.value = val },
  get cn() { return businessListNameCn.value },
  set cn(val) { businessListNameCn.value = val }
})

const businessListPrice = ref({
  get th() { return businessListPriceTh.value },
  set th(val) { businessListPriceTh.value = val },
  get en() { return businessListPriceEn.value },
  set en(val) { businessListPriceEn.value = val },
  get cn() { return businessListPriceCn.value },
  set cn(val) { businessListPriceCn.value = val }
})

// ✅ รับ business_id จาก props/route หรือกำหนดเอง
const business_id = 'ff8597c8-b5de-4cad-863a-d8eab99dbe0d'

// ✅ Submit Handler
const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true
  
  try {
    const payload = {
      business_id,
      business_list_name_i18n: values.business_list_name_i18n,
      business_list_price_i18n: values.business_list_price_i18n,
      status: status.value
    }
    
    console.log('Payload to send:', payload)
    
    // 🔄 ส่งข้อมูลไป API
    // const response = await request('post', '/api/v1/business-list', payload, true)
    // console.log('Success:', response.data)
    
    // แสดงการสำเร็จ
    alert('บันทึกข้อมูลสำเร็จ!')
    
  } catch (error) {
    console.error('Submit error:', error)
    alert('เกิดข้อผิดพลาด: ' + error.message)
  } finally {
    isSubmitting.value = false
  }
});

// ✅ Reset Form
const resetForm = () => {
  handleReset()
  status.value = true
  activeTab.value = 0
}
</script>
