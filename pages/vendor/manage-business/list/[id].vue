<template>
    <div class="min-h-screen bg-zinc-100">

        <LayoutsBaseHeader :title="t('ธุรกิจในแหล่งท่องเที่ยว')" showBack
            :backTo="`/vendor/manage-business/home/${route.params.id}`"></LayoutsBaseHeader>


        <main class="max-w-[430px] mx-auto">
            <van-tabs v-model:active="activeStatusTab" animated color="#202c54" :line-width="100">
                <!-- แท็บ: แสดงอยู่ -->
                <van-tab :title="t('แสดงอยู่')">

                    <div class="p-4 flex-col space-y-3" v-if="listDisplayed.length > 0">
                        <div v-for="(item, index) in listDisplayed" :key="item.id"
                            class="border rounded-sm shadow-md bg-white w-full max-w-md mx-auto">
                            <div class="p-3">
                                <!-- ชื่อธุรกิจ -->
                                <div class="flex justify-between items-center">
                                    <h2 class="text-lg font-semibold text-gray-800">
                                        {{ getI18n(item?.business_list_name_i18n, locale) }}
                                    </h2>
                                    <p class="text-gray-800">฿{{ item?.business_list_price }}</p>
                                </div>

                                <!-- ปุ่มแอคชัน -->
                                <hr class="border-t mt-2 mb-4" />
                                <div class="flex gap-3">
                                    <!-- ในแท็บแสดงอยู่ ให้ปุ่มเป็น "ไม่แสดง" -->
                                    <Button :loading="togglingId === item.id" :disabled="isloadingAxi"
                                        :label="t('ไม่แสดง')" icon="fa-regular fa-eye-slash" severity="primary"
                                        variant="outlined" class="w-full" @click="showConfirmToggle(item)"
                                        :pt="{ label: { class: 'text-primary-main' }, root: { class: '!border-primary-main' } }" />
                                    <Button :loading="isloadingAxi" :label="t('แก้ไข')" severity="primary"
                                        variant="outlined" class="w-full" @click="openEdit(item)"
                                        :pt="{ label: { class: 'text-primary-main' }, root: { class: '!border-primary-main' } }" />
                                    <Button :loading="deletingId === item.id" :disabled="isloadingAxi"
                                        @click="showConfirmDel(item)" icon="fa-regular fa-trash-can" label=""
                                        severity="danger" variant="outlined" class="!w-[10rem]" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <SharedNoData v-else />
                </van-tab>

                <!-- แท็บ: ไม่แสดง -->
                <van-tab :title="t('ไม่แสดง')">

                    <div class="p-4 flex-col space-y-3" v-if="listHidden.length > 0">
                        <div v-for="(item, index) in listHidden" :key="item.id"
                            class="border rounded-lg shadow-md bg-white w-full max-w-md mx-auto">
                            <div class="p-3">
                                <!-- ชื่อธุรกิจ -->
                                <div class="flex justify-between items-center">
                                    <h2 class="text-lg font-semibold text-gray-800">
                                        {{ getI18n(item?.business_list_name_i18n, locale) }}
                                    </h2>
                                    <p class="text-gray-800">฿{{ item?.business_list_price }}</p>
                                </div>

                                <!-- ปุ่มแอคชัน -->
                                <hr class="border-t mt-2 mb-4" />
                                <div class="flex gap-3">
                                    <!-- ในแท็บไม่แสดง ให้ปุ่มเป็น "แสดง" -->
                                    <Button :loading="togglingId === item.id" :disabled="isloadingAxi"
                                        :label="t('แสดง')" icon="fa-regular fa-eye" severity="primary"
                                        variant="outlined" class="w-full" @click="showConfirmToggle(item)"
                                        :pt="{ label: { class: 'text-primary-main' }, root: { class: '!border-primary-main' } }" />
                                    <Button :loading="isloadingAxi" :label="t('แก้ไข')" severity="primary"
                                        variant="outlined" class="w-full" @click="openEdit(item)"
                                        :pt="{ label: { class: 'text-primary-main' }, root: { class: '!border-primary-main' } }" />
                                    <Button :loading="deletingId === item.id" :disabled="isloadingAxi"
                                        @click="showConfirmDel(item)" icon="fa-regular fa-trash-can" label=""
                                        severity="danger" variant="outlined" class="!w-[10rem]" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <SharedNoData v-else />
                </van-tab>
            </van-tabs>
        </main>
        <!-- แถบล่างแบบ fixed: ชิดขอบล่างเสมอ + รองรับ safe-area -->
        <div class="fixed bottom-1 left-1/2 -translate-x-1/2 w-full max-w-[430px]
             p-3 z-50 pb-[env(safe-area-inset-bottom)]">
            <Button :label="t('เพิ่มรายการสินค้า')" icon="fa-regular fa-square-plus" severity="primary" size="small"
                class="w-full" @click="openCreate" />
        </div>


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
                        <van-tab v-for="(lang, idx) in langs" :key="lang.code" :title="lang.label" :name="idx">
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
        <ConfirmDialog></ConfirmDialog>


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

const activeStatusTab = ref(0)

// แยกรายการตามสถานะ
const listDisplayed = computed(() =>
    (resBusinessAll.value || []).filter((x) => isFlagTrue(x.status))
)
const listHidden = computed(() =>
    (resBusinessAll.value || []).filter((x) => !isFlagTrue(x.status))
)

const resBusinessAll = ref([])
const loadBusinessAll = async () => {
    try {
        const res = await dataApi.getBusinessList(route.params.id);
        resBusinessAll.value = res.data.data;
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
        if (resBusinessAll.value) {
            resBusinessAll.value = resBusinessAll.value.filter(x => x.id !== id)
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
    business_list_price: zod.string().nonempty(t('กรุณาระบุข้อมูลราคา')).default(""),
}))

// --- useForm เดิม: เพิ่ม resetForm ออกมาด้วย ---
const { handleSubmit, setValues, errors, resetForm } = useForm({
    validationSchema,
    initialValues: {
        business_list_name_i18n: { th: '', en: '', cn: '' },
        business_list_price: '',
    }
})
const isEditMode = computed(() => !!(editingItem.value && editingItem.value.id))
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

// เปิดแผ่นในโหมด "สร้าง"
const openCreate = () => {
    // เก็บ locale/tab ปัจจุบันเผื่อ restore
    prevLocale.value = locale.value
    prevActiveLangTab.value = activeLangTab.value

    editingItem.value = null
    setValues({
        business_list_name_i18n: { th: '', en: '', cn: '' },
        business_list_price: '',
    })

    // เริ่มแท็บภาษาไทยเป็นค่าเริ่มต้น
    setLocale('th')
    activeLangTab.value = 0

    showEditSheet.value = true
}

// เปิดแผ่นในโหมด "แก้ไข" (ของเดิม)
const openEdit = (item) => {
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

// --- บันทึก: ใช้ schema เดิม, แตกแขนง create / update ---
const onSave = handleSubmit(async (values) => {
    try {
        const payload = {
            business_id: route.params.id,
            business_list_name_i18n: values.business_list_name_i18n,
            business_list_price: values.business_list_price,
            status: isEditMode.value ? (editingItem.value?.status ?? true) : true,
        }
        // console.log('payload', payload)

        if (isEditMode.value) {
            // UPDATE
            await dataApi.updateBusiness(editingItem.value.id, payload)

            // sync list ในหน้า
            const idx = resBusinessAll.value.findIndex(x => x.id === editingItem.value.id)
            if (idx !== -1) {
                resBusinessAll.value[idx] = {
                    ...resBusinessAll.value[idx],
                    business_list_name_i18n: payload.business_list_name_i18n,
                    business_list_price: payload.business_list_price,
                    status: payload.status
                }
            }

            toast.value = {
                show: true, type: 'success', title: t('สำเร็จ'), message: t('บันทึกการแก้ไขแล้ว'), life: 1500
            }
        } else {
            // CREATE (ปรับชื่อฟังก์ชันให้ตรงกับโปรเจกต์จริง)
            const res = await dataApi.createBusinessList(payload)

            const created = res?.data?.data || {}
            const newItem = {
                id: created.id, // <-- ใช้ id ที่คืนมา
                business_list_name_i18n: created.business_list_name_i18n ?? payload.business_list_name_i18n,
                business_list_price: created.business_list_price ?? payload.business_list_price,
                status: typeof created.status === 'boolean' ? created.status : !!payload.status,
                created_at: created.created_at,
                updated_at: created.updated_at,
            }

            // แทรกขึ้นบนสุดให้เห็นทันที
            resBusinessAll.value.unshift(newItem)

            toast.value = {
                show: true, type: 'success', title: t('สำเร็จ'), message: t('เพิ่มรายการแล้ว'), life: 1500
            }
        }

        // ปิดแผ่น + รีเซ็ตฟอร์ม
        showEditSheet.value = false
        resetForm()
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