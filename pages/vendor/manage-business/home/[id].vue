<template>
    <div class="min-h-screen bg-zinc-50">
        <!-- <van-nav-bar :title="t('ธุรกิจในแหล่งท่องเที่ยว')">
            <template #left>
                <drawer-menu />
            </template>
<template #right>
                <div class="flex items-center gap-2">
                    <div class="border p-0.5 rounded-md w-7 flex justify-center items-center">
                        <i class="fa-regular fa-comment-dots" style="color: white;font-size: 22px;"></i>
                    </div>
                    <div class="border p-0.5 rounded-md w-7 flex justify-center items-center">
                        <van-badge :dot="resNotify.length > 0 ? true : false">
                            <i @click="navigateTo(`/vendor/notifications/${route.params.id}`)"
                                class="fa-regular fa-bell" style="color: white;font-size: 22px;"></i>
                        </van-badge>
                    </div>

                </div>

            </template>
</van-nav-bar> -->
        <LayoutsBaseHeader :title="t('ธุรกิจในแหล่งท่องเที่ยว')" showMenu></LayoutsBaseHeader>
        <!-- {{ resBusinessAll }} -->
        <section class="">
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
                        <i class="fa-solid fa-circle-exclamation mr-1"></i>
                        {{ getI18n(resBusinessAll?.survey_status?.survey_success_note, locale) }}
                    </span>




                </div>

                <!-- Approval Status -->

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

                <div class="max-w-xl mx-auto">
                    <NuxtLink :to="`/vendor/manage-business/do-survery/${route.params.id}`"
                        v-if="resBusinessAll?.SurveyAuditCount == 0">
                        <Button :loading="isloadingAxi" :label="t('เริ่มประเมินมาตรฐานความปลอดภัย')" severity="primary"
                            size="" rounded class="w-full" variant="outlined" :pt="{
                                root: {
                                    class: '!border-primary-main'
                                },
                            }" />
                    </NuxtLink>
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
                    <div class="cursor-pointer" @click="navigateTo(`/vendor/warning-list?BusinessId=${route.params.id}`)">
                        <div class="text-xl font-bold">{{ resBusinessAll?.SurveyWarningCount }}</div>
                        <div class="text-gray-600 text-sm">{{ t('ใบเตือน') }}</div>
                    </div>
                </div>

            </div>

            <div class="flex justify-between items-center px-4">
                <h2 class="text-lg font-bold">{{ t('รายการของฉัน') }}</h2>
                <NuxtLink :to="`/vendor/manage-business/list/${route.params.id}`" class="hover:underline cursor-pointer">{{ t('ดูทั้งหมด') }}
                    <i class="fa-solid fa-chevron-right" style="font-size: 14px;"></i></NuxtLink>

            </div>
            <div class="p-4 flex-col space-y-3">
                <div v-for="(item, index) in resBusinessAll?.business_list" :key="index"
                    class="border rounded-lg shadow-md bg-white w-full max-w-md mx-auto">
                    <div class="p-3">
                        <!-- ชื่อธุรกิจ -->
                        <div class="flex justify-between items-center">
                            <h2 class="text-lg font-semibold text-gray-800">{{ getI18n(item?.business_list_name_i18n,
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
                                severity="primary" variant="outlined"
                                class="w-full" @click="showConfirmToggle(item)" :pt="{
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
            </div>

        </section>
        <van-action-sheet v-model:show="showEditSheet" :close-on-click-overlay="true" :round="true"
            safe-area-inset-bottom :title="t('แก้ไขรายการ')">
            <div class="p-4">
                <van-tabs v-model:active="activeLangTab" type="line" sticky animated color="#202c54">
                    <van-tab v-for="(lang, idx) in langs" :key="lang.code" :title="lang.label" :name="idx">
                        <div class="space-y-4 py-2">
                            <div>
                                <label class="label-input block mb-1">{{ t('ชื่อรายการ') }}</label>
                                <InputText v-model="business_list_name_i18n[lang.code]" :placeholder="t('ชื่อรายการ')"
                                    class="w-full custom-border"
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
                    <Button :label="t('ยกเลิก')" severity="secondary" class="w-full" @click="showEditSheet = false" />
                    <Button :loading="isloadingAxi" :label="t('บันทึก')" severity="primary" class="w-full"
                        @click="onSave" />
                </div>
            </div>
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
const loadBusinessAll = async () => {
    try {
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
    }
}
onMounted(() => {
    loadBusinessAll();

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
</script>