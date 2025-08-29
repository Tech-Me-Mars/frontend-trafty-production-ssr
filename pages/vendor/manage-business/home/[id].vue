<template>
    <div class="min-h-screen bg-zinc-50">
        <LayoutsBaseHeader :title="t('ธุรกิจในแหล่งท่องเที่ยว')" showMenu>
            <template #right>
                <div class="flex items-center gap-2">
                    <div class="border p-0.5 rounded-md w-7 flex justify-center items-center">
                        <i class="fa-regular fa-comment-dots" style="color: white;font-size: 22px;"></i>
                    </div>
                    <div class="border p-0.5 rounded-md w-7 flex justify-center items-center">
                        <van-badge :dot="false">
                            <i class="fa-regular fa-bell" style="color: white;font-size: 22px;"></i>
                        </van-badge>
                    </div>
                </div>
            </template>
        </LayoutsBaseHeader>

        <!-- ================= SKELETON LOADING ================= -->
        <section v-if="isLoading" class="max-w-[430px] mx-auto">
            <!-- Header Section Skeleton -->
            <div class="flex items-center w-full card mb-2">
                <Skeleton width="5rem" height="5rem" class="rounded-md shadow-md" />
                <div class="ml-4 flex-1 space-y-2">
                    <Skeleton width="60%" height="1.25rem" />
                    <Skeleton width="40%" height="1rem" />
                    <Skeleton width="30%" height="1.25rem" class="rounded" />
                </div>
                <Skeleton width="4.5rem" height="2rem" class="ml-3 rounded-full" />
            </div>

            <!-- Progress Section Skeleton -->
            <div class="w-full card">
                <Skeleton width="40%" height="1.25rem" class="mb-5" />
                <div class="flex items-center gap-4 mb-5">
                    <Skeleton width="60px" height="60px" class="rounded-full" />
                    <div class="flex w-full justify-between items-center">
                        <Skeleton width="30%" height="1rem" />
                        <Skeleton width="1.25rem" height="1.25rem" class="rounded-full" />
                    </div>
                </div>
                <Skeleton width="100%" height="2.5rem" class="rounded-md" />
            </div>

            <!-- Stats Grid Skeleton -->
            <div class="card border-t grid grid-cols-2 gap-4 mb-3">
                <div class="bg-white text-center p-4 border-r-2 space-y-2">
                    <Skeleton width="20%" height="1.25rem" class="mx-auto" />
                    <Skeleton width="60%" height="1rem" class="mx-auto" />
                </div>
                <div class="bg-white text-center p-4 space-y-2">
                    <Skeleton width="20%" height="1.25rem" class="mx-auto" />
                    <Skeleton width="60%" height="1rem" class="mx-auto" />
                </div>
            </div>

            <!-- List Header Skeleton -->
            <div class="flex justify-between items-center px-4">
                <Skeleton width="30%" height="1.25rem" />
                <Skeleton width="20%" height="1rem" />
            </div>

            <!-- Items Skeleton -->
            <div class="p-4 flex-col space-y-3">
                <div v-for="i in 3" :key="'sk-' + i"
                    class="border rounded-sm shadow-md bg-white w-full max-w-md mx-auto">
                    <div class="p-3">
                        <div class="flex justify-between items-center mb-3">
                            <Skeleton width="45%" height="1.125rem" />
                            <Skeleton width="20%" height="1rem" />
                        </div>
                        <hr class="border-t my-3">
                        <div class="grid grid-cols-3 gap-3">
                            <Skeleton height="2.25rem" class="rounded-md" />
                            <Skeleton height="2.25rem" class="rounded-md" />
                            <Skeleton height="2.25rem" class="rounded-md" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- ================= END SKELETON LOADING ================= -->

        <!-- {{ resBusinessAll }} -->
        <section class="max-w-[430px] mx-auto" v-show="!isLoading">
            <!-- Header Section -->
            <div class="flex items-center w-full card mb-2">
                <!-- Image -->
                <!-- <img src="https://via.placeholder.com/50" alt="Business Image" class="w-12 h-12 rounded-full object-cover"> -->
                <!-- {{ resBusinessAll?.business_name?.image_profile }} -->
                <Image :src="resBusinessAll?.ImageProfileURL" alt="Image" width="50" class="object-cover w-20 h-20 "
                    :pt="{ image: { class: 'object-cover w-20 h-20 rounded-md shadow-md' } }" preview />
                <!-- Info Section -->
                <div class="ml-4 flex-1">
                    <h2 class="text-lg font-bold">{{ getI18n(resBusinessAll?.shop_name_i18n, locale) }}</h2>
                    <p class="text-sm text-gray-500">{{
                        getI18n(resBusinessAll?.business_type?.business_type_name_i18n, locale)
                    }}</p>

                    <span v-if="resBusinessAll?.survey_status?.survey_success_note"
                        class="inline-flex items-center px-2 py-1 text-xs font-medium text-white rounded" :style="resBusinessAll?.survey_status?.bg_color?.startsWith('#')
                            ? { backgroundColor: resBusinessAll.survey_status.bg_color }
                            : {}" :class="!resBusinessAll?.survey_status?.bg_color?.startsWith('#')
                                ? resBusinessAll.survey_status.bg_color : ''">
                        <!-- <i class="fa-solid fa-circle-exclamation mr-1"></i> -->
                        {{ getI18n(resBusinessAll?.survey_status?.survey_success_note, locale) }}
                    </span>
                </div>

                <!-- Approval Status -->
                <!-- Preview pill (ขวาสุด) -->
                <button @click="navigateTo(`/client/information/${route.params.id}?state=preview`)" class="ml-3 shrink-0 px-3 py-1.5 rounded-full text-xs font-medium 
           border border-zinc-300 !text-zinc-600 bg-zinc-50 hover:bg-zinc-200">
                    {{ t('พรีวิว') }}
                </button>
            </div>

            <!-- Progress Section -->
            <div class="w-full card">
                <h2 class="text-lg font-bold mb-5">{{ t('ข้อมูลธุรกิจในแหล่งท่องเที่ยว') }}</h2>
                <NuxtLink v-if="resBusinessAll?.score_percent != null"
                    :to="`/vendor/manage-business/safety-standards/${route.params.id}`">
                    <div class="flex items-center gap-4 cursor-pointer mb-5">
                        <!-- Knob Component -->
                        <van-circle v-model:current-rate="currentRate" :rate="rate" :speed="100" :stroke-width="60"
                            color="#202c54" layer-color="#ebedf0" size="60px" :text="textRate" />

                        <!-- Description -->
                        <div class="flex w-full justify-between">
                            <p class="">{{ t('มาตรฐานความปลอดภัย') }}</p>
                            <i class="fa-solid fa-chevron-right"></i>
                        </div>
                    </div>
                </NuxtLink>
                <!-- responsiblePerson -->


                <div class="mx-auto" v-if="resBusinessAll?.SurveyAuditCount == 0">
                    <NuxtLink :to="`/vendor/manage-business/do-survery/${route.params.id}`">
                        <Button :loading="isloadingAxi" :label="t('เริ่มประเมินมาตรฐานความปลอดภัย')" severity="primary"
                            size="" rounded class="w-full" variant="outlined" :pt="{
                                root: {
                                    class: '!border-primary-main'
                                },
                            }" />
                    </NuxtLink>
                </div>
            </div>

            <div class="w-full card" v-if="resBusinessAll?.station_id">
                <div>
                    <h2 class="text-lg font-bold">{{ t('ผู้รับผิดชอบสถานที่') }}</h2>
                    <p class="mb-2">
                        <span class="text-gray-600 text-sm font-semibold ">{{
                            getI18n(resBusinessAll?.station?.station_name_i18n,locale) }}</span>
                    </p>
                    <label class="text-lg font-semibold">{{ t('แก้ไขผู้รับผิดชอบสถานที่') }}</label>
         
                    <Dropdown v-model="selectedResponsibleId" :options="responsiblePerson" option-label="fullname"
                        option-value="user_id" :filter="true" :filter-placeholder="t('ค้นหาชื่อผู้รับผิดชอบ')"
                        size="small" :placeholder="t('เลือกผู้รับผิดชอบสถานที่')" class="w-full mb-4 custom-border" />
                    <div class="flex justify-end">
                        <Button :label="t('แก้ไขข้อมูล')" :loading="isSaving" :disabled="!canSubmit" rounded
                            @click="updateResponsible" size="small" class="w-15 "></Button>
                    </div>
                </div>
            </div>

            <div class="card border-t grid grid-cols-2 gap-4 mb-3">
                <div class="bg-white text-center p-4 border-r-2">
                    <div>
                        <div class="text-xl font-bold">{{ resBusinessAll?.BusinessListCount }}</div>
                        <div class="text-gray-600 text-sm">{{ t('รายการทั้งหมด') }}</div>
                    </div>
                </div>
                <div class="bg-white text-center p-4">
                    <div class="cursor-pointer"
                        @click="navigateTo(`/vendor/warning-list?BusinessId=${route.params.id}`)">
                        <div class="text-xl font-bold">{{ resBusinessAll?.SurveyWarningCount }}</div>
                        <div class="text-gray-600 text-sm">{{ t('ใบเตือน') }}</div>
                    </div>
                </div>
            </div>

            <div class="flex justify-between items-center px-4">
                <h2 class="text-lg font-bold">{{ t('รายการของฉัน') }}</h2>
                <NuxtLink :to="`/vendor/manage-business/list/${route.params.id}`"
                    class="hover:underline cursor-pointer">{{
                        t('ดูทั้งหมด') }}
                    <i class="fa-solid fa-chevron-right" style="font-size: 14px;"></i>
                </NuxtLink>
            </div>

            <div class="p-4 flex-col space-y-3">
                <div v-if="(resBusinessAll?.business_list?.length || 0) > 0" v-for="(item, index) in resBusinessAll?.business_list" :key="index"
                    class="border rounded-sm shadow-md bg-white w-full max-w-md mx-auto">
                    <div class="p-3">
                        <!-- ชื่อธุรกิจ -->
                        <div class="flex justify-between items-center">
                            <h2 class="text-lg font-semibold text-gray-800">{{
                                getI18n(item?.business_list_name_i18n,
                                    locale)
                            }}</h2>
                            <p class="text-gray-800 ">฿{{ item?.business_list_price }}</p>
                        </div>
                        <!-- ปุ่มแอคชัน -->
                        <hr class="border-t mt-2 mb-4">
                        <div class="flex  gap-3">
                            <Button :loading="togglingId === item.id" :disabled="isloadingAxi"
                                :label="isFlagTrue(item.status) ? t('ไม่แสดง') : t('แสดง')"
                                :icon="isFlagTrue(item.status) ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"
                                severity="primary" variant="outlined" class="w-full" @click="showConfirmToggle(item)"
                                :pt="{
                                    label: { class: 'text-primary-main' },
                                    root: { class: '!border-primary-main' },
                                }" />
                            <Button :loading="isloadingAxi" :label="t('แก้ไข')" severity="primary" variant="outlined"
                                class="w-full" @click="openEdit(item)" :pt="{
                                    label: { class: 'text-primary-main' },
                                    root: { class: '!border-primary-main' }
                                }" />
                            <Button :loading="deletingId === item.id" :disabled="isloadingAxi"
                                @click="showConfirmDel(item)" icon="fa-regular fa-trash-can" label="" severity="danger"
                                variant="outlined" class="!w-[10rem]" />
                        </div>
                    </div>
                </div>

                <div v-else class="border rounded-sm shadow-md bg-white w-full max-w-md mx-auto p-6 text-center">
    <p class="text-gray-600">{{ t('ยังไม่มีรายการธุรกิจ') }}</p>
    <!-- ปุ่ม (ถ้าต้องการ) -->
    <!-- <Button class="mt-3" :label="t('เพิ่มธุรกิจ')" @click="navigateTo('/vendor/register-business')" /> -->
  </div>


            </div>
        </section>

        <van-action-sheet v-model:show="showEditSheet" :close-on-click-overlay="true" :round="true"
            safe-area-inset-bottom>
            <template #default>
                <div class="sticky top-0 bg-white px-4 pt-3 pb-2 border-b border-zinc-200">
                    <div class="flex items-center justify-between">
                        <h3 class="text-base font-semibold text-zinc-800">
                            {{ t(isEditMode ? 'แก้ไขรายการ' : 'เพิ่มรายการสินค้า') }}
                        </h3>
                        <button type="button" aria-label="Close" @click="showEditSheet = false" class="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200
                 text-zinc-500 flex items-center justify-center
                 hover:bg-zinc-200 active:scale-[.98] transition">
                            <i class="fa-solid fa-xmark text-[12px]"></i>
                        </button>
                    </div>
                </div>

                <div class="p-4">
                    <van-tabs v-model:active="activeLangTab" type="line" sticky animated color="#202c54">
                        <van-tab v-for="(lang, idx) in langs" :key="lang.code" :title="lang.label" :name="idx"
                            :line-width="100">
                            <div class="space-y-4 py-2">
                                <div>
                                    <label class="label-input block mb-1">{{ t('ชื่อรายการ') }}</label>
                                    <InputText v-model="business_list_name_i18n[lang.code]"
                                        :placeholder="t('ชื่อรายการ')" class="w-full custom-border"
                                        :invalid="!!getFieldError('business_list_name_i18n', lang.code)" />
                                    <p v-if="getFieldError('business_list_name_i18n', lang.code)" class="error-text">
                                        {{ getFieldError('business_list_name_i18n', lang.code) }}
                                    </p>
                                </div>

                                <div>
                                    <label class="label-input block mb-1">{{ t('ราคา') }}</label>
                                    <InputText v-model="business_list_price" :placeholder="t('ราคา')"
                                        class="w-full custom-border" :invalid="!!errors?.business_list_price" />
                                    <p v-if="errors?.business_list_price" class="error-text">
                                        {{ errors?.business_list_price }}
                                    </p>
                                </div>
                            </div>
                        </van-tab>
                    </van-tabs>

                    <div class="mt-4 grid grid-cols-2 gap-3">
                        <Button :label="t('ยกเลิก')" severity="secondary" class="w-full"
                            @click="showEditSheet = false" />
                        <Button :loading="isloadingAxi" :label="t('บันทึก')" severity="primary" class="w-full"
                            @click="onSave" />
                    </div>
                </div>
            </template>
        </van-action-sheet>
        <NotifyMessage v-model:show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
            :life="toast.life" />

        <ConfirmDialog></ConfirmDialog>
    </div>
</template>

<style scoped>
.van-nav-bar {
    --van-nav-bar-background: #281c74;
    --van-nav-bar-text-color: white;
    --van-nav-bar-icon-color: white;
    --van-nav-bar-title-text-color: white;
    --van-nav-bar-height: 70px
}
</style>

<script setup>
definePageMeta({
    middleware: ["auth"],
});

import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'
import * as dataApi from "./api/data.js";
import { useI18n } from 'vue-i18n';
import Skeleton from 'primevue/skeleton' // ✅ เพิ่ม import component สำหรับ skeleton

const isloadingAxi = useState("isloadingAxi");
const router = useRouter();
const route = useRoute();
const toast = ref({
    show: false,
    type: null,
    title: null,
    message: null,
    life: null, // ถ้าใส่เลข = แสดง auto close
})

const currentRate = ref(0);
const rate = ref(0)
const textRate = computed(() => currentRate.value.toFixed(0) + '%');

const resBusinessAll = ref()

// ✅ NEW: state โหลดหน้า (เพิ่มอย่างเดียว ไม่แก้ของเดิม)
const isLoading = ref(true)

const loadBusinessAll = async () => {
    try {
        isLoading.value = true           // ✅ start loading
        const res = await dataApi.getBusiness(route.params.id);
        resBusinessAll.value = res.data.data;
        currentRate.value = await res.data.data?.score_percent
        rate.value = await res.data.data?.score_percent
    } catch (error) {
        toast.value = {
            show: true,
            type: 'danger',
            title: t('ผิดพลาด'),
            message: error?.response?.data?.message || t('เกิดข้อผิดพลาด'),
            life: null
        }
        console.error(error)
    } finally {
        isLoading.value = false          // ✅ end loading
    }
}

const responsiblePerson = ref(null)
const loadResponsible = async () => {
    try {
        const role_name = await useDecryptedCookie("role_name")
        if (role_name == 'police' || role_name == 'Admin') {
            const res = await dataApi.getResponsiblePerson(route.params.id);
            responsiblePerson.value = res.data.data.map((item) => ({
                ...item,
                fullname: `${item.Prefix} ${item.fname} ${item.lname}`
            }))
        } else {
            return;
        }

    } catch (error) {
        toast.value = {
            show: true,
            type: 'danger',
            title: t('ผิดพลาด'),
            message: error?.response?.data?.message || t('เกิดข้อผิดพลาด'),
            life: null
        }
        console.error(error)
    }
}
onMounted(async () => {

    loadBusinessAll();
    loadResponsible();
})

const confirm1 = useConfirm()

// **************************************************************** DELETE **********************************************************************
// **************************************************************** DELETE **********************************************************************
// **************************************************************** DELETE **********************************************************************
const itemForDelete = ref(null)
const deletingId = ref(null)

const showConfirmDel = (item) => {
    itemForDelete.value = item
    confirm1.require({
        message: `${t('ยืนยันการลบ')}?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: { label: t('ยกเลิก'), severity: 'secondary', outlined: true },
        acceptProps: { label: t('ตกลง') },
        accept: async () => {
            deletingId.value = item.id
            await deleteItems(item.id)
            deletingId.value = null
        },
        reject: () => {
            itemForDelete.value = null
        }
    })
}

const deleteItems = async (id) => {
    try {
        const res = await dataApi.deleteBusinessId(id)
        // ลบแบบ optimistic ทันที
        if (resBusinessAll.value?.business_list) {
            resBusinessAll.value.business_list = resBusinessAll.value.business_list.filter(x => x.id !== id)
        } else {
            // หรือรีโหลดใหม่ทั้งก้อน
            await loadBusinessAll()
        }
    } catch (error) {
        toast.value = {
            show: true,
            type: 'danger',
            title: t('ผิดพลาด'),
            message: error?.response?.data?.message || t('เกิดข้อผิดพลาด'),
            life: null
        }
    } finally {
        itemForDelete.value = null
    }
}
// **************************************************************** HIDE **********************************************************************
// **************************************************************** HIDE **********************************************************************
// **************************************************************** HIDE **********************************************************************
const togglingId = ref(null)

const isFlagTrue = (v) => v === true || v === 1 || v === '1' || v === 'true'

const showConfirmToggle = (item) => {
    const isActive = isFlagTrue(item.status)
    confirm1.require({
        message: isActive
            ? t('ยืนยันการซ่อนรายการนี้ไม่ให้แสดงใช่ไหม?')
            : t('ยืนยันการแสดงรายการนี้ใช่ไหม?'),
        header: t('ยืนยัน'),
        icon: 'pi pi-exclamation-triangle',
        rejectProps: { label: t('ยกเลิก'), severity: 'secondary', outlined: true },
        acceptProps: { label: t('ตกลง') },
        accept: async () => {
            togglingId.value = item.id
            await toggleBusinessStatus(item, !isActive)
            togglingId.value = null
        }
    })
}

const toggleBusinessStatus = async (item, nextStatus) => {
    const payload = { id: item.id, status: nextStatus }
    try {
        const res = await dataApi.updateBusinessStatus(route.params.id, payload)

        // อัพเดททันทีเพื่อให้ UI ตอบสนองเร็ว (ถ้าไม่อยากรีเฟรชทั้งหน้า)
        item.status = nextStatus

        toast.value = {
            show: true,
            type: 'success',
            title: t('สำเร็จ'),
            message: nextStatus ? t('แสดงรายการเรียบร้อยแล้ว') : t('ซ่อนรายการเรียบร้อยแล้ว'),
            life: 1500
        }

        // ถ้าต้องการความชัวร์ ดึงข้อมูลใหม่ทั้งก้อน (เลือกอย่างใดอย่างหนึ่ง)
        // await loadBusinessAll()
    } catch (error) {
        toast.value = {
            show: true,
            type: 'danger',
            title: t('ผิดพลาด'),
            message: error?.response?.data?.message || t('เกิดข้อผิดพลาด'),
            life: null
        }
        console.error('toggleBusinessStatus error:', error)
    }
}



// **************************************************************** EDIT **********************************************************************
// **************************************************************** EDIT **********************************************************************
// **************************************************************** EDIT **********************************************************************
// ----- i18n + tabs (ตามแพทเทิร์นคุณ) -----
const { t, locale, setLocale } = useI18n()
const langs = [
    { code: 'th', label: 'ภาษาไทย', locale: 'th' },
    { code: 'en', label: 'English', locale: 'en' },
    { code: 'cn', label: '中文', locale: 'cn' },
]
const activeLangTab = ref(0)
onMounted(() => setLocale('th'))
watch(activeLangTab, (i) => setLocale(langs[i].locale))
watch(locale, (loc) => {
    const idx = langs.findIndex(l => l.locale === loc)
    if (idx !== -1) activeLangTab.value = idx
})
// ----- สคีมา (TH required, EN/CN optional) -----
const validationSchema = toTypedSchema(zod.object({
    business_list_name_i18n: zod.object({
        th: zod.string().min(1, t('กรุณากรอก')),
        en: zod.string().optional().or(zod.literal('')),
        cn: zod.string().optional().or(zod.literal('')),
    }),
    business_list_price: zod.string().min(1, () => t('กรุณาระบุข้อมูลราคา')),
}))

const { handleSubmit, setValues, errors } = useForm({
    validationSchema,
    initialValues: {
        business_list_name_i18n: { th: '', en: '', cn: '' },
        business_list_price: '',
    }
})
// ----- useField ต่อภาษาตามแพทเทิร์น -----
const { value: business_list_name_th } = useField('business_list_name_i18n.th', undefined, { initialValue: '' })
const { value: business_list_name_en } = useField('business_list_name_i18n.en', undefined, { initialValue: '' })
const { value: business_list_name_cn } = useField('business_list_name_i18n.cn', undefined, { initialValue: '' })
const { value: business_list_price } = useField('business_list_price', undefined, { initialValue: '' })

// proxy สำหรับ v-model แบบ business_list_name_i18n[lang.code]
const business_list_name_i18n = ref({
    get th() { return business_list_name_th.value },
    set th(v) { business_list_name_th.value = v },
    get en() { return business_list_name_en.value },
    set en(v) { business_list_name_en.value = v },
    get cn() { return business_list_name_cn.value },
    set cn(v) { business_list_name_cn.value = v },
})
// ---- helper error ต่อภาษา ----
const getFieldError = (fieldName, langCode = null) => {
    if (langCode) {
        return errors.value[`${fieldName}.${langCode}`] || null;
    }
    return errors.value[fieldName] || null;
};
const showEditSheet = ref(false)
const editingItem = ref(null)
const prevLocale = ref(null)
const prevActiveLangTab = ref(null)
const openEdit = (item) => {
    // เก็บค่าก่อนเปิด
    prevLocale.value = locale.value
    prevActiveLangTab.value = activeLangTab.value

    editingItem.value = item
    const i18nData = item?.business_list_name_i18n || item?.shop_name_i18n || { th: '', en: '', cn: '' }

    setValues({
        business_list_name_i18n: {
            th: i18nData?.th || '',
            en: i18nData?.en || '',
            cn: i18nData?.cn || '',
        },
        business_list_price: String(item?.business_list_price ?? ''),
    })
    showEditSheet.value = true
}
watch(showEditSheet, (show) => {
    if (!show && prevLocale.value !== null) {
        setLocale(prevLocale.value)
        if (prevActiveLangTab.value != null) {
            activeLangTab.value = prevActiveLangTab.value
        }
        prevLocale.value = null
        prevActiveLangTab.value = null
    }
})

const onSave = handleSubmit(async (values) => {
    if (!editingItem.value?.id) return
    try {

        const payload = {
            business_id: route.params.id,
            business_list_name_i18n: values.business_list_name_i18n,
            // ใช้ราคาจากช่องเดียว แล้วใส่ให้ครบทั้ง 3 ภาษา
            business_list_price: values.business_list_price,
            status: true, // หรือ editingItem.value?.status ?? true ถ้าต้องการคงสถานะเดิม
        }
        console.log('payload', payload)

        // เรียก API (ตามที่คุณเขียนไว้)
        await dataApi.updateBusiness(editingItem.value.id, payload)

        // อัปเดต list ในหน้าแบบ inline
        const idx = resBusinessAll.value.business_list.findIndex(x => x.id === editingItem.value.id)
        if (idx !== -1) {
            resBusinessAll.value.business_list[idx] = {
                ...resBusinessAll.value.business_list[idx],
                business_list_name_i18n: payload.business_list_name_i18n,
                business_list_price: payload.business_list_price,
                status: payload.status
            }
        }

        showEditSheet.value = false
    } catch (e) {
        toast.value = {
            show: true,
            type: 'danger',
            title: t('ผิดพลาด'),
            message: error?.response?.data?.message || t('เกิดข้อผิดพลาด'),
            life: null
        }
        console.error(e)
    }
})

// ✅ v-model สำหรับ Dropdown (id จากรายการ responsiblePerson)
const selectedResponsibleId = ref(null)

// สถานะปุ่ม/โหลด
const isSaving = ref(false)
const canSubmit = computed(() => !!selectedResponsibleId.value && !isSaving.value)

// ✅ กดปุ่มแล้วสร้าง payload และยิง API ตามที่ระบุ
async function updateResponsible() {
    if (!selectedResponsibleId.value) {
        toast.value = {
            show: true,
            type: 'warning',
            title: t('แจ้งเตือน'),
            message: t('กรุณาเลือกผู้รับผิดชอบ'),
            life: 2000
        }
        return
    }

    const payload = { user_id: (selectedResponsibleId.value) } // ← ตามสเปกที่ให้มา

    try {
        isSaving.value = true
        const res = await dataApi.updateBusinessResponsible(route.params.id, payload)
        toast.value = {
            show: true,
            type: 'success',
            title: t('สำเร็จ'),
            message: t('แก้ไขผู้รับผิดชอบสถานที่เรียบร้อยแล้ว'),
            life: 2000
        }
        // ถ้าต้อง refresh ข้อมูลหน้า ปรับใช้ฟังก์ชัน fetch ใหม่ที่คุณมีอยู่
        await resBusinessAll.value.station_id == null
        await loadBusinessAll();
    } catch (error) {
        console.error(err)
        toast.value = {
            show: true,
            type: 'danger',
            title: t('ผิดพลาด'),
            message: error?.response?.data?.message || t('เกิดข้อผิดพลาด'),
            life: null
        }
    } finally {
        isSaving.value = false
    }
}

</script>

<style scoped>
.card {
    @apply bg-white border border-zinc-200 p-4;
}

.label-input {
    @apply text-sm text-zinc-600;
}

.custom-border :deep(.p-inputtext),
:deep(.p-dropdown) {
    @apply w-full;
}
</style>
