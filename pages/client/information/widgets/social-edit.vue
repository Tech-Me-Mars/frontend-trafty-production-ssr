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
    })
);
const { setValues, handleSubmit, handleReset, errors } = useForm({
    initialValues: {

    },
    validationSchema,
});


// const { push, fields, remove } = useFieldArray("social_media");
const { remove: remove1, push: push1, fields: fields1 } = useFieldArray("social_media");

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
        const social_media_array = (fields1.value || []).map(f => ({
            id: f.value?.id || '',                        // ว่าง = add ใหม่
            social_media_id: f.value?.social_media_id || null,
            social_media_link: f.value?.social_media_link || null,
        }))
        fd.append('business_social_media', JSON.stringify(social_media_array))
        const res = await dataApi.updateShopById(route.params.id, fd)
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
// watch(
//   () => props.resInfo,
//   (d) => {
//     if (!d) return

//     // (ถ้าคุณอยากเก็บไว้ใช้งานในไฟล์นี้ต่อ)
//     // resGetBusiness.value = d

//     // เคลียร์รายการเดิมก่อน
//     fields1.value.splice(0)

//     // ป้องกันกรณีฟิลด์เป็น null/ไม่ใช่อาร์เรย์
//     const list = Array.isArray(d.business_social_media) ? d.business_social_media : []

//     // เติมรายการ
//     list.forEach(sm => {
//       push1({
//         id: sm.id ?? '',                    // เก็บ id ไว้ใช้ลบ/อัปเดต
//         social_media_id: sm.social_media_id ?? '',
//         social_media_link: sm.social_media_link ?? '',
//       })
//     })

//     // ปิดโหลด (ถ้ามี state โหลดในหน้านี้)
//     isloadingAxi.value = false
//   },
//   { immediate: true } // ให้รันทันทีรอบแรกเมื่อคอมโพเนนต์ถูก mount แล้ว props มากะทันหัน/มาทีหลัง
// )
onMounted(async () => {
    await loadForEdit()
})
const resGetBusiness = ref(null)
const loadForEdit = async () => {
    try {
        const { data } = await dataApi.getBusinessById(route.params.id)
        const d = data?.data || {}
        resGetBusiness.value = data?.data || {}
        // ----- Social Media -----
        fields1.value.splice(0)
            ; (d.business_social_media || []).forEach(sm => {
                push1({
                    id: sm.id,                              // เก็บ id ไว้ส่งกลับ (แก้ไข/คงไว้)
                    social_media_id: sm.social_media_id,
                    social_media_link: sm.social_media_link,
                })
            })
    } catch (e) {
        console.error(e)
    } finally {
        isloadingAxi.value = false
    }
}

</script>
<template>
    <section>
            <!-- {{ props.resInfo }} -->
        <Form @submit="handleNext">

            <div>
                <h4 class="section-title">{{ t('ช่องทางโซเชียลมีเดีย') }}</h4>
                <Button :loading="isloadingAxi" type="button" :label="t('เพิ่มรายการโซเชียล')" @click="push1({
                    social_media_id: undefined,
                    social_media_link: undefined,
                })" :pt="{
                    label: {
                        class: 'text-white'
                    },
                    root: {
                        class: '!border-primary-main !bg-primary-second'
                    },

                }" />

                <div id="table-socia-media" v-if="fields1?.length > 0">
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 8rem" class="text-start">{{ t('ประเภทโซเชียล') }}
                                </th>
                                <th class="text-start">{{ t('ลิ้งค์') }}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(field, index) in fields1" :key="field.key">

                                <td style="width: 8rem;" class="align-top ">
                                    <div class="space-y-0">


                                        <Select v-model="field.value.social_media_id" :options="resSociaMedia" style=""
                                            optionLabel="id" optionValue="id" class="w-full h-full custom-border"
                                            :placeholder="`${t('ประเภทโซเชียล')}...`"
                                            @change="((e) => { onSelectChange(e) })">
                                            <template #value="slotProps">
                                                <span class="flex items-center space-x-2">
                                                    <template v-if="slotProps.value">
                                                        <i :class="getIconClass(slotProps.value)" class="text-lg"></i>
                                                        <span>
                                                            {{ getSocialName(slotProps.value,
                                                                locale)
                                                            }}
                                                        </span>
                                                    </template>
                                                    <template v-else>
                                                        {{ t('ประเภทโซเชียล') }}...
                                                    </template>
                                                </span>
                                            </template>
                                            <template #option="slotProps">
                                                <div class="flex items-center space-x-2">
                                                    <i :class="slotProps.option.icon" class="text-lg"></i>
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

                                <!-- Column: Social Link -->
                                <td class="align-top ">
                                    <div class="space-y-0">
                                        <InputText v-model="field.value.social_media_link" class="w-full custom-border"
                                            :placeholder="`${t('ลิ้งโซเชียล')}...`" />
                                        <p v-if="errors?.[`social_media[${index}].social_media_link `]"
                                            class="text-red-500 text-sm">
                                            {{ errors[`social_media[${index}].social_media_link `]
                                            }}
                                        </p>
                                    </div>
                                </td>

                                <!-- Column: Actions -->
                                <td class="align-top">
                                    <Button :loading="isloadingAxi" icon="pi pi-times" severity="danger" size="small"
                                        @click="deleteShopSocialMedia(index, field)" rounded aria-label="Cancel" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>


            </div>

            <!-- <div class="flex justify-end mt-4 mb-4">
                <Button :loading="isloadingAxi" :label="t('ถัดไป')" severity="primary" type="submit" rounded
                    class="w-full" :pt="{
                        root: {
                            class: '!border-primary-main'
                        },
                    }" />
            </div> -->

        </Form>



        <NotifyMessage v-model:show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
            :life="toast.life" />
        <NotificationPopup v-model:visible="notification.visible" :state="notification.state"
            :title="notification.title" :detail="notification.detail" :timeout="notification.timeout"
            :redirect-url="notification.redirectUrl" :auto-close="notification.autoClose" />
    </section>
</template>

<style scoped></style>
