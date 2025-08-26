<template>
    <section>
        <!-- {{ props.resInfo }} -->
        <Form @submit="handleNext">
            <div>
                <van-tabs v-model:active="activeLangTab" type="line" sticky animated color="#202c54" :line-width="100"
                    class="">
                    <van-tab v-for="(lang, idx) in langs" :key="lang.code" :title="lang.label" :name="idx">
                        <div class="pt-4">
                            <!-- ========== SOCIAL ========== -->
                            <div class="mb-5">
                                <h2 class="font-semibold text-lg mb-2">{{ t('ติดตามได้ที่') }}</h2>

                                <Button :loading="isloadingAxi" type="button" size="small" class="mb-3"
                                    :label="t('เพิ่มรายการโซเชียล')"
                                    @click="push1({ social_media_id: undefined, social_media_link: undefined })" :pt="{
                                        label: { class: 'text-white' },
                                        root: { class: '!border-primary-main !bg-primary-second' },
                                    }" />

                                <!-- Skeleton Loading: Social -->
                                <div v-if="isLoading" class="mt-3 space-y-3">
                                    <Skeleton width="8rem" height="1.25rem" class="rounded-md" />
                                    <div class="grid grid-cols-[8rem,1fr,2.5rem] gap-3">
                                        <Skeleton height="2.5rem" class="rounded-md" />
                                        <Skeleton height="2.5rem" class="rounded-md" />
                                        <Skeleton width="2.5rem" height="2.5rem" class="rounded-md" />
                                    </div>
                                    <div class="grid grid-cols-[8rem,1fr,2.5rem] gap-3">
                                        <Skeleton height="2.5rem" class="rounded-md" />
                                        <Skeleton height="2.5rem" class="rounded-md" />
                                        <Skeleton width="2.5rem" height="2.5rem" class="rounded-md" />
                                    </div>
                                </div>

                                <!-- Empty State: Social -->
                                <div v-else-if="!fields1 || fields1.length === 0"
                                    class="mt-3 border border-dashed rounded-md p-4 text-center text-zinc-500">
                                    <i class="pi pi-share-alt mb-2 text-xl block"></i>
                                    <div class="text-sm">{{ t('ยังไม่มีรายการโซเชียล') }}</div>
                                </div>

                                <!-- Table: Social -->
                                <div id="table-socia-media" v-else>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th style="width: 8rem" class="text-start">{{ t('ประเภทโซเชียล') }}</th>
                                                <th class="text-start">{{ t('ลิ้งค์') }}</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(field, index) in fields1" :key="field.key">
                                                <td style="width: 8rem;" class="align-top">
                                                    <div class="space-y-0">
                                                        <Select v-model="field.value.social_media_id"
                                                            :options="resSociaMedia" optionLabel="id" optionValue="id"
                                                            class="w-full h-full custom-border !bg-transparent"
                                                            :placeholder="`${t('ประเภทโซเชียล')}...`"
                                                            @change="(e) => { onSelectChange(e) }">
                                                            <template #value="slotProps">
                                                                <span class="flex items-center space-x-2">
                                                                    <template v-if="slotProps.value">
                                                                        <i :class="getIconClass(slotProps.value)"
                                                                            class="text-lg"></i>
                                                                        <span>{{ getSocialName(slotProps.value, locale)
                                                                            }}</span>
                                                                    </template>
                                                                    <template v-else>
                                                                        {{ t('ประเภทโซเชียล') }}...
                                                                    </template>
                                                                </span>
                                                            </template>
                                                            <template #option="slotProps">
                                                                <div class="flex items-center space-x-2">
                                                                    <i :class="slotProps.option.icon"
                                                                        class="text-lg"></i>
                                                                    <span>{{
                                                                        slotProps.option[`social_media_name_${locale}`]
                                                                        }}</span>
                                                                </div>
                                                            </template>
                                                        </Select>
                                                        <p v-if="errors?.[`social_media[${index}].social_media_id`]"
                                                            class="text-red-500 text-sm mt-1">
                                                            {{ errors[`social_media[${index}].social_media_id`] }}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td class="align-top">
                                                    <div class="space-y-0">
                                                        <InputText v-model="field.value.social_media_link"
                                                            class="w-full custom-border bg-transparent"
                                                            :placeholder="`${t('ลิ้งโซเชียล')}...`" />
                                                        <p v-if="errors?.[`social_media[${index}].social_media_link `]"
                                                            class="text-red-500 text-sm">
                                                            {{ errors[`social_media[${index}].social_media_link `] }}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td class="align-top">
                                                    <Button :loading="isloadingAxi" icon="pi pi-times" severity="danger"
                                                        size="small" @click="deleteShopSocialMedia(index, field)"
                                                        rounded aria-label="Cancel" />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- ========== BANK ========== -->
                            <div>
                                <h2 class="font-semibold text-lg mb-2">{{ t('เลขที่บัญชี') }}</h2>

                                <Button :loading="isloadingAxi" size="small" type="button" class="mb-3" 
                                    :label="t('เพิ่มเลขที่บัญชี')" @click="pushBank({
                                        business_bank_name_i18n: { th: '', en: '', cn: '' },
                                        business_bank_account_i18n: { th: '', en: '', cn: '' },
                                        business_bank_account_number: '',
                                    })" :pt="{
        label: { class: 'text-white' },
        root: { class: '!border-primary-main !bg-primary-second' },
    }" />

                                <!-- Skeleton Loading: Bank -->
                                <div v-if="isLoading" class="mt-3 space-y-3">
                                    <Skeleton width="10rem" height="1.25rem" class="rounded-md" />
                                    <div class="grid grid-cols-[11rem,11rem,10rem,2.5rem] gap-3">
                                        <Skeleton height="2.5rem" class="rounded-md" />
                                        <Skeleton height="2.5rem" class="rounded-md" />
                                        <Skeleton height="2.5rem" class="rounded-md" />
                                        <Skeleton width="2.5rem" height="2.5rem" class="rounded-md" />
                                    </div>
                                    <div class="grid grid-cols-[11rem,11rem,10rem,2.5rem] gap-3">
                                        <Skeleton height="2.5rem" class="rounded-md" />
                                        <Skeleton height="2.5rem" class="rounded-md" />
                                        <Skeleton height="2.5rem" class="rounded-md" />
                                        <Skeleton width="2.5rem" height="2.5rem" class="rounded-md" />
                                    </div>
                                </div>

                                <!-- Empty State: Bank -->
                                <div v-else-if="!fieldsBank || fieldsBank.length === 0"
                                    class="mt-3 border border-dashed rounded-md p-4 text-center text-zinc-500">
                                    <i class="pi pi-credit-card mb-2 text-xl block"></i>
                                    <div class="text-sm">{{ t('ยังไม่มีข้อมูลบัญชีธนาคาร') }}</div>
                                </div>

                                <!-- Table: Bank -->
                                <div v-else class="mt-3">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th class="text-start" style="width: 11rem">{{ t('ธนาคาร') }}</th>
                                                <th class="text-start" style="width: 11rem">{{ t('ชื่อบัญชี') }}</th>
                                                <th class="text-start" style="width: 10rem">{{ t('เลขบัญชี') }}</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(field, index) in fieldsBank" :key="field.key">
                                                <!-- ชื่อธนาคาร (i18n) -->
                                                <td class="align-top">
                                                    <div class="space-y-0">
                                                        <InputText
                                                            v-model="field.value.business_bank_name_i18n[lang.code]"
                                                            class="w-full custom-border" :placeholder="t('ธนาคาร')" />
                                                        <p v-if="errors?.[`business_bank[${index}].business_bank_name_i18n.${lang.code}`]"
                                                            class="text-red-500 text-sm mt-1">
                                                            {{
                                                                errors[`business_bank[${index}].business_bank_name_i18n.${lang.code}`]
                                                            }}
                                                        </p>
                                                    </div>
                                                </td>

                                                <!-- ชื่อบัญชี (i18n) -->
                                                <td class="align-top">
                                                    <div class="space-y-0">
                                                        <InputText
                                                            v-model="field.value.business_bank_account_i18n[lang.code]"
                                                            class="w-full custom-border"
                                                            :placeholder="t('ชื่อบัญชี')" />
                                                        <p v-if="errors?.[`business_bank[${index}].business_bank_account_i18n.${lang.code}`]"
                                                            class="text-red-500 text-sm mt-1">
                                                            {{
                                                                errors[`business_bank[${index}].business_bank_account_i18n.${lang.code}`]
                                                            }}
                                                        </p>
                                                    </div>
                                                </td>

                                                <!-- เลขบัญชี -->
                                                <td class="align-top">
                                                    <div class="space-y-0">
                                                        <InputText v-model="field.value.business_bank_account_number"
                                                            v-keyfilter.int class="w-full custom-border"
                                                            :placeholder="t('เลขบัญชี')" />
                                                        <p v-if="errors?.[`business_bank[${index}].business_bank_account_number`]"
                                                            class="text-red-500 text-sm mt-1">
                                                            {{
                                                                errors[`business_bank[${index}].business_bank_account_number`]
                                                            }}
                                                        </p>
                                                    </div>
                                                </td>

                                                <!-- Actions -->
                                                <td class="align-top">
                                                    <Button :loading="isloadingAxi" icon="pi pi-times" severity="danger"
                                                        size="small" @click="onRemoveBank(index)" rounded
                                                        aria-label="Cancel" />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </van-tab>
                </van-tabs>
            </div>

            <div class="flex justify-start mt-4 mb-4">
                <Button :loading="isloadingAxi" :label="t('บันทึก')" size="small" severity="primary" type="submit"
                    class="w-[5rem]" :pt="{
                        label: {
                            class: 'text-white'
                        },
                        root: {
                            class: '!border-primary-main !bg-primary-second'
                        },

                    }" />
            </div>

        </Form>



        <NotifyMessage v-model:show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
            :life="toast.life" />
        <NotificationPopup v-model:visible="notification.visible" :state="notification.state"
            :title="notification.title" :detail="notification.detail" :timeout="notification.timeout"
            :redirect-url="notification.redirectUrl" :auto-close="notification.autoClose" />
    </section>
</template>

<style scoped></style>

<script setup>
definePageMeta({
    middleware: ["auth"],
});
import { useConfirm } from 'primevue/useconfirm'
import { useI18n } from 'vue-i18n';
const { t, locale, setLocale } = useI18n();

const isloadingAxi = useState("isloadingAxi");
const router = useRouter();
const route = useRoute();

const isLoading = ref(true) // คุมสเกเลตอน
import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import * as dataApi from "../api/data.js";

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

const confirm1 = useConfirm()

// Language configuration
const langs = [
    { code: 'th', label: 'ภาษาไทย', locale: 'th' },
    { code: 'en', label: 'English', locale: 'en' },
    { code: 'cn', label: '中文', locale: 'cn' }
];
const activeLangTab = ref(0);


watch(activeLangTab, (newIdx) => {
    setLocale(langs[newIdx].locale);
});


// เมื่อเปลี่ยน locale
watch(locale, (newLocale) => {
    const idx = langs.findIndex(l => l.locale === newLocale);
    if (idx !== -1) activeLangTab.value = idx;
});


const resSociaMedia = ref([])
const loadSocialMedia = async () => {
    try {
        const res = await dataApi.getSocialMedia();
        resSociaMedia.value = res.data.data.map(item => ({
            social_media_name_th: item.social_media_name_i18n?.th,
            social_media_name_en: item.social_media_name_i18n?.en,
            social_media_name_cn: item.social_media_name_i18n?.cn,
            ...item,
        }));
        console.log(resSociaMedia.value)
    } catch (error) {
        console.error(error)
    }
}
const getSocialName = (id, code) => {
    if (!id || !code) return ''
    const found = resSociaMedia.value.find((x) => x.id === id)
    return found ? found[`social_media_name_${code}`] : ''
}
const getIconClass = (id) => {
    const found = resSociaMedia.value.find((x) => x.id === id)
    return found ? found.icon : ''
}
onMounted(() => loadSocialMedia());
const requireValue = t('กรุณาระบุข้อมูลให้ถูกต้อง');
const requireText = t('ระบุข้อมูล');
// *************  VARIDATOR
const validationSchema = toTypedSchema(
    zod.object({
        social_media: zod.array(
            zod.object({
                social_media_id: zod.string().nonempty(t('เลือกประเภทโซเชียล')).default(""),
                social_media_link: zod
                    .string()
                    .url(t('กรุณาระบุลิงก์ที่ถูกต้อง'))
                    .nonempty(t('กรุณาระบุข้อมูลลิงก์')),
            })
        ).default([]),
        business_bank: zod
            .array(
                zod.object({
                    business_bank_name_i18n: zod.object({
                        th: zod.string().min(1, requireValue),
                        en: zod.string().optional().or(zod.literal('')),
                        cn: zod.string().optional().or(zod.literal('')),
                    }),
                    business_bank_account_i18n: zod.object({
                        th: zod.string().min(1, requireValue),
                        en: zod.string().optional().or(zod.literal('')),
                        cn: zod.string().optional().or(zod.literal('')),
                    }),
                    business_bank_account_number: zod.string().min(1, requireValue),
                })
            ).default([]),

    })
);
const { setValues, handleSubmit, handleReset, errors } = useForm({
    initialValues: {

    },
    validationSchema,
});


// const { push, fields, remove } = useFieldArray("social_media");
const { remove: remove1, push: push1, fields: fields1 } = useFieldArray("social_media");
const { remove: removeBank, push: pushBank, fields: fieldsBank } = useFieldArray('business_bank')

const onRemoveBank = (index) => {
    const item = fieldsBank.value[index]?.value

    confirm1.require({
        message: `${t('ยืนยันการลบ')}?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: t('ยกเลิก'),
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: t('ตกลง')
        },
        accept: async () => {
            try {

                // ถ้ามี id จาก backend → ยิงลบก่อน
                if (item?.id) {
                    await dataApi.deleteShopBank(item.id)
                }
                // ลบออกจาก array ของฟอร์ม
                removeBank(index)

                toast.value = {
                    show: true,
                    type: 'success',
                    title: t('สำเร็จ'),
                    message: t('ลบรายการบัญชีธนาคารออกจากรายการสำเร็จ'),
                    life: 1500
                }
            } catch (e) {
                toast.value = {
                    show: true,
                    type: 'error',
                    title: t('ล้มเหลว'),
                    message: t('ลบธนาคารล้มเหลว'),
                    life: null
                }
                console.error('delete bank failed:', e)
            }
        },
        reject: () => { }
    })
}

const deleteShopSocialMedia = (index) => {
    const item = fields1.value[index]?.value

    confirm1.require({
        message: `${t('ยืนยันการลบ')}?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: t('ยกเลิก'),
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: t('ตกลง')
        },
        accept: async () => {
            try {
                // ถ้ามี id จาก backend → ยิงลบก่อน
                if (item?.id) {
                    const res = await dataApi.deleteShopSocialMedia(item.id)
                }
                // ลบออกจาก array ของฟอร์ม
                remove1(index)

                toast.value = {
                    show: true,
                    type: 'success',
                    title: t('สำเร็จ'),
                    message: t('ลบรายการโซเชียลออกจากรายการสำเร็จ'),
                    life: 1500
                }
            } catch (err) {
                console.error('deleteShopSocialMedia error:', err)
                toast.value = {
                    show: true,
                    type: 'error',
                    title: t('ล้มเหลว'),
                    message: t('ลบโซเชียลไม่สำเร็จ'),
                    life: null
                }
            }
        },
        reject: () => { }
    })
}

const handleNext = handleSubmit(async (values) => {
    try {
        const business_bank_array = (fieldsBank.value || []).map(f => ({
            id: f.value?.id || '',
            business_bank_name_i18n: {
                th: f.value?.business_bank_name_i18n?.th || '',
                en: f.value?.business_bank_name_i18n?.en || '',
                cn: f.value?.business_bank_name_i18n?.cn || '',
            },
            business_bank_account_i18n: {
                th: f.value?.business_bank_account_i18n?.th || '',
                en: f.value?.business_bank_account_i18n?.en || '',
                cn: f.value?.business_bank_account_i18n?.cn || '',
            },
            business_bank_account_number: String(f.value?.business_bank_account_number ?? ''),
        }))

        const social_media_array = (fields1.value || []).map(f => ({
            id: f.value?.id || '',                        // ว่าง = add ใหม่
            social_media_id: f.value?.social_media_id || null,
            social_media_link: f.value?.social_media_link || null,
        }))
        const payload = {
            business_social_media: social_media_array,
            business_bank: business_bank_array
        }


        const res = await dataApi.updateBusinessBankSocial(route.params.id, payload)
        toast.value = {
            show: true,
            type: 'success',
            title: t('สำเร็จ'),
            message: t('อัพเดทข้อมูลสถานที่ท่องเที่ยวสำเร็จ'),
            life: 1500
        }

    } catch (error) {
        toast.value = {
            show: true,
            type: 'error',
            title: t('ล้มเหลว'),
            message: t('บันทึกข้อมูลไม่สำเร็จ'),
            life: null
        }
        console.error('update error:', error)
    } finally {

    }
})


const onSelectChange = (e) => {
};
// const props = defineProps({
//   resInfo: { type: Object, default: null }
// })

// ถ้ายังไม่มีตัวช่วย ก็ใส่ไว้สั้น ๆ แบบนี้ได้ (ถ้ามีอยู่แล้วก็ใช้ของเดิมได้เลย)


// watch(
//   () => props.resInfo,
//   (d) => {
//     if (!d) return

//     // ---------------- Social (คงเดิม ไม่แก้) ----------------
//     fields1.value.splice(0)
//     const list = Array.isArray(d.business_social_media) ? d.business_social_media : []
//     list.forEach(sm => {
//       push1({
//         id: sm.id ?? '',
//         social_media_id: sm.social_media_id ?? '',
//         social_media_link: sm.social_media_link ?? '',
//       })
//     })

//     // ---------------- Bank (เพิ่มใหม่) ----------------
//     fieldsBank.value.splice(0)
//     const banks = Array.isArray(d.business_bank) ? d.business_bank : []
//     banks.forEach(b => {
//       pushBank({
//         id: b.id ?? '',
//         business_bank_name_i18n: normI18n(b.business_bank_name_i18n),
//         business_bank_account_i18n: normI18n(b.business_bank_account_i18n),
//         business_bank_account_number: b.business_bank_account_number ?? '',
//       })
//     })

//     isloadingAxi.value = false
//   },
//   { immediate: true }
// )
const normI18n = (v) =>
    v && typeof v === 'object'
        ? { th: v.th ?? '', en: v.en ?? '', cn: v.cn ?? '' }
        : { th: v ?? '', en: '', cn: '' }
const resGetBusiness = ref(null)
const loadForEdit = async () => {
    try {
        isLoading.value = true
        const { data } = await dataApi.getBusinessById(route.params.id)
        const d = data?.data || {}
        resGetBusiness.value = d

        // ---------- เติม SOCIAL (คงรูปแบบเดิม ไม่เปลี่ยน) ----------
        fields1.value.splice(0)
        const socials = Array.isArray(d.business_social_media) ? d.business_social_media : []
        socials.forEach(sm => {
            push1({
                id: sm.id ?? '',
                social_media_id: sm.social_media_id ?? '',
                social_media_link: sm.social_media_link ?? '',
            })
        })

        // ---------- เติม BANK (เพิ่มเข้ามา) ----------
        fieldsBank.value.splice(0)
        const banks = Array.isArray(d.business_bank) ? d.business_bank : []
        banks.forEach(b => {
            pushBank({
                id: b.id ?? '',
                business_bank_name_i18n: normI18n(b.business_bank_name_i18n),
                business_bank_account_i18n: normI18n(b.business_bank_account_i18n),
                business_bank_account_number: b.business_bank_account_number ?? '',
            })
        })

    } catch (e) {
        console.error(e)
    } finally {
        isLoading.value = false
    }
}

// เรียกใช้ตอนเข้าเพจ
onMounted(() => {
    loadForEdit()
})

</script>
