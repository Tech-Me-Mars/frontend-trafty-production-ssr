<template>
    <div class="min-h-screen bg-zinc-100">
        <LayoutsBaseHeader :title="titlePage" :showBack="true" back-to="/inspector/home" />

        <section class="max-w-[430px] mx-auto">
            <div class="p-3">
                <!-- ✅ Skeleton รอตรวจสอบ -->
                <template v-if="isLoading">
                    <div v-for="n in 3" :key="'sk-wait-' + n"
                        class="bg-white rounded-sm shadow-sm border border-zinc-200 mb-4 p-4">
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
                        <div v-for="(item, index) in resList" :key="index"
                            class="bg-white rounded-sm shadow-sm border border-zinc-200 mb-4 p-4">
                            <div class="font-bold text-lg text-[#202c54] mb-1">
                                {{ getI18n(item.shop_name_i18n, locale) }}
                            </div>
                            <div class="text-zinc-500 text-sm mb-3 truncate">
                                {{ getI18n(item?.shop_subdistrict, locale) }}
                                {{ getI18n(item?.shop_district, locale) }}
                                {{ getI18n(item?.shop_province, locale) }}
                                {{ getI18n(item?.shop_address_i18n, locale) }}
                            </div>
                            <hr class="border-zinc-200 mb-2" />
                            <div class="flex gap-2 mt-3">
                                <Button v-if="item?.business_station_id != null" :label="t('จัดการข้อมูล')" :loading="isloadingAxi" severity="primary"
                                    variant="outlined" class="w-full" :pt="{
                                        label: { class: 'text-primary-main text-xs' },
                                        root: { class: '!border-primary-main' },
                                    }"
                                    @click="navigateTo(`/vendor/manage-business/home/${item.business_id}`)" />
                                <Button :label="t('ดูรายละเอียด')" :loading="isloadingAxi" severity="primary"
                                    variant="outlined" class="w-full" :pt="{
                                        label: { class: 'text-primary-main text-xs' },
                                        root: { class: '!border-primary-main' },
                                    }"
                                    @click="navigateTo(`/inspector/do-recheck/${item.business_id}/${item.id}?isBusiness=${route.query.isBusiness}`)" />
                                <Button :label="t('ไม่แสดงในระบบ')" :loading="isloadingAxi" severity="danger"
                                    variant="outlined" class="w-full" :pt="{
                                        label: { class: 'text-xs' },
                                    }"
                                    @click="navigateTo(`/inspector/do-recheck/${item.business_id}/${item.id}?isBusiness=${route.query.isBusiness}`)" />
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
        </section>

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



const titlePage = computed(() => {
    if (route.query.isBusiness == 'true') {
        return t('จัดการธุรกิจในแหล่งท่องเที่ยว')
    } else if (route.query.isBusiness == 'false') {
        return t('จัดการแหล่งท่องเที่ยว')
    } else {
        return t('ข้อมูลผิดพลาด')
    }
})
// ✅ state โหลดแต่ละแท็บ
const isLoading = ref(true)

const resList = ref([])
const loadList = async () => {
    try {
        const role_name= await getModulePathByRoleName()
        isLoading.value = true
        let url = ""
        if (route.query.isBusiness == 'true') {
            url = `/api/v1/${role_name}/business/get-business-tourist-by-station-id`
        } else if (route.query.isBusiness == 'false') {
            url = `/api/v1/${role_name}/business/get-tourist-by-station-id`
        }else{
            navigateTo(`/inspector/home`)
        }

        const res = await request("get", url, {}, true);
        resList.value = res.data.data
    } catch (error) {
        toast.value = { show: true, type: 'danger', title: t('ผิดพลาด'), message: error?.response?.data?.message || t('เกิดข้อผิดพลาด'), life: null }
    } finally {
        isLoading.value = false
    }
}


onMounted(() => {
    loadList()
})


</script>
