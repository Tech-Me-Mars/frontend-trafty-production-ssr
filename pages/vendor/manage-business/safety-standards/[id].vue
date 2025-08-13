<template>
    <div class="min-h-screen bg-white">

        <LayoutsBaseHeader :title="t('ธุรกิจในแหล่งท่องเที่ยว')" showBack></LayoutsBaseHeader>

        <main>
            <!-- Status Header -->
            <div class="text-center mb-8 bg-zinc-100 h-[10rem] pt-5">
                <p class="text-gray-800 text-sm mb-2">การประเมินองคุณ</p>
                <h2 class="text-xl font-semibold text-gray-800">ค่อนข้างดี</h2>
            </div>

            <!-- Progress Circle -->
            <div class="bg-white rounded-lg p-2  border-2 border-gray-100 -mt-[6.5rem]  max-w-[22rem] mx-auto">
                <!-- <h3 class="text-lg font-medium mb-2">ประเภทรับอาหาร</h3> -->

                <div class="flex justify-center">
                    <!-- Gauge Component -->
                    <!-- size-36 -->
                    <div class="relative  w-[10rem] h-[5.5rem]">
                        <svg class=" rotate-180" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            <!-- Background Circle (Gauge) -->
                            <circle cx="18" cy="18" r="16" fill="none"
                                class="stroke-current text-gray-200 dark:text-[#e5e7eb]" stroke-width="2"
                                stroke-dasharray="50 100" stroke-linecap="round"></circle>

                            <!-- Gauge Progress -->
                            <circle cx="18" cy="18" r="16" fill="none"
                                class="stroke-current text-[#fccc0c] dark:text-[#fccc0c]" stroke-width="2"
                                :stroke-dasharray="`${progressComputed} 100`" stroke-linecap="round"></circle>
                        </svg>

                        <!-- Value Text -->
                        <div class="absolute top-9 start-1/2 transform -translate-x-1/2 text-center">
                            <span class="text-2xl font-bold text-[#000000] dark:text-[#000000]">{{progress}}%</span>
                            <!-- <span class="text-sm text-[#000000] dark:text-[#000000] block">Score</span> -->
                        </div>
                    </div>

                </div>


            </div>


            <van-tabs v-model:active="active" animated swipeable color="#281c74">
                <van-tab :title="t('อยู่ในเกณฑ์ดี')">
                    <div class="space-y-4" v-if="resPass.length>0">
                        <div class="bg-white px-2" v-for="(item, index) in resPass" :key="item.index">
                            <p class="text-sm text-gray-600 mb-1">
                                {{ getI18n(item?.questions_field_name_display, locale) }}
                            </p>
                        </div>
                    </div>
                    <SharedNoData v-else/>
                </van-tab>
                <van-tab :title="t('ต้องปรับปรุง')">
                    <div class="space-y-4" v-if="resFail.length>0">
                        <div class="bg-white px-2" v-for="(item, index) in resFail" :key="item.index">
                            <p class="text-sm text-gray-600 mb-1">
                                {{ getI18n(item?.questions_field_name_display, locale) }}
                            </p>
                        </div>

                    </div>
                    <SharedNoData v-else/>

                </van-tab>
            </van-tabs>
        </main>

        <NotifyMessage v-model:show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
            :life="toast.life" />
        <NotificationPopup v-model:visible="notification.visible" :state="notification.state"
            :title="notification.title" :detail="notification.detail" :timeout="notification.timeout"
            :redirect-url="notification.redirectUrl" :auto-close="notification.autoClose" />
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
import * as dataApi from "./api/dataApi.js";
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

const active = ref(0)
const progress = ref(0)
// ถ้ามากกว่า 1 ให้หาร 2, ถ้าไม่ใช่ก็คืนค่าเดิม
const progressComputed = computed(() => {
  const n = Number(progress.value) || 0
  return n > 1 ? n / 2 : n
})




const resPass = ref([])
const loadSurveyPass = async () => {
    try {
        const res = await dataApi.getSurveyAuditPass(route.params.id);
        resPass.value = res.data.data.groups;
        progress.value = res.data.data.score_percent;

    } catch (error) {
        toast.value = {
            show: true,
            type: 'danger',
            title: error.response?.data?.title || t('คำเตือน'),
            message: error.response?.data?.detail || t('เกิดข้อผิดพลาด'),
            life: null
        }
        console.error(error)
    }
}

const resFail = ref([])
const loadSurveyFail = async () => {
    try {
        const res = await dataApi.getSurveyAuditFail(route.params.id);
        resFail.value = res.data.data.groups;
        progress.value = res.data.data.score_percent;
    } catch (error) {
        toast.value = {
            show: true,
            type: 'danger',
            title: error.response?.data?.title || t('คำเตือน'),
            message: error.response?.data?.detail || t('เกิดข้อผิดพลาด'),
            life: null
        }
        console.error(error)
    }
}
onMounted(() => {
    loadSurveyPass();
    loadSurveyFail();
})
</script>
<style scoped>
/* Additional custom styles if needed */
.transition-all {
    transition: all 1s ease-out;
}

.van-tabs__line {
    width: 120px !important;
    background: #281c74 !important;
}

.van-tab {
    --van-tab-active-text-color: #281c74 !important
}
</style>