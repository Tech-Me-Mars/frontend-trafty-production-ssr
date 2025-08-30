<template>
  <div class="min-h-screen bg-zinc-100">
    <LayoutsBaseHeader :title="t('ตรวจสอบรายการธุรกิจแหล่งท่องเที่ยว')" :showBack="true" back-to="/inspector/home" />

    <section class="max-w-[430px] mx-auto">
      <van-tabs v-model:active="activeTab" animated swipeable color="#281c74" :line-width="100">
        <!-- TAB 1 -->
        <van-tab :title="t('รอตรวจสอบ')">
          <div class="p-3">
            <!-- ✅ Skeleton รอตรวจสอบ -->
            <template v-if="isLoadingWait">
              <div v-for="n in 3" :key="'sk-wait-'+n" class="bg-white rounded-sm shadow-sm border border-zinc-200 mb-4 p-4">
                <div class="h-5 w-48 bg-zinc-200 rounded animate-pulse mb-2"></div>
                <div class="h-3 w-64 bg-zinc-200 rounded animate-pulse mb-4"></div>
                <div class="flex gap-2">
                  <div class="h-9 bg-zinc-200 rounded w-full animate-pulse"></div>
                </div>
              </div>
            </template>

            <!-- ✅ รายการ -->
            <template v-else>
              <template v-if="resList.length > 0">
                <div v-for="(item, index) in resList" :key="index" class="bg-white rounded-sm shadow-sm border border-zinc-200 mb-4 p-4">
                  <div class="font-bold text-lg text-[#202c54] mb-1">
                    {{ getI18n(item.business.shop_name_i18n, locale) }}
                  </div>
                  <div class="text-zinc-500 text-sm mb-3 truncate">
                    {{ getI18n(item?.business?.shop_subdistrict?.subdistrict_name_i18n, locale) }}
                    {{ getI18n(item?.business?.shop_district?.subdistrict_name_i18n, locale) }}
                    {{ getI18n(item?.business?.shop_province?.provinces_name_i18n, locale) }}
                    {{ getI18n(item?.business?.shop_address_i18n, locale) }}
                  </div>
                  <hr class="border-zinc-200 mb-2" />
                  <div class="flex gap-2 mt-3">
                    <!-- :disabled="item?.survey_keyword !='Pending approval / รออนุมัติ' ? true : false" -->
                    <Button
                      :label="item?.survey_status?.survey_keyword =='Pending approval / รออนุมัติ'? t('ตรวจสอบ') : 'ดำเนินการตรวจสอบ'"
                      :disabled="item?.survey_status?.survey_keyword !='Pending approval / รออนุมัติ' ? true : false"
                      :loading="isloadingAxi"
                      severity="primary"
                      variant="outlined"
                      class="w-full"
                      :pt="{
                        label: { class: 'text-primary-main text-xs' },
                        root: { class: '!border-primary-main' },
                      }"
                      @click="navigateTo(`/inspector/do-recheck/${item.business_id}/${item.id}?isBusiness=${route.query.isBusiness}`)"
                    />
                  </div>
                </div>
              </template>

              <!-- ✅ ว่าง -->
              <div v-else class="bg-white rounded-sm border border-zinc-200 p-6 text-center text-zinc-500">
                <i class="fa-regular fa-folder-open text-2xl mb-2"></i>
                <div>{{ t('ยังไม่มีรายการ') }}</div>
              </div>
            </template>
          </div>
        </van-tab>

        <!-- TAB 2 -->
        <van-tab :title="t('ตรวจสอบแล้ว')">
          <div  class="p-3">
            <!-- ✅ Skeleton ตรวจสอบแล้ว -->
            <template v-if="isLoadingChecked">
              <div v-for="n in 3" :key="'sk-checked-'+n" class="relative bg-white rounded-sm shadow-sm border border-zinc-200 mb-4 p-4">
                <div class="flex items-start gap-4">
                  <div class="w-16 h-16 bg-zinc-200 rounded-md animate-pulse"></div>
                  <div class="flex-1 min-w-0">
                    <div class="h-5 w-56 bg-zinc-200 rounded animate-pulse mb-2"></div>
                    <div class="h-3 w-48 bg-zinc-200 rounded animate-pulse mb-2"></div>
                    <div class="h-3 w-64 bg-zinc-200 rounded animate-pulse"></div>
                  </div>
                  <div class="w-10 h-5 bg-zinc-200 rounded animate-pulse"></div>
                </div>
                <hr class="border-zinc-200 my-3" />
                <div class="flex gap-2">
                  <div class="h-9 bg-zinc-200 rounded w-full animate-pulse"></div>
                  <div class="h-9 bg-zinc-200 rounded w-full animate-pulse"></div>
                </div>
              </div>
            </template>

            <!-- ✅ รายการ -->
            <template v-else>
              <template v-if="resChecked.length > 0">
                <div
                  v-for="(item, index) in resChecked"
                  :key="item.id || index"
                  class="relative bg-white rounded-sm shadow-sm border border-zinc-200 mb-4 p-4"
                >
                  <div
                    v-if="Number.isFinite(item?.days_until_due)"
                    class="absolute right-4 top-4 px-3 py-1 rounded-full text-xs font-bold"
                    :class="dueBadgeClass(item.days_until_due)"
                  >
                    {{ dueBadgeText(item.days_until_due) }}
                  </div>

                  <div class="flex items-start gap-4">
                    <!-- <img
                      :src="item?.business?.ImageProfileURL || item?.business?.image_profile"
                      :alt="getI18n(item?.business?.shop_name_i18n, locale) || ''"
                      class="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    /> -->

                    <div class="flex-1 min-w-0">
                      <div class="font-bold text-lg text-[#202c54] mb-1 truncate">
                        {{ getI18n(item?.business?.shop_name_i18n, locale) }}
                      </div>

                      <div class="text-zinc-500 text-sm mb-1 truncate">
                        {{ getI18n(item?.business?.shop_address_i18n, locale) }}
                      </div>
                      <div class="text-zinc-500 text-sm mb-3 truncate">
                        {{
                          [
                            getI18n(item?.business?.shop_subdistrict?.subdistrict_name_i18n, locale),
                            getI18n(item?.business?.shop_district?.district_name_i18n, locale),
                            getI18n(item?.business?.shop_province?.provinces_name_i18n, locale)
                          ].filter(Boolean).join(' / ')
                        }}
                      </div>
                    </div>

                    <div class="flex items-center text-orange-500 ml-2">
                      <i class="fa-solid fa-star mr-1"></i>
                      <span class="text-sm font-semibold">
                        {{ item?.business?.star ?? 0 }}
                      </span>
                    </div>
                  </div>

                  <hr class="border-zinc-200 my-3" />

                  <div class="flex gap-2">
                    <Button
                      :label="t('ตรวจสอบ')"
                      :loading="isloadingAxi"
                      severity="primary"
                      variant="outlined"
                      class="w-full"
                      :pt="{
                        label: { class: 'text-primary-main text-xs' },
                        root: { class: '!border-primary-main' },
                      }"
                      @click="navigateTo(`/inspector/do-recheck/${item.business_id}/${item.id}?isBusiness=${route.query.isBusiness}`)"
                    />
                    <Button
                      :label="t('มาตรฐานความปลอดภัย')"
                      :loading="isloadingAxi"
                      severity="primary"
                      variant="outlined"
                      class="w-full"
                      :pt="{
                        label: { class: 'text-primary-main text-xs' },
                        root: { class: '!border-primary-main' },
                      }"
                      @click="navigateTo(`/inspector/policy/${item?.business_id}?isBusiness=${route.query.isBusiness}`)"
                    />
                  </div>
                </div>
              </template>

              <!-- ✅ ว่าง -->
              <div v-else class="bg-white rounded-sm border border-zinc-200 p-6 text-center text-zinc-500">
                <i class="fa-regular fa-folder-open text-2xl mb-2"></i>
                <div>{{ t('ยังไม่มีรายการ') }}</div>
              </div>
            </template>
          </div>
        </van-tab>
      </van-tabs>
    </section>

    <NotifyMessage v-model:show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message" :life="toast.life" />
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
definePageMeta({ middleware: ['auth'] })

import { useForm, useField, Form } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'
import { request } from '@/service/AxiosService.js'
import * as dataApi from './api/data.js'
import { useI18n } from 'vue-i18n'
const { t, locale, setLocale } = useI18n()
const isloadingAxi = useState('isloadingAxi')
const route = useRoute()
const router = useRouter()

const toast = ref({ show: false, type: null, title: null, message: null, life: null })
const notification = reactive({ visible: false, state: 'success', title: '', detail: '', timeout: 0, redirectUrl: null, autoClose: true })
const showNotification = (config) => Object.assign(notification, { visible: true, ...config })

const resList = ref([])
const resChecked = ref([])
const activeTab = ref(0)

// ✅ state โหลดแต่ละแท็บ
const isLoadingWait = ref(true)
const isLoadingChecked = ref(true)

const loadList = async () => {
  try {
    isLoadingWait.value = true
    const modulepath = await getModulePathByRoleName()
    let route_url = ''
    if (route.query.isBusiness == 'true') {
      route_url = `/api/v1/${modulepath}/survey_audit/get-survey-audit-business-tourist-wait`
    } else if (route.query.isBusiness == 'false') {
      route_url = `/api/v1/${modulepath}/survey_audit/get-survey-audit-tourist-wait`
    } else {
      return navigateTo('/inspector/home')
    }
    const res = await request('get', route_url, {}, true)
    resList.value = res.data.data || []
  } catch (error) {
    toast.value = { show: true, type: 'danger', title: t('ผิดพลาด'), message: error?.response?.data?.message || t('เกิดข้อผิดพลาด'), life: null }
  } finally {
    isLoadingWait.value = false
  }
}

const loadChecked = async () => {
  try {
    isLoadingChecked.value = true
    const modulepath = await getModulePathByRoleName()
    let route_url = ''
    if (route.query.isBusiness == 'true') {
      route_url = `/api/v1/${modulepath}/survey_audit/get-survey-audit-business-tourist-finish`
    } else if (route.query.isBusiness == 'false') {
      route_url = `/api/v1/${modulepath}/survey_audit/get-survey-audit-tourist-finish`
    }
    const res = await request('get', route_url, {}, true)
    resChecked.value = res.data.data || []
  } catch (error) {
    toast.value = { show: true, type: 'danger', title: t('ผิดพลาด'), message: error?.response?.data?.message || t('เกิดข้อผิดพลาด'), life: null }
  } finally {
    isLoadingChecked.value = false
  }
}

onMounted(() => {
  loadList()
  loadChecked()
})

const GREEN_TH = 50
const YELLOW_TH = 5
const dueBadgeClass = (d) => {
  if (d <= 0) return 'bg-red-500 text-white'
  if (d < YELLOW_TH) return 'bg-yellow-400 text-black'
  return 'bg-green-500 text-white'
}
const dueBadgeText = (d) => (d <= 0 ? t('ครบรอบออกตรวจ') : `${t('อีก')} ${d} ${t('วัน')}`)
</script>
