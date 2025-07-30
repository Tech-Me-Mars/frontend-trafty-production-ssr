<script setup>
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useI18n } from 'vue-i18n'
import * as zod from 'zod'

const { t } = useI18n()

// ✅ สร้าง schema แบบ inline ได้เลย
const createBusinessListSchema = (tFn) =>
  zod.object({
    business_list_name_i18n: zod.object({
      th: zod.string().min(1, tFn('validation.required_th')),
      en: zod.string().min(1, tFn('validation.required_en')),
      cn: zod.string().optional().or(zod.literal('')),
    }),
  })

const validationSchema = toTypedSchema(createBusinessListSchema(t))

const { handleSubmit, errors } = useForm({
  validationSchema,
  initialValues: {
    business_list_name_i18n: {
      th: '',
      en: '',
      cn: '',
    },
  },
})

const { value: nameTH } = useField('business_list_name_i18n.th')
const { value: nameEN } = useField('business_list_name_i18n.en')
const { value: nameCN } = useField('business_list_name_i18n.cn')

// ✅ payload ตอนส่ง
const onSubmit = handleSubmit((values) => {
  const payload = {
    business_list_name_i18n: { ...values.business_list_name_i18n },
  }
  console.log('payload:', payload)
})
</script>

<template>
  <form @submit="onSubmit" class="space-y-4">
    <div>
      <label>TH</label>
      <input v-model="nameTH" class="border" />
      <div v-if="errors['business_list_name_i18n?.th']" class="text-red-500 text-sm">
        {{ errors['business_list_name_i18n?.th'] }}
      </div>
    </div>
    <div>
      <label>EN</label>
      <input v-model="nameEN" class="border" />
      <div v-if="errors['business_list_name_i18n?.en']" class="text-red-500 text-sm">
        {{ errors['business_list_name_i18n?.en'] }}
      </div>
    </div>
    <div>
      <label>CN</label>
      <input v-model="nameCN" class="border" />
    </div>

    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
      Save
    </button>
  </form>
</template>
