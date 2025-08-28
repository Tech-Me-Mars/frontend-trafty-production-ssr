<template>
  <div class="min-h-screen bg-zinc-50">

    <LayoutsBaseHeader :title="t('ธุรกิจในแหล่งท่องเที่ยว')" showBack></LayoutsBaseHeader>
    <section class="max-w-[430px] mx-auto">

      <div class="p-3">
        <template v-if="surveyDataMap">
      <Dynamic :survey-data-map="surveyDataMap" @submit="handleFormSubmit" :default-values="mapDefaultValueData"
        :model-change="model_change" from="store" />
    </template>
      </div>

    <NotifyMessage v-model:show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
      :life="toast.life" />
    <NotificationPopup v-model:visible="notification.visible" :state="notification.state" :title="notification.title"
      :detail="notification.detail" :timeout="notification.timeout" :redirect-url="notification.redirectUrl"
      :auto-close="notification.autoClose" @close="onNotificationClose" />
      </section>
  </div>
</template>
<script setup>

// basic ที่ใช้ทุกหน้า
definePageMeta({
  middleware: ["auth"],
});
import { useForm, useField, Form } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'
import * as dataApi from "./api/dataApi.js";
import { useI18n } from 'vue-i18n';
const { t, locale, setLocale } = useI18n()
const isloadingAxi = useState('isloadingAxi')
const route = useRoute()
const router = useRouter()
const toast = ref({
  show: false,
  type: null,
  title: null,
  message: null,
  life: null,
})
const notification = reactive({
  visible: false,
  state: 'success',
  title: '',
  detail: '',
  timeout: 0,
  redirectUrl: null,
  autoClose: true
})
// Methods
const showNotification = (config) => {
  Object.assign(notification, {
    visible: true,
    ...config
  })
}
// จบการ basic ที่ใช้ทุกหน้า




const surveyDataMap = ref()
const model_change = ref([
])
const mapDefaultValueData = ref({})
const loadData = async () => {
  try {
    const role_name = await useDecryptedCookie('role_name') // 'business'

    const res = await dataApi.getSurveyById(route.params.id)
    const arr = res.data.data.question_groups || []

    // ✅ ถ้าเป็น business ให้ตัดทุกก้อนที่ role === 'police' ทิ้ง
    const filteredGroups = role_name == 'business'
      ? arr
          // ตัดกลุ่มที่เป็น police ทั้งก้อน
          .filter(g => g?.role !== 'police')
          // ตัดภายใน questions/choices ด้วย
          .map(g => ({
            ...g,
            questions: (g.questions || [])
              .filter(q => q?.role !== 'police')
              .map(q => q?.question_type === 'group'
                ? { ...q, choices: (q.choices || []).filter(c => c?.role !== 'police') }
                : q
              )
          }))
      : arr

    // flatten questions - เอา choices ของ group มาไว้ระดับเดียวกัน (เหมือนเดิม)
    const flattenQuestions = (questions = []) => {
      const out = []
      for (const q of questions) {
        if (q.question_type === 'group' && Array.isArray(q.choices) && q.choices.length > 0) {
          const { choices, ...groupInfo } = q
          out.push(groupInfo)
          out.push(...q.choices)
        } else {
          out.push(q)
        }
      }
      return out
    }

    // เปลี่ยน array group เป็น object โดยใช้ group_name เป็น key
    const flatObject = filteredGroups.reduce((acc, cur) => {
      acc[cur.group_name] = {
        ...cur,
        _question: flattenQuestions(cur.questions)
      }
      delete acc[cur.group_name].questions
      return acc
    }, {})

    console.log('flatObject', flatObject)
    surveyDataMap.value = flatObject
  } catch (error) {
    toast.value = {
      show: true,
      type: 'danger',
      title: t('ผิดพลาด'),
      message: error?.response?.data?.message || t('เกิดข้อผิดพลาด'),
      life: null
    }
    console.error(error)
  }
}

onMounted(() => {
  loadData();
})
// 

// ช่วยเช็กว่าเป็น plain object (ไม่ใช่ Array/Date/File ฯลฯ)
const isPlainObject = (o) =>
  Object.prototype.toString.call(o) === '[object Object]'

// แตกเฉพาะ object ที่อยู่ระดับแรกเท่านั้น
// ถ้าอยากเลือกเฉพาะบางคีย์ ให้ส่ง includeKeys เป็น array (เช่น ['hotel'])
const flattenLevel1 = (obj, includeKeys = null) => {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    const shouldFlatten = isPlainObject(v) && (!includeKeys || includeKeys.includes(k))
    if (shouldFlatten) {
      // ดึงแค่คีย์ชั้นในของ v มาวางบนชั้นบน (ชั้นถัดไปยังคงเป็น object เดิม)
      for (const [ik, iv] of Object.entries(v)) {
        out[ik] = iv
      }
    } else {
      out[k] = v
    }
  }
  return out
}
const handleFormSubmit = async (allFormsData) => {
  try {
    console.log('ส่งทั้งหมด:', allFormsData)
    const mergedData = flattenLevel1(allFormsData)
    console.log('after merg', mergedData)
    const res = await dataApi.saveSurvey(mergedData)
    // console.log('mergedData:', mergedData)
    showNotification({
      state: res.data.dialog?.state,
      title: res.data.dialog?.title,
      detail: res.data.dialog?.detail,
      timeout: res.data.dialog?.timeout || 3000,
      redirectUrl: `/vendor/manage-business/home/${route.params.id}`,
      autoClose: true
    })


  } catch (error) {
    toast.value = {
      show: true,
      type: 'danger',
      title: error.response?.data?.title || t('คำเตือน'),
      message: error.response?.data?.detail || t('เกิดข้อผิดพลาด'),
      life: null
    }

    // showNotification({
    //   state: 'warning',
    //   title: error.response?.data?.title || t('คำเตือน'),
    //   detail: error.response?.data?.detail || t('เกิดข้อผิดพลาด'),
    //   timeout: 0,
    //   redirectUrl:  res.data.dialog?.timeout || null,
    //   autoClose: false // ไม่นับถอยหลัง ต้องกดปุ่มปิด
    // })
    console.error('Error saving survey data:', error)

  }
}
</script>