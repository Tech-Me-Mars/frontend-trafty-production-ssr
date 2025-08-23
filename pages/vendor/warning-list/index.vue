<template>
  <div class="min-h-screen bg-zinc-100">
    <LayoutsBaseHeader :title="t('ใบเตือน')" :showBack="true" :backTo="`/vendor/manage-business/home/${route.query.BusinessId}`" />
    <section class="max-w-[430px] mx-auto">
      <van-tabs v-model:active="activeTab" :line-width="100" animated color="#202c54">
        <!-- ใบเตือน (รอจัดการ) -->
        <van-tab :title="t('ใบเตือน')" class="pt-5">
          <div class="px-2">
            <!-- ✅ Skeleton -->
            <template v-if="isLoadingWait">
              <div v-for="n in 3" :key="'sk-wait-'+n" class="bg-white rounded-sm shadow-sm border border-zinc-200 p-4 mb-4 animate-pulse">
                <div class="flex gap-3 items-start">
                  <div class="w-18 h-14 rounded-md bg-zinc-200 border border-zinc-200"></div>
                  <div class="flex-1 min-w-0">
                    <div class="h-4 w-44 bg-zinc-200 rounded mb-2"></div>
                    <div class="h-3 w-56 bg-zinc-200 rounded"></div>
                  </div>
                </div>
                <div class="mt-3 mb-3">
                  <div class="h-4 w-48 bg-zinc-200 rounded mb-2"></div>
                  <div class="h-3 w-64 bg-zinc-200 rounded"></div>
                </div>
                <div class="flex gap-2 mt-3">
                  <div class="h-9 bg-zinc-200 rounded w-full"></div>
                </div>
              </div>
            </template>

            <!-- ✅ Content -->
            <template v-else>
              <div
                v-if="resWaitSurveyWarning.length > 0"
                v-for="item in resWaitSurveyWarning"
                :key="item.id"
                class="bg-white rounded-sm shadow-sm border border-zinc-200 p-4 mb-4"
              >
                <!-- บรรทัดบน: รูป + ชื่อร้าน + ที่อยู่ -->
                <div class="flex gap-3 items-start">
                  <img
                    :src="useImage(item.ImageProfileURL)"
                    class="rounded-md w-14 h-14 object-cover border border-zinc-200"
                    :alt="getI18n(item.Business?.shop_name_i18n, locale)"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="font-bold text-base text-[#202c54] truncate">
                      {{ getI18n(item.Business?.shop_name_i18n, locale) }}
                    </div>
                    <div class="text-zinc-500 text-sm truncate">
                      {{ formatShopAddress(item.Business) }}
                    </div>
                  </div>
                </div>

                <!-- ข้อความเตือน -->
                <div class="mt-3 mb-3">
                  <div class="font-semibold text-[#202c54] text-sm mb-0.5">
                    {{ getI18n(item.warning_title_i18n, locale) }}
                  </div>
                  <div class="text-zinc-500 text-sm">
                    {{ getI18n(item.warning_details_i18n, locale) }}
                  </div>
                </div>

                <!-- ปุ่ม -->
                <div class="flex gap-2 mt-3">
                  <Button
                    outlined
                    class="w-full"
                    :pt="{
                      label: { class: 'text-primary-main' },
                      root: { class: '!border-primary-main' }
                    }"
                    @click="navigateTo(`/vendor/warning-list/reply/${item.id}?BusinessId=${route.query.BusinessId}`)"
                  >
                    {{ t('ดูรายละเอียด') }}
                  </Button>
                </div>
              </div>

              <!-- ✅ Empty -->
              <SharedNoData v-else />
            </template>
          </div>
        </van-tab>
        
        <!-- จัดการใบเตือนแล้ว -->
        <van-tab :title="t('จัดการใบเตือนแล้ว')" class="">
          <div class="p-3">
            <!-- ✅ Skeleton -->
            <template v-if="isLoadingFinish">
              <div v-for="n in 3" :key="'sk-finish-'+n" class="bg-white rounded-sm shadow-sm border border-zinc-200 p-4 mb-4 animate-pulse">
                <div class="flex gap-3 items-start">
                  <div class="w-14 h-14 rounded-sm bg-zinc-200 border border-zinc-200"></div>
                  <div class="flex-1 min-w-0">
                    <div class="h-4 w-40 bg-zinc-200 rounded mb-2"></div>
                    <div class="h-3 w-56 bg-zinc-200 rounded"></div>
                  </div>
                </div>
                <div class="mt-3 mb-3">
                  <div class="h-4 w-48 bg-zinc-200 rounded mb-2"></div>
                  <div class="h-3 w-64 bg-zinc-200 rounded"></div>
                </div>
                <div class="flex gap-2 mt-3">
                  <div class="h-9 bg-zinc-200 rounded w-full"></div>
                </div>
              </div>
            </template>

            <!-- ✅ Content -->
            <template v-else>
              <div
                v-if="resFinishSurveyWarning.length > 0"
                v-for="item in resFinishSurveyWarning"
                :key="item.id"
                class="bg-white rounded-sm shadow-sm border border-zinc-200 p-4 mb-4"
              >
                <!-- บรรทัดบน: รูป + ชื่อร้าน + ที่อยู่ -->
                <div class="flex gap-3 items-start">
                  <img
                    :src="useImage(item.ImageProfileURL)"
                    class="rounded-sm w-14 h-14 object-cover border border-zinc-200"
                    :alt="getI18n(item.Business?.shop_name_i18n, locale)"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="font-bold text-base text-[#202c54] truncate">
                      {{ getI18n(item.Business?.shop_name_i18n, locale) }}
                    </div>
                    <div class="text-zinc-500 text-sm truncate">
                      {{ formatShopAddress(item.Business) }}
                    </div>
                  </div>
                </div>

                <!-- ข้อความเตือน -->
                <div class="mt-3 mb-3">
                  <div class="font-semibold text-[#202c54] text-sm mb-0.5">
                    {{ getI18n(item.warning_title_i18n, locale) }}
                  </div>
                  <div class="text-zinc-500 text-sm">
                    {{ getI18n(item.warning_details_i18n, locale) }}
                  </div>
                </div>

                <!-- ปุ่ม -->
                <div class="flex gap-2 mt-3">
                  <Button
                    outlined
                    class="w-full"
                    :pt="{
                      label: { class: 'text-primary-main' },
                      root: { class: '!border-primary-main' }
                    }"
                    @click="navigateTo(`/vendor/warning-list/detail/${item.id}?BusinessId=${route.query.BusinessId}`)"
                  >
                    {{ t('ดูรายละเอียด') }}
                  </Button>
                </div>
              </div>

              <!-- ✅ Empty -->
              <SharedNoData v-else />
            </template>
          </div>
        </van-tab>

        
      </van-tabs>
    </section>
  </div>

  <!-- คอมโพเนนต์แจ้งเตือน -->
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
</template>

<script setup>
definePageMeta({ middleware: ['auth'] })

import { useForm, useField, Form } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'
import * as dataApi from './api/data.js'
import { useI18n } from 'vue-i18n'
const { t, locale, setLocale } = useI18n()
const isloadingAxi = useState('isloadingAxi')
const route = useRoute()
const router = useRouter()
const toast = ref({ show: false, type: null, title: null, message: null, life: null })
const notification = reactive({ visible: false, state: 'success', title: '', detail: '', timeout: 0, redirectUrl: null, autoClose: true })
const showNotification = (config) => Object.assign(notification, { visible: true, ...config })

const activeTab = ref(0)

const resFinishSurveyWarning = ref([])
const resWaitSurveyWarning = ref([])

const isLoadingFinish = ref(true) // ✅ loading ของแท็บ "จัดการใบเตือนแล้ว"
const isLoadingWait = ref(true)   // ✅ loading ของแท็บ "ใบเตือน"

const loadFinishSurveyWarning = async () => {
  try {
    isLoadingFinish.value = true
    const response = await dataApi.getFinisgSurveyWarning()
    resFinishSurveyWarning.value = response.data.data
  } catch (error) {
    console.error(error)
  } finally {
    isLoadingFinish.value = false
  }
}

const loadWaitSurveyWarning = async () => {
  try {
    isLoadingWait.value = true
    const response = await dataApi.getwaitSurveyWarning()
    resWaitSurveyWarning.value = response.data.data
  } catch (error) {
    console.error(error)
  } finally {
    isLoadingWait.value = false
  }
}

onMounted(() => {
  loadFinishSurveyWarning()
  loadWaitSurveyWarning()
})

const formatShopAddress = (b) => {
  if (!b) return ''
  const prov = getI18n(b?.shop_province?.provinces_name_i18n, locale.value)
  const dist = getI18n(b?.shop_district?.district_name_i18n, locale.value)
  const subd = getI18n(b?.shop_subdistrict?.subdistrict_name_i18n, locale.value)
  const parts = [subd && `${t('ตำบล')} ${subd}`, dist && `${t('อำเภอ')} ${dist}`, prov && prov].filter(Boolean)
  return parts.join(' ')
}

const getBusinessImage = (b) => {
  if (!b) return placeholder
  if (b.ImageProfileURL) return b.ImageProfileURL
  if (b.image_profile) return fileBase + b.image_profile
  return placeholder
}
</script>
