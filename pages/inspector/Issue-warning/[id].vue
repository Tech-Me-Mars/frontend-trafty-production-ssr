<template>
    <div class="min-h-screen bg-zinc-50 flex flex-col">
        <!-- Header -->
        <LayoutsBaseHeader :title="t('ส่งใบเตือน')" :showBack="false">
            <template #right>
                <div class="flex gap-2">
                    <i class="fa-solid fa-xmark cursor-pointer" style="color: white; font-size: 22px;"
                        @click="navigateTo(`/inspector/check/business-tourlist?isBusiness=${route.query.isBusiness}`)"></i>
                </div>
            </template>
        </LayoutsBaseHeader>

        <!-- Form Section -->
        <section class="max-w-lg w-full mx-auto flex-1 px-4 pt-5">
            <!-- ✅ Skeleton Loading -->
            <div v-if="isLoading" class="animate-pulse">
                <div class="h-4 w-24 bg-zinc-200 rounded mb-2"></div>
                <div class="h-10 w-full bg-zinc-200 rounded mb-4"></div>

                <div class="bg-white rounded-xl shadow-sm border border-zinc-100 px-4 pt-7 pb-4">
                    <div class="h-5 w-72 bg-zinc-200 rounded mb-4"></div>

                    <div v-for="n in 3" :key="n" class="mb-3">
                        <div class="flex items-start gap-2">
                            <div class="w-5 h-5 bg-zinc-200 rounded mt-0.5"></div>
                            <div class="flex-1">
                                <div class="h-4 bg-zinc-200 rounded w-[90%] mb-2"></div>
                                <div class="h-3 bg-zinc-200 rounded w-[70%]"></div>
                            </div>
                        </div>
                        <div class="pl-6 mt-2">
                            <div class="h-3 w-20 bg-zinc-200 rounded mb-1"></div>
                            <div class="h-3 w-40 bg-zinc-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ✅ Content -->
            <div v-else>
                <label class="block text-gray-600 mb-1">{{ t('สถานที่') }}</label>
                <InputText :value="getI18n(shopname, locale)" readonly placeholder="" class="w-full mb-4" />

                <div class="bg-white rounded-xl shadow-sm border border-zinc-100 px-4 pt-7 pb-4">
                    <div class="text-base font-semibold text-[#202c54] mb-2">
                        {{ t('ข้อที่ไม่ผ่านเกณฑ์มาตรฐานความปลอดภัย') }}
                    </div>

                    <!-- มีรายการ -->
                    <template v-if="Array.isArray(resInfoShop) && resInfoShop.length > 0">
                        <div v-for="(item, idx) in resInfoShop" :key="idx" class="mb-3">
                            <div class="flex items-start gap-2">
                                <i class="fa-solid fa-circle-xmark text-red-500 text-lg mt-0.5"></i>
                                <span class="text-gray-800 font-medium text-sm">
                                    {{ getI18n(item?.questions_field_name_display, locale) }}
                                </span>
                            </div>
                            <div class="pl-6">
                                <div class="text-xs font-bold text-gray-700 mb-1 mt-1">{{ t('หมายเหตุ') }}</div>
                                <div class="text-xs text-gray-500">
                                    <!-- {{ item?.items[0]?.FieldValue }} -->
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- ❗ ว่าง: ไม่มีข้อมูล -->
                    <div v-else class="py-8 text-center text-zinc-500">
                        <i class="fa-regular fa-folder-open text-2xl mb-2"></i>
                        <div>{{ t('ไม่มีข้อมูล') }}</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ปุ่มล่างสุด -->
        <div class="max-w-lg w-full mx-auto px-4 py-4">
            <Button label="ส่งใบเตือน" @click="confirmWarningCard" :loading="isloadingAxi"
                class="w-full rounded-full !bg-[#202c54] !border-[#202c54] !text-white mb-2" rounded />
            <Button :loading="isloadingAxi" icon="pi pi-print" label="พิมพ์เอกสาร" class="w-full rounded-full" rounded
                outlined />
        </div>

        <ConfirmDialog />
        <NotifyMessage v-model:show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
            :life="toast.life" />
        <NotificationPopup v-model:visible="notification.visible" :state="notification.state"
            :title="notification.title" :detail="notification.detail" :timeout="notification.timeout"
            :redirect-url="notification.redirectUrl" :auto-close="notification.autoClose" />
    </div>
</template>

<script setup>
definePageMeta({ middleware: ['auth'] })

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
    life: null
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
const showNotification = (config) => Object.assign(notification, { visible: true, ...config })

const shopname = ref('')
const resInfoShop = ref(null)
const isLoading = ref(true) // ✅ state โหลด

const loadInFoShop = async () => {
    try {
        isLoading.value = true
        const res = await dataApi.getSurveyWarningBySurveyAudit(route.params.id)
        resInfoShop.value = res.data.data
        shopname.value = res.data.data[0]?.ShopNameI18n || ''
    } catch (error) {
        console.error('Error loading shop info:', error)
    } finally {
        isLoading.value = false
    }
}
onMounted(() => {
    loadInFoShop()
})

const confirm1 = useConfirm()
const confirmWarningCard = (index) => {
    confirm1.require({
        message: `${t('ยืนยันการส่งใบเตือน')}?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: { label: t('ยกเลิก'), severity: 'secondary', outlined: true },
        acceptProps: { label: t('ตกลง') },
        accept: () => { sendWarningCard() },
        reject: () => { }
    })
}

const sendWarningCard = async () => {
    try {
        const payload = { survey_audit_id: route.params.id }
        const res = await dataApi.creatSurvetWarning(payload)
        showNotification({
            state: 'success',
            title: t('บันทึกข้อมูลสำเร็จ'),
            detail: t('ใบเตือนของคุณได้ถูกบันทึกเรียบร้อยแล้ว'),
            timeout: 2000,
            redirectUrl: `/inspector/check/business-tourlist?isBusiness=${route.query.isBusiness}`,
            autoClose: true
        })
    } catch (error) {
        console.error('Error sending warning card:', error)
        toast.value = {
            show: true,
            type: 'danger',
            title: t('ผิดพลาด'),
            message: error?.response?.data?.message || t('เกิดข้อผิดพลาด'),
            life: null
        }
    }
}
</script>
