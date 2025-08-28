<template>
  <div class="min-h-screen bg-zinc-100">

    <LayoutsBaseHeader :title="t('ตรวจสอบแหล่งท่องเที่ยว/ธุรกิจในแหล่งท่องเที่ยว')" showBack :backTo="BackTo">
    </LayoutsBaseHeader>
    <section class="max-w-[430px] mx-auto">
      <div class="p-3">
        <template v-if="surveyDataMap">
          <Dynamic :survey-data-map="surveyDataMap" @submit="handleFormSubmit" :default-values="mapDefaultValueData"
            :model-change="model_change" from="police" />
        </template>
        <!-- Dialog บังทั้งหน้า -->
        <Transition name="fade">
          <div v-if="showDialog" class="fixed inset-0 z-[99999] bg-white flex items-center justify-center">
            <div class="text-center px-6">
              <!-- วงแหวนเปอร์เซ็นต์ -->
              <div class="relative w-28 h-28 mx-auto mb-6">
                <div class="w-28 h-28 rounded-full" :style="ringStyle"></div>
                <div
                  class="absolute inset-2 rounded-full bg-white flex items-center justify-center text-xl font-bold text-[#202c54]">
                  {{ chosenPercentStr }}
                </div>
              </div>

              <!-- หัวข้อใหญ่ -->
              <h3 class="text-2xl font-semibold mb-3 text-[#202c54]">
                {{ headerTitle }}
              </h3>

              <!-- รายละเอียด -->
              <p class="text-gray-600 text-base leading-relaxed max-w-xs mx-aut mb-20">
                {{ detailLine }}
              </p>
              <!-- Buttons Section -->
              <div class="max-w-[20rem] mx-auto">
                <Button v-if="!isPass" :loading="isloadingAxi" :label="t('ส่งใบเตือน')" @click="goIssueWarning"
                  severity="primary" rounded class="w-full mb-1" :pt="{
                    label: { class: 'text-primary-main text-white' },
                    root: { class: '!border-primary-main' }
                  }" />
                <Button v-if="isPass" :loading="isloadingAxi" @click="navigateTo(BackTo)" :label="t('กลับหน้าหลัก')"
                  severity="secondary" rounded class="w-full" :pt="{}" />

              </div>
            </div>
          </div>
        </Transition>

      </div>


      <NotifyMessage v-model:show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
        :life="toast.life" />
      <NotificationPopup v-model:visible="notification.visible" :state="notification.state" :title="notification.title"
        :detail="notification.detail" :timeout="notification.timeout" :redirect-url="notification.redirectUrl"
        :auto-close="notification.autoClose" />
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


const BackTo = computed(() => {
  if (route.query.isBusiness == 'true' || route.query.isBusiness == 'false') {
    return `/inspector/check/business-tourlist?isBusiness=${route.query.isBusiness}`
  } else if (route.query.isBusiness == 'area') {
    return `/inspector/area-duty`
  } else {
    return navigateTo('/inspector/home')
  }
})

const surveyDataMap = ref()
const model_change = ref([
])
const mapDefaultValueData = ref({})
const loadData = async () => {
  try {
    const role_name = await useDecryptedCookie('role_name') // 'business'

    const res = await dataApi.getSurveyAuditById(route.params.question_template_id)
    const arr = res.data.data.question_groups || []

    // ✅ ถ้าเป็น business ให้ตัดทุกก้อนที่ role === 'police' (ทั้งระดับ group และภายใน questions/choices)
    const filteredGroups = role_name === 'business'
      ? arr
        .filter(g => g?.role !== 'police')
        .map(g => ({
          ...g,
          questions: (g.questions || [])
            .filter(q => q?.role !== 'police')
            .map(q =>
              q?.question_type === 'group'
                ? { ...q, choices: (q.choices || []).filter(c => c?.role !== 'police') }
                : q
            )
        }))
      : arr

    // flatten questions - เอา choices ของ group มาไว้ระดับเดียวกัน
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

    // เปลี่ยน array group เป็น object โดยใช้ group_name เป็น key และเปลี่ยน questions เป็น _question
    const flatObject = filteredGroups.reduce((acc, cur) => {
      acc[cur.group_name] = {
        ...cur,
        _question: flattenQuestions(cur.questions)
      }
      delete acc[cur.group_name].questions
      return acc
    }, {})

    // ผลลัพธ์
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

const showDialog = ref(false)
const dialogData = ref({
  title: '',
  IsPass: false,
  detail: '',
  ScorePercent: '0%',
  ScorePercentFailed: '0%',
})
const issueWarningId = ref(null)
const openDialogFromApi = (dlg) => {
  dialogData.value = {
    title: dlg?.title ?? '',
    IsPass: !!dlg?.IsPass,
    detail: dlg?.detail ?? '',
    ScorePercent: dlg?.ScorePercent ?? '0%',
    ScorePercentFailed: dlg?.ScorePercentFailed ?? '0%',
  }
  showDialog.value = true
}
const goIssueWarning = () => {
  if (!issueWarningId.value) return
  navigateTo(`/inspector/Issue-warning/${issueWarningId.value}?isBusiness=${route.query.isBusiness}`)
}
// ---- คำนวณค่าที่ใช้เรนเดอร์ ----
const isPass = computed(() => !!dialogData.value.IsPass)

const chosenPercentStr = computed(() => {
  return isPass.value ? dialogData.value.ScorePercent : dialogData.value.ScorePercentFailed
})
const percentNum = computed(() => {
  const n = Number(String(chosenPercentStr.value || '0').replace('%', ''))
  return Number.isFinite(n) ? Math.min(Math.max(n, 0), 100) : 0
})
const percentText = computed(() => `${Math.round(percentNum.value)}%`)

const ringColor = computed(() => (isPass.value ? '#22c55e' : '#bd2035')) // เขียว/แดง
const ringStyle = computed(() => {
  const deg = percentNum.value * 3.6
  return { background: `conic-gradient(${ringColor.value} ${deg}deg, #e5e7eb 0deg)` }
})

const headerTitle = computed(() => (isPass.value ? 'ผ่านเกณฑ์' : 'ไม่ผ่านเกณฑ์'))
const detailLine = computed(() => `${dialogData.value.detail} ${chosenPercentStr.value}`)
// ---- ปุ่มการกระทำ (แก้ path/logic ตามต้องการ) ----
const onPrimary = () => {
  if (isPass.value) {
    // ผ่านเกณฑ์: ปิด dialog หรือ redirect ตามต้องการ
    showDialog.value = false
  } else {
    // ไม่ผ่าน: ไปหน้าสร้างใบเตือน
    navigateTo('/client/warning/create')
    showDialog.value = false
  }
}
// onMounted(() => demoOpen())
// ---- DEMO: ลบได้ ----
const demoOpen = () => {
  // ตัวอย่างข้อมูลจาก API ที่คุณให้มา
  openDialogFromApi({
    title: 'สร้างข้อมูลสำเร็จ',
    IsPass: false,
    detail: 'การประเมินมาตรฐานความปลอดภัยของคุณอยู่ที่',
    ScorePercent: '72.34%',
    ScorePercentFailed: '27.66%',
  })
}
const handleFormSubmit = async (allFormsData) => {
  try {
    console.log('ส่งทั้งหมด:', allFormsData)
    const mergedData = flattenLevel1(allFormsData)
    console.log('after merg', mergedData)
    const res = await dataApi.saveSurveyAudit(mergedData)

    issueWarningId.value = res.data.data.id
    // openDialogFromApi(res?.data?.dialog)
    navigateTo({
      path: '/inspector/do-recheck/state-finish',
      query: {
        // คีย์ใดก็ได้ตามที่รองรับด้านบน
        title: res?.data?.dialog?.title,
        isPass: res?.data?.dialog?.IsPass,                // true/false
        detail: res?.data?.dialog?.detail,
        score: res?.data?.dialog?.ScorePercent,           // "72.34%" หรือ "72.34"
        scoreFailed: res?.data?.dialog?.ScorePercentFailed,
        id: res?.data?.data?.id,                          // ใช้ไปหน้าออกใบเตือน
        isBusiness: route.query.isBusiness                // ส่งต่อค่าเดิม
      }
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