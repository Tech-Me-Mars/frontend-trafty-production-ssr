<template>
    <div class="min-h-screen bg-zinc-100">
        <LayoutsBaseHeader :title="t('พื้นที่รับผิดชอบ')" :showBack="true" back-to="/inspector/home" />

        <section class="max-w-[430px] mx-auto">
            <van-tabs v-model:active="activeTab" :line-width="80" animated swipeable color="#281c74">

                <van-tab :title="t('แหล่งท่องเที่ยว')">
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
                            <template v-if="resTourist.length > 0">
                                <div v-for="(item, index) in resTourist" :key="index"
                                    class="bg-white rounded-sm shadow-sm border border-zinc-200 mb-4 p-4">
                                    <div class="font-bold text-lg text-[#202c54] mb-1">
                                        {{ getI18n(item.business.shop_name_i18n, locale) }}
                                    </div>
                                    <div class="text-zinc-500 text-sm mb-3 truncate">
                                        {{ getI18n(item?.business?.shop_subdistrict, locale) }}
                                        {{ getI18n(item?.business?.shop_district, locale) }}
                                        {{ getI18n(item?.business?.shop_province, locale) }}
                                        {{ getI18n(item?.business?.shop_address_i18n, locale) }}
                                    </div>
                                    <hr class="border-zinc-200 mb-2" />
                                    <div class="flex gap-2 mt-3">
                                        <Button :label="t('ดูรายละเอียด')" :loading="isloadingAxi" severity="primary"
                                            variant="outlined" class="w-full" :pt="{
                                                label: { class: 'text-primary-main text-xs' },
                                                root: { class: '!border-primary-main' },
                                            }" @click="navigateTo({
                                                path: `/client/information/${item.business_id}`,
                                                query: {
                                                    ...route.query,  // ส่ง query ที่มีอยู่ไปด้วย
                                                    state: 'view-by-area'    // บังคับเพิ่มหรือแก้ไข state=edit
                                                }
                                            })" />
                                        <Button :label="t('ตรวจสอบ')" :loading="isloadingAxi" severity="primary"
                                            variant="outlined" class="w-full" :pt="{
                                                label: { class: 'text-primary-main text-xs' },
                                                root: { class: '!border-primary-main' },
                                            }" @click="navigateTo({
                                                path: `/client/information/${item.business_id}`,
                                                query: {
                                                    ...route.query,  // ส่ง query ที่มีอยู่ไปด้วย
                                                    state: 'view-by-area'    // บังคับเพิ่มหรือแก้ไข state=edit
                                                }
                                            })" />
                                    </div>


                                </div>
                            </template>

                            <!-- ✅ ว่าง -->
                            <div v-else
                                class="bg-white rounded-sm border border-zinc-200 p-6 text-center text-zinc-500">
                                <i class="fa-regular fa-folder-open text-2xl mb-2"></i>
                                <div>{{ t('ยังไม่มีรายการ') }}</div>
                            </div>
                        </template>
                    </div>
                </van-tab>
                <van-tab :title="t('ธุรกิจในแหล่งท่องเที่ยว')">
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
                            <template v-if="resTouristBusiness.length > 0">
                                <div v-for="(item, index) in resTouristBusiness" :key="index"
                                    class="bg-white rounded-sm shadow-sm border border-zinc-200 mb-4 p-4">
                                    <div class="font-bold text-lg text-[#202c54] mb-1">
                                        {{ getI18n(item.business.shop_name_i18n, locale) }}
                                    </div>
                                    <div class="text-zinc-500 text-sm mb-3 truncate">
                                        {{ getI18n(item?.business?.shop_subdistrict, locale) }}
                                        {{ getI18n(item?.business?.shop_district, locale) }}
                                        {{ getI18n(item?.business?.shop_province, locale) }}
                                        {{ getI18n(item?.business?.shop_address_i18n, locale) }}
                                    </div>
                                    <hr class="border-zinc-200 mb-2" />
                                    <div class="flex gap-2 mt-3">
                                        <Button :label="t('ดูรายละเอียด')" :loading="isloadingAxi" severity="primary"
                                            variant="outlined" class="w-full" :pt="{
                                                label: { class: 'text-primary-main text-xs' },
                                                root: { class: '!border-primary-main' },
                                            }" @click="navigateTo({
                                                path: `/client/information/${item.business_id}`,
                                                query: {
                                                    ...route.query,  // ส่ง query ที่มีอยู่ไปด้วย
                                                    state: 'view-by-area'    // บังคับเพิ่มหรือแก้ไข state=edit
                                                }
                                            })" />
                                    </div>


                                </div>
                            </template>

                            <!-- ✅ ว่าง -->
                            <div v-else
                                class="bg-white rounded-sm border border-zinc-200 p-6 text-center text-zinc-500">
                                <i class="fa-regular fa-folder-open text-2xl mb-2"></i>
                                <div>{{ t('ยังไม่มีรายการ') }}</div>
                            </div>
                        </template>
                    </div>

                </van-tab>

            </van-tabs>

        </section>
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


const activeTab = ref(0)
// ✅ state โหลดแต่ละแท็บ
const isLoading = ref(true)

const resTourist = ref([])
const loadTourist = async () => {
    try {

        isLoading.value = true;
        const res = await dataApi.getAreaStationTouristByUserID()
        resTourist.value = res.data.data
    } catch (error) {
        toast.value = { show: true, type: 'danger', title: t('ผิดพลาด'), message: error?.response?.data?.message || t('เกิดข้อผิดพลาด'), life: null }
    } finally {
        isLoading.value = false
    }
}
const resTouristBusiness = ref([])
const loadTouristBusiness = async () => {
    try {
        isLoading.value = true;
        const res = await dataApi.getAreaStationBusinessTouristByUserID()
        resTouristBusiness.value = res.data.data
    } catch (error) {
        toast.value = { show: true, type: 'danger', title: t('ผิดพลาด'), message: error?.response?.data?.message || t('เกิดข้อผิดพลาด'), life: null }
    } finally {
        isLoading.value = false
    }
}
onMounted(() => {
    loadTourist()
    loadTouristBusiness()
})


</script>
