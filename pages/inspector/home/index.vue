<script setup>
import widgetMap from "./widgets/widget-map.vue";
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



</script>

<template>
    <div class="bg-zinc-100 min-h-screen">
        <LayoutsBaseHeader :title="t('Smart Travel Safety')" showMenu :showBack="true">
            <template #right>
                <div class="flex items-center gap-2">
                    <div class="border p-0.5 rounded-md w-7 flex justify-center items-center">
                        <i class="fa-regular fa-comment-dots" style="color: white;font-size: 22px;"></i>
                    </div>
                </div>
            </template>
        </LayoutsBaseHeader>
        <!-- Header -->
        <div class="bg-white">
            <widgetMap />


            <div class="flex items-center justify-between mb-4 pt-4">
                <div class="font-bold text-lg">{{ t('การจัดการข้อมูล') }}</div>
            </div>

            <!-- Stats Overview -->
            <div class="grid grid-cols-3 gap-4 mb-3">
                <div class="bg-white text-center p-4 border-r-2 cursor-pointer">
                    <div>
                        <div class="text-xl font-bold">{{ resDataComon?.count_waiting_approval }}</div>
                        <div class="text-gray-600 text-sm">{{ t('รออนุมัติ') }}</div>
                    </div>
                </div>
                <div class="bg-white text-center p-4 border-r-2 cursor-pointer">
                    <div>
                        <div class="text-xl font-bold">{{ resDataComon?.count_pass }}</div>
                        <div class="text-gray-600 text-sm">{{ t('อนุมัติแล้ว') }}</div>
                    </div>
                </div>
                <div class="bg-white text-center p-4 cursor-pointer">
                    <div @click="navigateTo('/inspector/send-warning')">
                        <div class="text-xl font-bold">{{ resDataComon?.count_not_pass }}</div>
                        <div class="text-gray-600 text-sm">{{ t('ไม่ผ่านเกณฑ์') }}</div>
                    </div>
                </div>
            </div>

        </div>


        <!-- List Section -->
        <van-cell-group class="!m-0 !p-0">
            <!-- <van-cell :title="t('จัดการแหล่งท่องเที่ยว')" is-link @click="navigateTo('/inspector/list/tourlist')">
                <template #value>
                    <span class="relative" v-if="resDataComon?.notify_tourist > 0">
                        <span class="absolute top-0 right-4">
                            <Badge :value="resDataComon?.notify_tourist" severity="danger" class="bg-red-700"></Badge>
                        </span>
                    </span>
                </template>
            </van-cell>
            <van-cell :title="t('จัดการธุรกิจในแหล่งท่องเที่ยว')" is-link
                @click="navigateTo('/inspector/list/business-tourlist')">
                <template #value>
                    <span class="relative">
                        <span class="absolute top-0 right-4" v-if="resDataComon?.notify_business_tourist > 0">
                            <Badge :value="resDataComon?.notify_business_tourist" severity="danger" class="bg-red-700">
                            </Badge>
                        </span>
                    </span>
                </template>
            </van-cell>
            <van-cell :title="t('ตรวจสอบคอมเมนท์')" is-link />
            <van-cell :title="t('จัดการใบเตือน')" is-link @click="navigateTo('/inspector/warning-list')">
                <template #value>
                    <span class="relative">
                        <span class="absolute top-0 right-4" v-if="resDataComon?.notify_warning > 0">
                            <Badge :value="resDataComon?.notify_warning" severity="danger" class="bg-red-700"></Badge>
                        </span>
                    </span>
                </template>
            </van-cell> -->
            <van-cell :title="t('ตรวจสอบแหล่งท่องเที่ยว')" is-link
                @click="navigateTo('/inspector/check/business-tourlist')">
                <template #value>
                    <span class="relative">
                        <span class="absolute top-0 right-4" v-if="resDataComon?.notify_business_tourist > 0">
                            <Badge :value="resDataComon?.notify_business_tourist" severity="danger" class="bg-red-700">
                            </Badge>
                        </span>
                    </span>
                </template>
            </van-cell>
        </van-cell-group>
        <NotifyMessage v-model:show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
            :life="toast.life" />
        <NotificationPopup v-model:visible="notification.visible" :state="notification.state"
            :title="notification.title" :detail="notification.detail" :timeout="notification.timeout"
            :redirect-url="notification.redirectUrl" :auto-close="notification.autoClose" />
    </div>
</template>
