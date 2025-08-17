<template>
  <div class="min-h-screen bg-zinc-50">

    <LayoutsBaseHeader :title="t('ธุรกิจในแหล่งท่องเที่ยว')" showBack :backTo="`/inspector/check/business-tourlist?isBusiness=${route.query.isBusiness}`"></LayoutsBaseHeader>

    <template v-if="surveyDataMap">
      <Dynamic :survey-data-map="surveyDataMap" @submit="handleFormSubmit" :default-values="mapDefaultValueData"
        :model-change="model_change" />
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

          <!-- ปุ่ม (ปรับตามที่ต้องการ) -->
          <!-- <div class="mt-8 flex flex-col items-center gap-5">
          <button
            class="px-8 py-3 text-base rounded-full text-white"
            :class="isPass ? 'bg-green-600' : 'bg-[#202c54]'"
            @click="onPrimary"
          >
            {{ isPass ? 'ตกลง' : 'ส่งใบเตือน' }}
          </button>
          <button class="text-[#202c54] underline" @click="onGoHome">
            กลับสู่หน้าหลัก
          </button>
        </div> -->
          <!-- Buttons Section -->
          <div class="max-w-[20rem] mx-auto">
            <Button v-if="!isPass" :loading="isloadingAxi" :label="t('ส่งใบเตือน')" @click="goIssueWarning"
              severity="primary" rounded class="w-full mb-1" :pt="{
                label: { class: 'text-primary-main text-white' },
                root: { class: '!border-primary-main' }
              }" />
            <Button v-if="isPass" :loading="isloadingAxi" @click="navigateTo(`/inspector/check/business-tourlist?isBusiness=${route.query.isBusiness}`)"
              :label="t('กลับหน้าหลัก')" severity="secondary" rounded class="w-full" :pt="{}" />

          </div>

        </div>
      </div>
    </Transition>

    <NotifyMessage v-model:show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
      :life="toast.life" />
    <NotificationPopup v-model:visible="notification.visible" :state="notification.state" :title="notification.title"
      :detail="notification.detail" :timeout="notification.timeout" :redirect-url="notification.redirectUrl"
      :auto-close="notification.autoClose" />
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
    const res = await dataApi.getSurveyAuditById(route.params.question_template_id)
    const arr = res.data.data.question_groups || []

    // flatten questions - เอา choices ของ group มาไว้ระดับเดียวกัน
    const flattenQuestions = (questions = []) => {
      const out = []
      for (const q of questions) {
        if (q.question_type === "group" && Array.isArray(q.choices) && q.choices.length > 0) {
          // ดึง info group ออกมา (ไม่เอา choices)
          const { choices, ...groupInfo } = q
          out.push(groupInfo)
          // แตก choices ทุกอันตามหลัง
          out.push(...q.choices)
        } else {
          out.push(q)
        }
      }
      return out
    }

    // เปลี่ยน array group เป็น object โดยใช้ group_name เป็น key
    // และเปลี่ยน questions เป็น _question (flatten แล้ว)
    const flatObject = arr.reduce((acc, cur) => {
      acc[cur.group_name] = {
        ...cur,
        _question: flattenQuestions(cur.questions)
      }
      delete acc[cur.group_name].questions // ลบ field questions เดิมออก (ถ้าไม่ต้องการ)
      return acc
    }, {})

    // ผลลัพธ์ flatObject ตามที่ต้องการ
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
    // console.log('mergedData:', mergedData)
    // showNotification({
    //   state: res.data.dialog?.state,
    //   title: res.data.dialog?.title,
    //   detail: res.data.dialog?.detail,
    //   timeout: res.data.dialog?.timeout || 3000,
    //   redirectUrl: `/vendor/manage-business/home/${route.params.id}`,
    //   autoClose: true
    // })
    issueWarningId.value = res.data.data.id
    openDialogFromApi(res?.data?.dialog)


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