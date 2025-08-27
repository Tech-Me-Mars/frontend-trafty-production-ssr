<template>
  <div class="min-h-screen bg-white">
    <section class="max-w-[430px] mx-auto h-screen flex flex-col">
      <!-- เนื้อหากลางจอ -->
      <div class="flex-1 flex items-center">
        <div class="w-full p-6 text-center">
          <!-- วงแหวนเปอร์เซ็นต์ -->
          <div class="relative w-28 h-28 mx-auto mb-6">
            <div class="w-28 h-28 rounded-full" :style="ringStyle"></div>
            <div class="absolute inset-2 rounded-full bg-white flex items-center justify-center text-xl font-bold text-[#202c54]">
              {{ chosenPercentStr }}
            </div>
          </div>

          <!-- หัวข้อ -->
          <h3 class="text-2xl font-semibold mb-3 text-[#202c54]">
            {{ headerTitle }}
          </h3>

          <!-- รายละเอียด -->
          <p class="text-gray-600 text-base leading-relaxed max-w-xs mx-auto">
            {{ detailLine }}
          </p>

          <!-- แจ้งเตือนพารามิเตอร์ไม่ครบ (ถ้ามี) -->
          <div v-if="!hasValidParams" class="mt-4 text-center text-sm text-zinc-500">
            {{ t('ขาดพารามิเตอร์ที่จำเป็นสำหรับการแสดงผล') }}
          </div>
        </div>
      </div>

      <!-- แถบปุ่มติดขอบล่าง -->
      <div
        class="z-50 sticky bottom-0  px-4 pt-3 pb-4
              ">
        <div class="max-w-[20rem] mx-auto">
          <Button
            v-if="!isPass"
            :loading="isloadingAxi"
            :label="t('ส่งใบเตือน')"
            @click="goIssueWarning"
            severity="primary"
            rounded
            class="w-full mb-2"

          />
          <Button
            v-else
            :loading="isloadingAxi"
            :label="t('กลับหน้าหลัก')"
            @click="navigateTo(BackTo)"
            severity="secondary"
            rounded
            class="w-full"
          />
        </div>
      </div>
    </section>
  </div>
</template>


<script setup>
// ต้องการ auth เช่นเดิม
definePageMeta({ middleware: ['auth'] })

import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

const route = useRoute()
const isloadingAxi = useState('isloadingAxi')

// ---------- Normalize query params ----------
const qp = route.query || {}

const toBool = (v) => v === true || v === 'true' || v === '1' || v === 1
const toPctStr = (v) => {
  if (v == null || v === '') return '0%'
  const s = String(v).trim()
  return s.endsWith('%') ? s : `${s}%`
}

// รองรับชื่อคีย์หลายแบบ: IsPass/isPass, ScorePercent/score, ScorePercentFailed/scoreFailed
const dialogData = ref({
  title: qp.title ?? qp.dialogTitle ?? '',
  IsPass: toBool(qp.IsPass ?? qp.isPass),
  detail: qp.detail ?? qp.dialogDetail ?? t('การประเมินมาตรฐานความปลอดภัยของคุณอยู่ที่'),
  ScorePercent: toPctStr(qp.ScorePercent ?? qp.score),
  ScorePercentFailed: toPctStr(qp.ScorePercentFailed ?? qp.scoreFailed)
})

// id ที่ใช้ไปหน้าออกใบเตือน
const issueWarningId = ref(qp.id ?? qp.warnId ?? qp.survey_audit_id ?? null)

// สำหรับปุ่มกลับหน้าหลัก เราต้องใช้ isBusiness จาก query เดิม
const isBusiness = qp.isBusiness
const BackTo=computed(()=>{
  if (route.query.isBusiness=='true' || route.query.isBusiness=='false'){
    return `/inspector/check/business-tourlist?isBusiness=${route.query.isBusiness}`
  } else if(route.query.isBusiness=='area'){
    return `/inspector/area-duty`
  }else{
    return navigateTo('/inspector/home')
  }
})

// ---------- คำนวณค่าที่ใช้แสดง ----------
const isPass = computed(() => !!dialogData.value.IsPass)
const chosenPercentStr = computed(() =>
  isPass.value ? dialogData.value.ScorePercent : dialogData.value.ScorePercentFailed
)
const percentNum = computed(() => {
  const n = Number(String(chosenPercentStr.value || '0').replace('%', ''))
  return Number.isFinite(n) ? Math.min(Math.max(n, 0), 100) : 0
})
const ringColor = computed(() => (isPass.value ? '#22c55e' : '#bd2035'))
const ringStyle = computed(() => {
  const deg = percentNum.value * 3.6
  return { background: `conic-gradient(${ringColor.value} ${deg}deg, #e5e7eb 0deg)` }
})
const headerTitle = computed(() => (isPass.value ? t('ผ่านเกณฑ์') : t('ไม่ผ่านเกณฑ์')))
const detailLine = computed(() => `${dialogData.value.detail} ${chosenPercentStr.value}`)

// ถ้าพารามิเตอร์หลักหายไป (เช่นทั้ง score/scoreFailed ว่างและ isPass ไม่ชัด) ก็แจ้งเตือนเบา ๆ
const hasValidParams = computed(() => {
  // อย่างน้อยต้องมี isPass ระบุชัดเจน หรือมี score/scoreFailed อย่างใดอย่างหนึ่ง
  return (
    typeof qp.IsPass !== 'undefined' ||
    typeof qp.isPass !== 'undefined' ||
    (dialogData.value.ScorePercent !== '0%' || dialogData.value.ScorePercentFailed !== '0%')
  )
})

// ---------- Actions ----------
const goIssueWarning = () => {
  if (!issueWarningId.value) return
  navigateTo(`/inspector/Issue-warning/${issueWarningId.value}?isBusiness=${isBusiness}`)
}
</script>
