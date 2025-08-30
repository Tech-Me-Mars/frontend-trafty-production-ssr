<style scoped>
/* เส้นขอบซ้ายสีเหลืองแบบในภาพ */
</style>

<template>
    <div class="bg-zinc-100 min-h-screen w-full">
        <LayoutsBaseHeader :title="t('ดูรายละเอียดใบเตือน')" :showBack="true" :backTo="`/inspector/manage-reply`" />

        <main class="max-w-lg w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <!-- Loading / Empty -->
            <div v-if="loading" class="space-y-3">
                <div v-for="n in 3" :key="n" class="bg-white rounded-sm border border-zinc-200 p-4 animate-pulse">
                    <div class="h-4 w-40 bg-zinc-200 rounded mb-2"></div>
                    <div class="h-3 w-28 bg-zinc-200 rounded"></div>
                    <div class="h-3 w-full bg-zinc-200 rounded mt-4"></div>
                </div>
            </div>

            <div v-else-if="warnings.length === 0" class="text-center text-zinc-500 py-10">
                {{ t('ไม่พบข้อมูลใบเตือน') }}
            </div>

            <!-- Cards -->
            <div v-else class="space-y-4">
                <article v-for="(w, wi) in warnings" :key="w.survey_warning_id || wi"
                    class="bg-white rounded-sm border border-zinc-200 card-accent shadow-sm">
                    <!-- Header: ชื่อร้าน + วันที่ -->
                    <header class="flex items-start justify-between gap-3 px-4 pt-3">
                        <h2 class="font-semibold text-zinc-900">
                            {{ getI18n(w?.business?.shop_name_i18n, locale) ||
                                getI18n(w?.business?.business_name_i18n, locale) || '-'
                            }}
                        </h2>
                        <div class="text-sm text-zinc-500 shrink-0">
                            {{ w?.created_at_display || '-' }}
                        </div>
                    </header>

                    <div class="px-4 pb-3">
                        <!-- หัวข้อใบเตือน -->
                        <p class="text-[15px] font-semibold text-red-600 mt-1">
                            {{ getI18n(w?.warning_title_i18n, locale) }}
                        </p>
                        <!-- คำเกริ่น -->
                        <p class="text-sm text-zinc-600 mt-1">
                            {{ getI18n(w?.warning_details_i18n, locale) }}
                        </p>

                        <!-- รายการรายละเอียด -->
                        <ul class="mt-3 space-y-3">
                            <li v-for="(d, di) in (w?.detail || [])" :key="d?.survey_audit_detail_id || di"
                                class=" rounded-lg px-2 py-2.5 ">
                                <div class="flex items-start gap-2">
                                    <i class="fa-solid fa-circle-xmark text-red-600 mt-1"></i>

                                    <div class="flex-1 min-w-0">
                                        <p class="text-[13.5px] text-zinc-800 leading-snug">
                                            {{ getI18n(d?.questions_field_name_display, locale) || '-' }}
                                        </p>

                                        <p class="text-[13px] text-zinc-700 leading-snug mt-1">
                                            <span class="font-semibold text-zinc-800">{{ t('หมายเหตุ') }}: </span>
                                            {{ getI18n(d?.survey_audit_detail_note, locale) || '-' }}
                                        </p>

                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </article>
            </div>
        </main>
    </div>
</template>

<script setup>
// basic ที่ใช้ทุกหน้า
definePageMeta({ middleware: ['auth'] })
import { useI18n } from 'vue-i18n'
import * as dataApi from './api/data.js'

const { t, locale } = useI18n()
const route = useRoute()

const resWarning = ref([])
const loading = ref(true)

const loadWarning = async () => {
    try {
        loading.value = true
        const res = await dataApi.getSurveyWarningAllByBusinessId(route.params.id)
        // กรองให้เป็นอาร์เรย์เสมอ
        resWarning.value = Array.isArray(res?.data?.data) ? res.data.data : []
    } catch (error) {
        // แจ้งเตือนตามระบบของคุณได้
        console.error(error)
    } finally {
        loading.value = false
    }
}
onMounted(loadWarning)


/** แปลงโครงข้อมูลสำหรับแสดงผล (เผื่อมี post-process เพิ่มเติมภายหลัง) */
const warnings = computed(() => resWarning.value)
</script>
