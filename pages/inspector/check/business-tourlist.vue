<template>
    <div class="min-h-screen bg-zinc-50">
        <LayoutsBaseHeader :title="t('ตรวจสอบรายการธุรกิจแหล่งท่องเที่ยว')" :showBack="true" />

        <section class="max-w-lg mx-auto pt-0 sm:pt-4">
            <van-tabs v-model:active="activeTab" line-width="80" animated swipeable color="#281c74">
                <van-tab :title="t('รอตรวจสอบ')" />
                <van-tab :title="t('ตรวจสอบแล้ว')" />
            </van-tabs>

            <!-- Tab Panel 1: ใบเตือน -->
            <div v-if="activeTab === 0" class="px-3 pt-4">

                <div v-for="(item, index) in resList" :key="index"
                    class="bg-white rounded-sm shadow-sm border border-zinc-200 mb-4 p-4">
                    <div class="font-bold text-lg text-[#202c54] mb-1">
                        {{ getI18n(item.business.shop_name_i18n, locale) }}
                    </div>
                    <div class="text-zinc-500 text-sm mb-3 truncate">
                        {{ getI18n(item?.business?.shop_subdistrict?.subdistrict_name_i18n, locale) }}
                        {{ getI18n(item?.business?.shop_district?.subdistrict_name_i18n, locale) }}
                        {{ getI18n(item?.business?.shop_province?.provinces_name_i18n, locale) }}
                        {{ getI18n(item?.business?.shop_address_i18n, locale) }}</div>
                    <hr class="border-zinc-200 mb-2" />

                    <div class="flex gap-2 mt-3">
                        <Button :label="t('ตรวจสอบ')" :loading="isloadingAxi" severity="primary" variant="outlined"
                            class="w-full" :pt="{
                                label: {
                                    class: 'text-primary-main text-xs'
                                },
                                root: {
                                    class: '!border-primary-main'
                                },

                            }" @click="navigateTo(`/inspector/do-recheck/${item.business_id}/${item.id}`)" />

                    </div>
                </div>
            </div>

            <!-- Tab Panel 2: จัดการใบเตือนแล้ว -->
            <!-- Tab Panel 2: จัดการใบเตือนแล้ว -->
            <!-- Tab Panel 2: จัดการใบเตือนแล้ว -->
            <div v-if="activeTab === 1" class="px-3 pt-4">
                <div v-for="(item, index) in resChecked" :key="item.id || index"
                    class="relative bg-white rounded-sm shadow-sm border border-zinc-200 mb-4 p-4">
                    <!-- Badge 'อีก X วัน' -->
                    <div v-if="Number.isFinite(item?.days_until_due)"
                        class="absolute right-4 top-4 px-3 py-1 rounded-full text-xs font-bold"
                        :class="dueBadgeClass(item.days_until_due)">
                        {{ dueBadgeText(item.days_until_due) }}
                    </div>

                    <div class="flex items-start gap-4">
                        <!-- รูป -->
                        <img :src="item?.business?.ImageProfileURL || item?.business?.image_profile"
                            :alt="getI18n(item?.business?.shop_name_i18n, locale) || ''"
                            class="w-16 h-16 object-cover rounded-md flex-shrink-0" />

                        <div class="flex-1 min-w-0">
                            <!-- ชื่อร้าน -->
                            <div class="font-bold text-lg text-[#202c54] mb-1 truncate">
                                {{ getI18n(item?.business?.shop_name_i18n, locale) }}
                            </div>

                            <!-- ที่อยู่: address + ตำบล/อำเภอ/จังหวัด -->
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

                        <!-- ดาว -->
                        <div class="flex items-center text-orange-500 ml-2">
                            <i class="fa-solid fa-star mr-1"></i>
                            <span class="text-sm font-semibold">
                                {{ item?.business?.star ?? 0 }}
                            </span>
                        </div>
                    </div>

                    <hr class="border-zinc-200 my-3" />

                    <!-- ปุ่ม -->
                    <div class="flex gap-2">
                        <Button :label="t('ตรวจสอบ')" :loading="isloadingAxi" severity="primary" variant="outlined"
                            class="w-full" :pt="{
                                label: {
                                    class: 'text-primary-main text-xs'
                                },
                                root: {
                                    class: '!border-primary-main'
                                },

                            }" @click="navigateTo(`/client/information/${item.id}`)" />
<Button :label="t('มาตรฐานความปลอดภัย')" :loading="isloadingAxi" severity="primary" variant="outlined"
                            class="w-full" :pt="{
                                label: {
                                    class: 'text-primary-main text-xs'
                                },
                                root: {
                                    class: '!border-primary-main'
                                },

                            }" @click="navigateTo(`/client/information/${item.id}`)" />
                    </div>
                </div>
            </div>
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
definePageMeta({
    middleware: ["auth"],
});
import { useForm, useField, Form } from 'vee-validate'
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
const resList = ref([])
const loadList = async () => {
    try {
        const res = await dataApi.getSurveyAuditBusinessTouristWait();
        resList.value = res.data.data;
    } catch (error) {
        toast.value = {
            show: true,
            type: 'danger',
            title: t('ผิดพลาด'),
            message: error?.response?.data?.message || t('เกิดข้อผิดพลาด'),
            life: null
        }
    }
}
const resChecked = ref([])
const loadChecked = async () => {
    try {
        resChecked
        const res = await dataApi.getSurveyAuditBusinessTouristFinish()
        resChecked.value = res.data.data;
    } catch (error) {
        toast.value = {
            show: true,
            type: 'danger',
            title: t('ผิดพลาด'),
            message: error?.response?.data?.message || t('เกิดข้อผิดพลาด'),
            life: null
        }
    }
}
onMounted(() => {
    loadList();
    loadChecked()
})
const activeTab = ref(0)

const GREEN_TH = 50
const YELLOW_TH = 5

const dueBadgeClass = (d) => {
    if (d <= 0) return 'bg-red-500 text-white'
    if (d < YELLOW_TH) return 'bg-yellow-400 text-black' // เหลืองอ่านง่ายบนพื้นเหลือง
    // ช่วงอื่น ๆ ให้เขียว (รวมถึง 5–50 และ >50)
    return 'bg-green-500 text-white'
}

const dueBadgeText = (d) => {
    if (d <= 0) return t('ครบรอบออกตรวจ')
    return `${t('อีก')} ${d} ${t('วัน')}`
}
</script>
