<template>
    <div class="min-h-screen bg-zinc-50">
        <LayoutsBaseHeader :title="t('จัดการใบเตือน')" :showBack="true" back-to="/inspector/home" />

        <section class="mx-auto w-full px-3 sm:px-4 pt-0 sm:pt-4">
            <!-- Tabs -->
            <van-tabs v-model:active="activeTab" :line-width="80" animated swipeable color="#281c74">
                <!-- TAB: ใบเตือนที่ส่ง -->
                <van-tab :title="t('ใบเตือนที่ส่ง')">
                    <div class="max-w-lg mx-auto">
                        <!-- Loading skeleton -->
                        <div v-if="loading" class="space-y-3 py-3">
                            <div v-for="n in 4" :key="n"
                                class="bg-white rounded-xl shadow-sm border border-zinc-100 p-4 animate-pulse">
                                <div class="h-4 w-40 bg-zinc-200 rounded mb-2"></div>
                                <div class="h-3 w-28 bg-zinc-200 rounded"></div>
                            </div>
                        </div>

                        <!-- Empty state -->
                        <div v-else-if="resWarningCards.length === 0" class="py-10 text-center text-zinc-500">
                            <!-- <i class="fa-regular fa-envelope-open-text text-3xl mb-3"></i> -->
                            <p>{{ t('ยังไม่มีใบเตือน') }}</p>
                        </div>

                        <!-- Cards list -->
                        <div v-else class="grid grid-cols-1 gap-3 py-3
                                 sm:grid-cols-1
                                 md:grid-cols-1
                                 lg:grid-cols-1">
                            <button v-for="(c, idx) in resWarningCards" :key="c.id || idx" type="button"
                                @click="goToDetail(c)" class="group text-left bg-white rounded-sm shadow-sm border border-zinc-100 px-4 py-3
                         hover:shadow-md hover:border-zinc-200 transition-all duration-200 w-full">
                                <div class="flex items-start">
                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-center gap-2">
                                            <p class="font-semibold text-zinc-900 truncate">
                                                {{ getI18n(c.Business.shop_name_i18n) }}
                                            </p>
                                        </div>
                                        <p class="text-sm text-zinc-500 mt-1">
                                            {{ t('จำนวนใบเตือน') }}: {{ c.warning_count ?? 0 }}
                                        </p>
                                    </div>

                                    <!-- Right icon (lock) -->
                                    <span class="inline-flex items-center justify-center h-8 w-8 rounded-lg
         bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200" aria-hidden="true">
                                        <i class="fa-solid fa-file text-base"></i>
                                    </span>
                                </div>
                            </button>

                        </div>
                    </div>
                </van-tab>

                <!-- TAB: การตอบกลับ -->
                <van-tab :title="t('การตอบกลับ')">
                    <div class="max-w-lg mx-auto">
                        <!-- Loading -->
                        <div v-if="loading" class="space-y-3">
                            <div v-for="n in 3" :key="n"
                                class="bg-white rounded-xl border border-zinc-200 p-4 animate-pulse">
                                <div class="h-4 w-40 bg-zinc-200 rounded mb-3"></div>
                                <div class="h-3 w-28 bg-zinc-200 rounded"></div>
                                <div class="h-20 w-full bg-zinc-200 rounded mt-4"></div>
                            </div>
                        </div>

                        <!-- Empty -->
                        <div v-else-if="resWarningRespondCards.length === 0" class="text-center text-zinc-500 py-10">
                            {{ t('ยังไม่มีการตอบกลับ') }}
                        </div>

                        <!-- Cards -->
                        <div v-else class="space-y-3 py-3">
                            <article v-for="(row, idx) in resWarningRespondCards" :key="row.id || idx"
                                class="bg-white rounded-sm border border-zinc-200 shadow-sm px-3.5 py-3">
                                <!-- Header: avatar + shop name + address -->
                                <div class="flex items-start gap-3">
                                    <img :src="useImage(row?.ImageProfileURL)" alt="cover"
                                        class="h-12 w-12 rounded-sm object-cover border border-zinc-200" />
                                    <div class="min-w-0 flex-1">
                                        <p class="font-semibold text-zinc-900 truncate">
                                            {{ getI18n(row?.business?.shop_name_i18n) || '-' }}
                                        </p>
                                        <p class="text-xs text-zinc-500 truncate">
                                            {{ getI18n(row?.business?.shop_address_i18n) ||'-' }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Title (แดง) + subtitle เทา -->
                                <div class="mt-3">
                                    <p class="text-[15px] font-semibold text-red-600">
                                        {{ t('ธุรกิจของคุณไม่ผ่านเกณฑ์') }}
                                    </p>
                                    <p class="text-sm text-zinc-600 mt-0.5">
                                        {{ t('ตามหัวข้อต่อไป...') }}
                                    </p>
                                </div>

                                <!-- Respond box -->
                                <div class="mt-3 border rounded-lg px-3 py-2.5 bg-zinc-50">
                                    <p class="text-sm text-zinc-800">
                                        <span class="font-semibold">{{ t('การตอบกลับ') }} :</span>
                                        {{ getI18n(row?.respond_warning_note_i18n) ||
                                            t('ธุรกิจได้มีการตอบกลับใบเตือนของคุณ') }}
                                    </p>
                                </div>

                                <!-- CTA -->
                                <div class="mt-3">
                                    <Button  :label="t('ดูรายละเอียด')" :loading="isloadingAxi" severity="primary"
                            variant="outlined" class="w-full" :pt="{
                                label: {
                                    class: 'text-primary-main'
                                },
                                root: {
                                    class: '!border-primary-main'
                                },

                            }" @click="navigateTo(`/inspector/manage-reply/approve-warning-card/${row?.survey_warning_id}`)" />
                                </div>
                            </article>
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </section>

        <NotifyMessage v-model:show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
            :life="toast.life" />
        <NotificationPopup v-model:visible="notification.visible" :state="notification.state"
            :title="notification.title" :detail="notification.detail" :timeout="notification.timeout"
            :redirect-url="notification.redirectUrl" :auto-close="notification.autoClose"
            @close="onNotificationClose" />
    </div>
</template>

<script setup>
// basic ที่ใช้ทุกหน้า
definePageMeta({ middleware: ['auth'] })
import { useI18n } from 'vue-i18n'
import * as dataApi from './api/data.js'

const { t, locale } = useI18n()
const isloadingAxi = useState('isloadingAxi')
const route = useRoute()
const router = useRouter()

const toast = ref({ show: false, type: null, title: null, message: null, life: null })
const notification = reactive({
    visible: false, state: 'success', title: '', detail: '', timeout: 0,
    redirectUrl: null, autoClose: true
})
const showNotification = (config) => Object.assign(notification, { visible: true, ...config })
const onNotificationClose = () => { notification.visible = false }

const activeTab = ref(0)

// data

const loading = ref(true)

const resWarningCards = ref([])
const loadWarningCards = async () => {
    try {
        loading.value = true
        const res = await dataApi.getSurveyWarningByStation()
        // เรียงจาก index น้อย -> มาก ถ้ามีฟิลด์ index
        const data = Array.isArray(res?.data?.data) ? res.data.data.slice() : []
        data.sort((a, b) => (a?.index ?? 0) - (b?.index ?? 0))
        resWarningCards.value = data
    } catch (error) {
        toast.value = {
            show: true, type: 'danger', title: t('ผิดพลาด'),
            message: error?.response?.data?.message || t('เกิดข้อผิดพลาด'), life: null
        }
        console.error(error)
    } finally {
        loading.value = false
    }
}

const resWarningRespondCards = ref([])
const loadWarningRespondCards = async () => {
    try {
        loading.value = true
        const res = await dataApi.getSurveyWarningResponseByStation()
        resWarningRespondCards.value = res.data.data
    } catch (error) {
        toast.value = {
            show: true, type: 'danger', title: t('ผิดพลาด'),
            message: error?.response?.data?.message || t('เกิดข้อผิดพลาด'), life: null
        }
        console.error(error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadWarningCards()
    loadWarningRespondCards()
})

// click card -> ไปหน้า detail (ปรับ path ตามระบบจริง)
const goToDetail = (card) => {
    // ตัวอย่าง path: /inspector/warning/<businessId>/<surveyWarningId>
    navigateTo(`/inspector/manage-reply/already-sent/${card?.Business?.id}`)
}
</script>