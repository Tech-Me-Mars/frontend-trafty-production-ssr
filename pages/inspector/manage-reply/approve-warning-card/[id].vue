<template>
    <ClientOnly >
    <div class="min-h-screen bg-zinc-100">
        <LayoutsBaseHeader :title="t('ดูรายละเอียดใบเตือน')" :showBack="true" backto="/inspector/manage-reply" />

        <section class="max-w-lg p-4 mx-auto">
            <Form @submit="onSubmit" class="space-y-3">
                <!-- Head -->
                <div class="px-4">



                </div>

                <!-- info tip -->
                <div class="rounded-sm border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800 text-sm">
                    <h1 class="text-lg"><i class="fa-solid fa-triangle-exclamation"></i> {{ t('ได้รับการตอบกลับใบเตือน')
                    }}</h1>

                    <p class="">
                        {{ t('โปรดตรวจสอบมาตรฐานเพื่ออนุมัติใบเตือน') }}
                        <span v-if="!loading && fields.length" class="">{{ t('ทั้งหมด') }} {{ fields.length }} {{
                            t('ข้อ') }}
                        </span>
                    </p>

                    <i class="fa-regular fa-circle-question mr-1"></i>
                    {{ t('เลือก “มี/ปฏิบัติ” หากธุรกิจแก้ไขแล้ว หรือ “ไม่มี/ไม่ปฏิบัติ/ไม่มีรายการ” หากยังไม่แก้ไข') }}
                </div>

                <!-- Skeleton Loading -->
                <div v-if="loading" class="space-y-3">
                    <div v-for="n in 3" :key="n" class="rounded-sm border bg-white p-4 animate-pulse">
                        <div class="h-4 w-3/4 bg-zinc-200 rounded mb-2"></div>
                        <div class="h-3 w-5/6 bg-zinc-200 rounded mb-1"></div>
                        <div class="h-3 w-2/3 bg-zinc-200 rounded mb-3"></div>
                        <div class="h-24 w-24 bg-zinc-200 rounded mb-3"></div>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="h-10 bg-zinc-200 rounded"></div>
                            <div class="h-10 bg-zinc-200 rounded"></div>
                        </div>
                    </div>
                </div>

                <!-- Dynamic fields -->
                <template v-else>
                    <div v-if="fields.length > 0" v-for="(item, index) in fields" :key="index"
                        class="mb-2 card max-w-md px-2 py-3 rounded-sm border bg-white shadow-sm hover:shadow-md transition"
                        :data-row="index">
                        <div class="flex items-start gap-3 mb-2">
                            <span
                                class="inline-flex h-6 w-6 items-center justify-center rounded-full  text-red-600">
                                <i class="fa-solid fa-circle-xmark text-[13px]"></i>
                            </span>

                            <div class="flex-1">
                                <p class="font-semibold text-zinc-900 leading-snug">
                                    {{ getI18n(item.value.questions_field_name_display, locale) }}
                                </p>

                                <!-- หมายเหตุ -->
                                <div class="mt-1">
                                    <span class="font-semibold text-zinc-800 text-sm">{{ t('หมายเหตุ') }}:</span>
                                    <p class="text-[13px] text-zinc-700 leading-snug">
                                        {{ getI18n(item?.value?.survey_audit_detail_note, locale) || '-' }}
                                    </p>
                                </div>

                                <!-- ตอบกลับ -->
                                <div class="mt-1">
                                    <span class="font-semibold text-zinc-800 text-sm">{{ t('ตอบกลับ') }}:</span>
                                    <p class="text-[13px] text-zinc-700 leading-snug">
                                        {{ item?.value?.respond_warning_detail_note || '-' }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- รูปตอบกลับ -->
                        <div class="mt-2" v-if="item.value.respond_warning_detail_img">
                            <div class="w-24 h-24 rounded-md border bg-zinc-50 overflow-hidden flex items-center justify-center"
                                :class="item.value.respond_warning_detail_img ? 'p-0' : 'p-2'">
                                <img :src="useImage(item.value.respond_warning_detail_img)" alt="respond image"
                                    class="w-full h-full object-cover" />
                            </div>
                        </div>

                        <!-- Radio Approve (แบบ segmented) -->
                        <div class="mt-3">
                            <div class="grid grid-cols-2 gap-3 sm:max-w-sm">
                                <div class="flex items-center gap-2 px-2 py-1" >
                                    <RadioButton :inputId="`approve-yes-${index}`" name="approve" value="1"
                                        v-model="item.value.respond_warning_approve" />
                                    <label :for="`approve-yes-${index}`" class="text-sm cursor-pointer">
                                        {{ t('มี/ปฏิบัติ') }}
                                    </label>
                                </div>

                                <div class="flex items-center gap-2 px-2 py-1" >
                                    <RadioButton :inputId="`approve-no-${index}`" name="approve" value="0"
                                        v-model="item.value.respond_warning_approve" />
                                    <label :for="`approve-no-${index}`" class="text-sm cursor-pointer">
                                        {{ t('ไม่มีรายการ/ไม่ปฏิบัติ') }}
                                    </label>
                                </div>
                            </div>

                            <!-- error -->
                            <p v-if="errors[`responses_approve[${index}].respond_warning_approve`]"
                                class="mt-2 text-sm text-red-600">
                                {{ errors[`responses_approve[${index}].respond_warning_approve`] }}
                            </p>
                        </div>
                    </div>

                    <SharedNoData v-else />
                </template>

                <!-- Submit -->
                <div class="max-w-sm mx-auto ">
                    <Button :loading="submitting" type="submit" :label="t('อนุมัติใบเตือน')"
                        class="w-full !h-12 rounded-full shadow-sm" rounded />
                </div>
            </Form>
        </section>
        <NotifyMessage v-model:show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
            :life="toast.life" />
        <NotificationPopup v-model:visible="notification.visible" :state="notification.state"
            :title="notification.title" :detail="notification.detail" :timeout="notification.timeout"
            :redirect-url="notification.redirectUrl" :auto-close="notification.autoClose"
            />

    </div>
    </ClientOnly>
</template>

<script setup>

// basic ที่ใช้ทุกหน้า
definePageMeta({
    middleware: ["auth"],
});
import { useForm, useFieldArray, useField, Form } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'
import * as dataApi from "./api/data.js";
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



/* state */
const loading = ref(true)
const submitting = ref(false)

/* validate */
const schema = toTypedSchema(
    zod.object({
        responses_approve: zod.array(
            zod.object({
                survey_warning_respond_details_id: zod.string().min(1),
                survey_audit_details_id: zod.string().min(1),
                respond_warning_approve: zod
                    .enum(['1', '0'], { required_error: t('กรุณาเลือก') })
                    .or(zod.string().min(1, t('กรุณาเลือก')))
            })
        ).default([])
    })
)

const { handleSubmit, errors, setFieldError } = useForm({
    validationSchema: schema,
    initialValues: { responses_approve: [] }
})

const { fields, replace } = useFieldArray('responses_approve')

/* load */
const survey_audit_id = ref('')
const loadWarningApproveList = async () => {
    loading.value = true
    try {
        const res = await dataApi.getSurveyWarningBySurveyWarningId(route.params.id)
        const list = res?.data?.data || []

        survey_audit_id.value = list?.[0]?.survey_audit_id || String(route.params.id || '')

        const mapped = list.map(e => ({
            // payload
            survey_warning_respond_details_id: e?.id || '',
            survey_audit_details_id: e?.survey_audit_detail_id || '',
            respond_warning_approve: '',

            // display
            questions_field_name_display: e?.questions_field_name_display,
            survey_audit_detail_note: e?.survey_audit_detail_note,
            respond_warning_detail_note: e?.respond_warning_detail_note || '',
            respond_warning_detail_img: e?.respond_warning_detail_img || ''
        }))

        replace(mapped)
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
}
onMounted(loadWarningApproveList)

/* scroll to first error */
const scrollToFirstError = () => {
    // หา index แรกที่ยังไม่เลือกค่า
    const idx = fields.value.findIndex(f => !f.value.respond_warning_approve)
    if (idx >= 0) {
        const el = document.querySelector(`[data-row="${idx}"]`)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
}

/* submit */
const stripPercent = (v) => {
    if (v == null) return ''
    const n = Number(String(v).replace('%', '').trim())
    return Number.isFinite(n) ? String(n) : ''
}

const onSubmit = handleSubmit(
    async (values) => {
        try {
            submitting.value = true

            const payload = {
                survey_audit_id: survey_audit_id.value,
                responses_approve: values.responses_approve.map(v => ({
                    survey_warning_respond_details_id: v.survey_warning_respond_details_id,
                    survey_audit_details_id: v.survey_audit_details_id,
                    respond_warning_approve: String(v.respond_warning_approve) // "1" | "0"
                }))
            }

            const res = await dataApi.updateSurveyWarningRespond(route.params.id, payload)

            // --- ดึง dialog จาก API แล้ว normalize เป็น query params ---
            const dialog = res?.data?.dialog || {}
            const query = {
                survey_audit_id:survey_audit_id.value,
                state: (dialog.state || 'success'),
                title: (dialog.title || t('ตรวจสอบมาตรฐานความปลอดภัยสำเร็จ')),
                IsPass: String(dialog.IsPass ?? ''),                       // true/false -> string
                detail: (dialog.detail || ''),
                ScorePercent: stripPercent(dialog.ScorePercent),           // "100%" -> "100"
                ScorePercentFailed: stripPercent(dialog.ScorePercentFailed),
                status_text: (dialog.status_text || ''),
                // ใส่ BusinessId ถ้ามีใน route เดิม
                ...(route.query?.BusinessId ? { BusinessId: String(route.query.BusinessId) } : {})
            }

            // --- ไปหน้า success/error พร้อม query ---
            await navigateTo({
                path: '/inspector/manage-reply/approve-warning-card/state-finish',
                query
            })
        } catch (error) {
            console.error(error)
            toast.value = {
                show: true,
                type: 'danger',
                title: t('ผิดพลาด'),
                message: error?.response?.data?.message || t('เกิดข้อผิดพลาด'),
                life: null
            }
        } finally {
            submitting.value = false
        }
    },
    // onInvalid -> เลื่อนหน้าไปยัง error แรก
    () => scrollToFirstError()
)
</script>