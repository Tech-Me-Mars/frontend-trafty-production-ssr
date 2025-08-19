<template>
    <div class="min-h-screen bg-zinc-100">
        <LayoutsBaseHeader :title="t('ใบเตือน')" :showBack="true" />
        <section class="max-w-lg mx-auto pt-0 sm:pt-4">
            <van-tabs v-model:active="activeTab" animated color="#202c54">
                <!-- ใบเตือน -->
                <van-tab :title="t('จัดการใบเตือนแล้ว')" class="pt-5">
                    <div class="px-2">
                        <div v-if="resFinishSurveyWarning.length > 0" v-for="item in resFinishSurveyWarning"
                            :key="item.id" class="bg-white rounded-xl shadow-sm border border-zinc-200 p-4 mb-4">
                            <!-- บรรทัดบน: รูป + ชื่อร้าน + ที่อยู่ -->
                            <div class="flex gap-3 items-start">
                                <img :src="item.ImageProfileURL"
                                    class="rounded-md w-18 h-14 object-cover border border-zinc-200"
                                    :alt="getI18n(item.Business?.shop_name_i18n, locale)" />
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
                                <button @click="navigateTo(`/vendor/warning-list/detail/${item.id}?BusinessId=${route.query.BusinessId}`)"
                                    class="flex-1 border border-[#202c54] text-[#202c54] rounded-lg py-2 transition hover:bg-[#202c54] hover:text-white text-sm font-medium">
                                    {{ t('ดูรายละเอียด') }}
                                </button>
                            </div>
                        </div>
                        <SharedNoData v-else />
                    </div>


                </van-tab>

                <!-- จัดการใบเตือนแล้ว -->
                <!-- ใบเตือน -->
                <van-tab :title="t('ใบเตือน')" class="pt-5">
                    <div class="px-2">
                        <div v-if="resWaitSurveyWarning.length > 0" v-for="item in resWaitSurveyWarning" :key="item.id"
                            class="bg-white rounded-xl shadow-sm border border-zinc-200 p-4 mb-4">
                            <!-- บรรทัดบน: รูป + ชื่อร้าน + ที่อยู่ -->
                            <div class="flex gap-3 items-start">
                                <img :src="item.ImageProfileURL"
                                    class="rounded-md w-18 h-14 object-cover border border-zinc-200"
                                    :alt="getI18n(item.Business?.shop_name_i18n, locale)" />
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
                                <button @click="navigateTo(`/vendor/warning-list/reply/${item.id}?BusinessId=${route.query.BusinessId}`)"
                                    class="flex-1 border border-[#202c54] text-[#202c54] rounded-lg py-2 transition hover:bg-[#202c54] hover:text-white text-sm font-medium">
                                    {{ t('ดูรายละเอียด') }}
                                </button>
                            </div>
                        </div>
                        <SharedNoData v-else />
                    </div>
                </van-tab>
            </van-tabs>


        </section>
    </div>
    <NotifyMessage v-model:show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
        :life="toast.life" />
    <NotificationPopup v-model:visible="notification.visible" :state="notification.state" :title="notification.title"
        :detail="notification.detail" :timeout="notification.timeout" :redirect-url="notification.redirectUrl"
        :auto-close="notification.autoClose" />
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

const activeTab = ref(0)

const resFinishSurveyWarning = ref([])
const loadFinishSurveyWarning = async () => {

    try {
        const response = await dataApi.getFinisgSurveyWarning()
        resFinishSurveyWarning.value = response.data.data
    } catch (error) {
        console.error(error)
    }
}

const resWaitSurveyWarning = ref([])
const loadWaitSurveyWarning = async () => {

    try {
        const response = await dataApi.getwaitSurveyWarning()
        resWaitSurveyWarning.value = response.data.data
    } catch (error) {
        console.error(error)
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
    // รูปในภาพเป็นแนว “ตำบล … อำเภอ … จังหวัด …”
    // คุณอาจสลับคำหน้า/หลังได้ตามสไตล์ที่ต้องการ
    const parts = [subd && `${t('ตำบล')} ${subd}`, dist && `${t('อำเภอ')} ${dist}`, prov && prov].filter(Boolean)
    return parts.join(' ')
}
const getBusinessImage = (b) => {
    if (!b) return placeholder
    if (b.ImageProfileURL) return b.ImageProfileURL
    // ถ้า backend มี baseURL สำหรับไฟล์ ให้ปรับตรงนี้
    if (b.image_profile) return fileBase + b.image_profile
    return placeholder
}
</script>
