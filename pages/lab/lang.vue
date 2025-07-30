<template>
    <Card class="max-w-xl mx-auto mt-8">
      <template #content>
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
                      'p-invalid': getFieldError('business_list_name_i18n', lang.code),
                      'w-full': true 
                    }" 
                    :placeholder="`กรอกชื่อรายการ ${lang.label}`"
                  />
                  <!-- แสดงข้อความข้อผิดพลาด -->
                  <p v-if="getFieldError('business_list_name_i18n', lang.code)" class="text-red-500 text-sm mt-1">
                    {{ getFieldError('business_list_name_i18n', lang.code) }}
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
                      'p-invalid': getFieldError('business_list_price_i18n', lang.code),
                      'w-full': true 
                    }" 
                    :placeholder="`กรอกราคา (${lang.label})`"
                    type="text"
                  />
                  <!-- แสดงข้อความข้อผิดพลาด -->
                  <p v-if="getFieldError('business_list_price_i18n', lang.code)" class="text-red-500 text-sm mt-1">
                    {{ getFieldError('business_list_price_i18n', lang.code) }}
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
              values: { 
                businessListName: businessListName, 
                businessListPrice: businessListPrice 
              }, 
              errors: errors,
              flatErrors: getFlatErrors()
            }, null, 2) }}</pre>
          </details>
        </Form>
      </template>
    </Card>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
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
  
  // ✅ วิธีที่ 1: เปลี่ยน Zod Schema เป็น flat structure
  const validationSchema = toTypedSchema(
    zod.object({
      'business_list_name_i18n.th': zod.string().min(1, 'กรุณากรอกชื่อภาษาไทย'),
      'business_list_name_i18n.en': zod.string().min(1, 'Please enter name in English'),
      'business_list_name_i18n.cn': zod.string().optional().or(zod.literal('')),
      'business_list_price_i18n.th': zod.string()
        .min(1, 'กรุณากรอกราคา (ไทย)')
        .regex(/^\d+(\.\d{1,2})?$/, 'รูปแบบราคาไม่ถูกต้อง'),
      'business_list_price_i18n.en': zod.string()
        .min(1, 'Please enter price in English')
        .regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
      'business_list_price_i18n.cn': zod.string().optional().or(zod.literal(''))
        .refine((val) => !val || /^\d+(\.\d{1,2})?$/.test(val), {
          message: '价格格式不正确'
        })
    })
  )
  
  // ✅ useForm hook
  const { handleSubmit, errors, handleReset } = useForm({
    validationSchema,
  })
  
  // ✅ useField hooks สำหรับแต่ละ field แยกตามภาษา
  const { value: businessListNameTh } = useField('business_list_name_i18n.th', null, { initialValue: '' })
  const { value: businessListNameEn } = useField('business_list_name_i18n.en', null, { initialValue: '' })
  const { value: businessListNameCn } = useField('business_list_name_i18n.cn', null, { initialValue: '' })
  
  const { value: businessListPriceTh } = useField('business_list_price_i18n.th', null, { initialValue: '' })
  const { value: businessListPriceEn } = useField('business_list_price_i18n.en', null, { initialValue: '' })
  const { value: businessListPriceCn } = useField('business_list_price_i18n.cn', null, { initialValue: '' })
  
  // ✅ Computed properties เพื่อให้เข้าถึงได้แบบ object
  const businessListName = computed({
    get: () => ({
      th: businessListNameTh.value,
      en: businessListNameEn.value,
      cn: businessListNameCn.value
    }),
    set: (value) => {
      businessListNameTh.value = value.th
      businessListNameEn.value = value.en
      businessListNameCn.value = value.cn
    }
  })
  
  const businessListPrice = computed({
    get: () => ({
      th: businessListPriceTh.value,
      en: businessListPriceEn.value,
      cn: businessListPriceCn.value
    }),
    set: (value) => {
      businessListPriceTh.value = value.th
      businessListPriceEn.value = value.en
      businessListPriceCn.value = value.cn
    }
  })
  
  // ✅ Helper function สำหรับดึง error ของแต่ละภาษา
  const getFieldError = (fieldName, langCode) => {
    const errorKey = `${fieldName}.${langCode}`
    return errors.value[errorKey] || null
  }
  
  // ✅ Helper function สำหรับ debug - แสดง errors ทั้งหมด
  const getFlatErrors = () => {
    const flatErrors = {}
    Object.keys(errors.value).forEach(key => {
      flatErrors[key] = errors.value[key]
    })
    return flatErrors
  }
  
  // ✅ รับ business_id จาก props/route หรือกำหนดเอง
  const business_id = 'ff8597c8-b5de-4cad-863a-d8eab99dbe0d'
  
  // ✅ Submit Handler
  const onSubmit = handleSubmit(async (values) => {
    isSubmitting.value = true
    
    try {
      // แปลงข้อมูลกลับเป็น nested object structure สำหรับ API
      const payload = {
        business_id,
        business_list_name_i18n: {
          th: values['business_list_name_i18n.th'],
          en: values['business_list_name_i18n.en'],
          cn: values['business_list_name_i18n.cn'] || ''
        },
        business_list_price_i18n: {
          th: values['business_list_price_i18n.th'],
          en: values['business_list_price_i18n.en'],
          cn: values['business_list_price_i18n.cn'] || ''
        },
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
  })
  
  // ✅ Reset Form
  const resetForm = () => {
    handleReset()
    status.value = true
    activeTab.value = 0
  }
  </script>

  <style scoped>
  .error-text {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  </style>