<template>
    <Form @submit="onSubmit">
      <div class="card pt-5 mb-10 space-y-4">
        <h2 class="font-bold text-lg mb-3">
          {{ sectionTitle }}
        </h2>
  
        <div v-for="field in fields" :key="field.name">
          <label class="label-input">{{ field.label }}</label>
          <InputText
            v-model="field.model"
            :placeholder="field.label"
            class="w-full custom-border"
            :invalid="errors?.[field.name] ? true : false"
          />
          <p class="error-text" v-if="errors?.[field.name]">{{ errors[field.name] }}</p>
        </div>
  
        <!-- Upload -->
        <div>
          <label class="label-input">{{ t(`${lang}.เอกสารรับรอง`) }}</label>
          <!-- <FileUpload mode="basic" @select="onFileSelect" customUpload rounded auto
            :chooseLabel="t(`${lang}.เพิ่มไฟล์`)" chooseIcon="pi pi-upload" :multiple="true" /> -->
            <div class="flex">
              <!-- <FileUpload mode="basic" @select="onFileSelect" customUpload rounded auto severity="secondary"
                class=" p-button-outlined border-gray-00" style="color: gray;" outlined :chooseLabel="t('เพิ่มไฟล์')"
                chooseIcon="pi pi-upload" :multiple="true" /> -->
                <FileUpload
  mode="basic"
  severity="secondary"
  customUpload
  auto
  :chooseLabel="t('อัพโหลดไฟล์')"
  chooseIcon="pi pi-upload"
  :multiple="true"
  @select="onFileSelect"
  class="upload-button"
/>

            </div>
          <ul v-if="listFiles.length" class="mt-4 space-y-2">
            <li v-for="(file, i) in listFiles" :key="i" class="flex justify-between items-center bg-gray-50 p-2 rounded">
              <span>{{ file.file.name }}</span>
              <button @click="removeFile(i)">
                <i class="fa-solid fa-xmark text-red-600 text-lg"></i>
              </button>
            </li>
          </ul>
        </div>
  
        <Button :label="submitText" :loading="isloadingAxi" type="submit" class="w-full" rounded />
      </div>
    </Form>
  </template>

  <script setup>
  import { Form, useForm, useField } from 'vee-validate'
  import * as zod from 'zod'
  import { toTypedSchema } from '@vee-validate/zod'
  import { useI18n } from 'vue-i18n'
  import { ref, computed } from 'vue'
  import { useFormStore } from '@/store/businessStore'
  import * as dataApi from "../../../api/data.js";

  
  const props = defineProps({ lang: String })
  const { t } = useI18n()
  const formStore = useFormStore()
  const isloadingAxi = useState('isloadingAxi', () => false)
  const alertToast = ref({})
  const requireValue = t(`${props.lang}.กรุณาระบุข้อมูลให้ถูกต้อง`)
  
  const schema = zod.object({
    business_name: zod.string().nonempty(requireValue),
    business_person: zod.string().nonempty(requireValue),
    business_address: zod.string().nonempty(requireValue),
    business_contact: zod.string().nonempty(requireValue),
    business_email: zod.string().email(t(`${props.lang}.กรุณาระบุอีเมลที่ถูกต้อง`)).nonempty(requireValue),
  })
  
  const { handleSubmit, errors } = useForm({ validationSchema: toTypedSchema(schema) })
  const { value: business_name } = useField('business_name')
  const { value: business_person } = useField('business_person')
  const { value: business_address } = useField('business_address')
  const { value: business_contact } = useField('business_contact')
  const { value: business_email } = useField('business_email')
  const { value: listFiles } = useField('listFiles', null, { initialValue: [] })
  
  const fields = computed(() => [
    { name: 'business_name', label: t(`${props.lang}.ชื่อธุรกิจ`), model: business_name },
    { name: 'business_person', label: t(`${props.lang}.ผู้รับผิดชอบ`), model: business_person },
    { name: 'business_address', label: t(`${props.lang}.ที่อยู่`), model: business_address },
    { name: 'business_contact', label: t(`${props.lang}.ติดต่อ`), model: business_contact },
    { name: 'business_email', label: t(`${props.lang}.อีเมล`), model: business_email },
  ])
  
  const sectionTitle = computed(() => {
    return props.lang === 'th' ? 'ข้อมูลหน่วยงาน'
         : props.lang === 'en' ? 'Agency Info'
         : '机构信息'
  })
  
  const submitText = computed(() => {
    return props.lang === 'th' ? 'ถัดไป'
         : props.lang === 'en' ? 'Next'
         : '下一步'
  })
  
  const onSubmit = handleSubmit(async () => {
    isloadingAxi.value = true
  
    try {
      // เตรียม payload
      const payload = {
        business_name: business_name.value,
        business_person: business_person.value,
        business_address: business_address.value,
        business_contact: business_contact.value,
        business_email: business_email.value,
        files: listFiles.value.map((f) => f.file), // upload ต่อภายหลัง
      }
  
      // 🚀 ตัวอย่างการยิง API (คุณอาจเปลี่ยนชื่อ endpoint)
      await dataApi.saveAgencyInfo(payload)
  
      formStore.setForm3(
        business_name.value,
        business_person.value,
        business_address.value,
        business_contact.value,
        business_email.value,
        listFiles.value
      )
  
      formStore.nextPage()
    } catch (err) {
      alertToast.value = { severity: 'error', summary: 'Error', detail: 'ไม่สามารถบันทึกได้' }
    } finally {
      isloadingAxi.value = false
    }
  })
  
  const onFileSelect = (event) => {
    event.files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        listFiles.value.push({ file, src: e.target.result })
      }
      reader.readAsDataURL(file)
    })
  }
  
  const removeFile = (index) => {
    listFiles.value.splice(index, 1)
  }
  </script>
  