<template>
  <div class="min-h-screen bg-white">
    <LayoutsBaseHeader :title="t('ธุรกิจในแหล่งท่องเที่ยว')" showBack />

    <main class="max-w-[430px] mx-auto">
      <!-- Status Header -->
      <div class="text-center mb-8 bg-zinc-100 h-[10rem] pt-5">
        <template v-if="loadingOverall">
          <div class="max-w-[430px] mx-auto px-6">
            <van-skeleton title :row="2" :loading="true" />
          </div>
        </template>
        <template v-else>
          <p class="text-gray-800 text-sm mb-2">{{ t('การประเมินองคุณ') }}</p>
        </template>
      </div>

      <!-- Progress Circle -->
      <div class="bg-white rounded-lg p-2 border-2 border-gray-100 -mt-[6.5rem] mb-5 max-w-[22rem] mx-auto">
        <h3 class="h-8"></h3>

        <template v-if="loadingOverall">
          <div class="px-3 py-2">
            <van-skeleton :row="1" :loading="true" />
            <div class="h-24 mt-2 rounded-2xl bg-zinc-100 animate-pulse"></div>
          </div>
        </template>

        <template v-else>
          <div class="flex justify-center">
            <!-- Gauge -->
            <div class="relative w-[10rem] h-[5.5rem]">
              <svg class="rotate-180" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                <!-- Background -->
                <circle
                  cx="18" cy="18" r="16" fill="none"
                  class="stroke-current text-gray-200 dark:text-[#e5e7eb]"
                  stroke-width="2" stroke-dasharray="50 100" stroke-linecap="round"
                />
                <!-- Progress -->
                <circle
                  cx="18" cy="18" r="16" fill="none"
                  class="stroke-current text-[#fccc0c] dark:text-[#fccc0c]"
                  stroke-width="2" :stroke-dasharray="`${progressComputed} 100`" stroke-linecap="round"
                />
              </svg>

              <!-- Value -->
              <div class="absolute top-9 start-1/2 transform -translate-x-1/2 text-center">
                <span class="text-2xl font-bold text-[#000000] dark:text-[#000000]">{{ progress }}%</span>
              </div>
            </div>
          </div>
        </template>
      </div>

      <van-tabs v-model:active="active" animated swipeable color="#281c74" :line-width="100">
        <!-- PASS TAB -->
        <van-tab :title="t('อยู่ในเกณฑ์ดี')">
          <template v-if="loadingPass">
            <div class="space-y-4 pt-5 px-2">
              <van-skeleton v-for="n in 6" :key="'pass-'+n" title :row="2" :loading="true" />
            </div>
          </template>

          <div class="space-y-4 pt-5" v-else-if="resPass.length > 0">
            <div class="bg-white px-2" v-for="(item, index) in resPass" :key="index">
              <p class="text-sm text-gray-600 mb-1">
                {{ getI18n(item?.questions_field_name_display, locale) }}
              </p>
            </div>
          </div>

          <SharedNoData v-else />
        </van-tab>

        <!-- FAIL TAB -->
        <van-tab :title="t('ต้องปรับปรุง')">
          <template v-if="loadingFail">
            <div class="space-y-4 pt-5 px-2">
              <van-skeleton v-for="n in 6" :key="'fail-'+n" title :row="2" :loading="true" />
            </div>
          </template>

          <div class="space-y-4 pt-5" v-else-if="resFail.length > 0">
            <div class="bg-white px-2" v-for="(item, index) in resFail" :key="index">
              <p class="text-sm text-gray-600 mb-1">
                {{ getI18n(item?.questions_field_name_display, locale) }}
              </p>
            </div>
          </div>

          <SharedNoData v-else />
        </van-tab>
      </van-tabs>
    </main>

    <NotifyMessage
      v-model:show="toast.show"
      :type="toast.type"
      :title="toast.title"
      :message="toast.message"
      :life="toast.life"
    />
    <NotificationPopup
      v-model:visible="notification.visible"
      :state="notification.state"
      :title="notification.title"
      :detail="notification.detail"
      :timeout="notification.timeout"
      :redirect-url="notification.redirectUrl"
      :auto-close="notification.autoClose"
    />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
})

import { ref, reactive, computed, onMounted } from 'vue'
import { useForm, useField, Form } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'
import * as dataApi from './api/dataApi.js'
import { useI18n } from 'vue-i18n'
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
  autoClose: true,
})

const showNotification = (config) => {
  Object.assign(notification, { visible: true, ...config })
}

const active = ref(0)
const progress = ref(0)
const progressComputed = computed(() => {
  const n = Number(progress.value) || 0
  return n > 1 ? n / 2 : n
})

const loadingPass = ref(true)
const loadingFail = ref(true)
const loadingOverall = computed(() => loadingPass.value && loadingFail.value)

const resPass = ref([])
const resFail = ref([])

const loadSurveyPass = async () => {
  loadingPass.value = true
  try {
    const res = await dataApi.getSurveyAuditPass(route.params.id)
    resPass.value = res.data.data.groups
    progress.value = res.data.data.score_percent
  } catch (error) {
    toast.value = {
      show: true,
      type: 'danger',
      title: error.response?.data?.title || t('คำเตือน'),
      message: error.response?.data?.detail || t('เกิดข้อผิดพลาด'),
      life: null,
    }
    console.error(error)
  } finally {
    loadingPass.value = false
  }
}

const loadSurveyFail = async () => {
  loadingFail.value = true
  try {
    const res = await dataApi.getSurveyAuditFail(route.params.id)
    resFail.value = res.data.data.groups
    progress.value = res.data.data.score_percent
  } catch (error) {
    toast.value = {
      show: true,
      type: 'danger',
      title: error.response?.data?.title || t('คำเตือน'),
      message: error.response?.data?.detail || t('เกิดข้อผิดพลาด'),
      life: null,
    }
    console.error(error)
  } finally {
    loadingFail.value = false
  }
}

onMounted(() => {
  loadSurveyPass()
  loadSurveyFail()
})
</script>

<style scoped>
.transition-all {
  transition: all 1s ease-out;
}

.van-tabs__line {
  width: 120px !important;
  background: #281c74 !important;
}

.van-tab {
  --van-tab-active-text-color: #281c74 !important;
}
</style>