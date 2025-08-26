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

// URL -> File (ถ้า CORS บล็อค จะ fallback เป็นแค่ preview ได้)
// const urlToFile = async (url, filename = 'image.jpg') => {
//   const res = await fetch(url, { mode: 'cors' })
//   const blob = await res.blob()
//   return new File([blob], filename, { type: blob.type || 'image/jpeg' })
// }




const confirm1 = useConfirm()

// Language configuration
const langs = [
    { code: 'th', label: 'ภาษาไทย', locale: 'th' },
    { code: 'en', label: 'English', locale: 'en' },
    { code: 'cn', label: '中文', locale: 'cn' }
];

const activeLangTab = ref(0);
onMounted(() => {
    setLocale('th')
})

watch(activeLangTab, (newIdx) => {
    setLocale(langs[newIdx].locale);
});


// เมื่อเปลี่ยน locale
watch(locale, (newLocale) => {
    const idx = langs.findIndex(l => l.locale === newLocale);
    if (idx !== -1) activeLangTab.value = idx;
});


// test update main
// const days = [
//     { label: t('จันทร์'), value: t('จันทร์') },
//     { label: t('อังคาร'), value: t('อังคาร') },
//     { label: t('พุธ'), value: t('พุธ') },
//     { label: t('พฤหัสบดี'), value: t('พฤหัสบดี') },
//     { label: t('ศุกร์'), value: t('ศุกร์') },
//     { label: t('เสาร์'), value: t('เสาร์') },
//     { label: t('อาทิตย์'), value: t('อาทิตย์') },
// ];
// ✅ Days mapping - แต่ละวันจะมี key เหมือนกันเพื่อใช้ sync
const days = [
    { index: 0, label: t('จันทร์'), th: 'จันทร์', en: 'monday', cn: '周一' },
    { index: 1, label: t('อังคาร'), th: 'อังคาร', en: 'tuesday', cn: '周二' },
    { index: 2, label: t('พุธ'), th: 'พุธ', en: 'wednesday', cn: '周三' },
    { index: 3, label: t('พฤหัสบดี'), th: 'พฤหัสบดี', en: 'thursday', cn: '周四' },
    { index: 4, label: t('ศุกร์'), th: 'ศุกร์', en: 'friday', cn: '周五' },
    { index: 5, label: t('เสาร์'), th: 'เสาร์', en: 'saturday', cn: '周六' },
    { index: 6, label: t('อาทิตย์'), th: 'อาทิตย์', en: 'sunday', cn: '周日' }
]

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
        shop_province_id: zod.number({ required_error: t('กรุณาเลือกจังหวัด'), invalid_type_error: t('กรุณาเลือกจังหวัด'), }),
        shop_district_id: zod.number({ required_error: t('กรุณาเลือกอำเภอ'), invalid_type_error: t('กรุณาเลือกอำเภอ'), }),
        shop_subdistrict_id: zod.number({ required_error: t('กรุณาเลือกตำบล'), invalid_type_error: t('กรุณาเลือกตำบล'), }),

        // รองรับหลายภาษา
        shop_name: zod.object({
            th: zod.string().min(1, t('กรุณากรอก')),
            en: zod.string().optional().or(zod.literal('')),
            cn: zod.string().optional().or(zod.literal('')),
        }),
        shop_address: zod.object({
            th: zod.string().min(1, requireValue),
            en: zod.string().optional().or(zod.literal('')),
            cn: zod.string().optional().or(zod.literal('')),
        }),
        shop_days: zod.object({
            th: zod.array(zod.string()).min(1, t('กรุณาเลือกวันที่ทำการ (TH)')),
            en: zod.array(zod.string()).optional().default([]),
            cn: zod.array(zod.string()).optional().default([]),
        }),
        shop_details: zod.object({
            th: zod.string().min(1, requireValue),
            en: zod.string().optional().or(zod.literal('')),
            cn: zod.string().optional().or(zod.literal('')),
        }),
        latitude: zod.number({ required_error: t('เลือกตำแหน่งแผนที่เพื่อระบุละติจูด'), invalid_type_error: t('เลือกตำแหน่งแผนที่เพื่อระบุละติจูด'), }),
        longitude: zod.number({ required_error: t('เลือกตำแหน่งแผนที่เพื่อระบุลองจิจูด'), invalid_type_error: t('เลือกตำแหน่งแผนที่เพื่อระบุลองจิจูด'), }),

        // ฟิลด์ภาษาเดียว
        shop_time_s: zod.date({
            required_error: requireValue,
            invalid_type_error: requireValue,
        }),
        shop_time_e: zod.date({
            required_error: requireValue,
            invalid_type_error: requireValue,
        }),
        shop_phone: zod.string().nonempty(t('กรุณาระบุเบอร์โทร')),

        social_media: zod.array(
            zod.object({
                social_media_id: zod.string().nonempty(t('เลือกประเภทโซเชียล')).default(""),
                social_media_link: zod
                    .string()
                    .url(t('กรุณาระบุลิงก์ที่ถูกต้อง'))
                    .nonempty(t('กรุณาระบุข้อมูลลิงก์')),
            })
        ),
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
            )
            .min(0, t('กรุณาเพิ่มอย่างน้อย 1 บัญชี')),


        image_cover: zod
            .union([
                zod.object({ src: zod.string() }),
                zod.instanceof(File),
            ])
            .refine(
                (value) =>
                    !(value instanceof File) || value.size > 0,
                { message: t('กรุณาอัปโหลดรูปภาพหน้าปก') }
            ),

        image_profile: zod
            .union([
                zod.object({ src: zod.string() }),
                zod.instanceof(File),
            ])
            .refine(
                (value) =>
                    !(value instanceof File) || value.size > 0,
                { message: t('กรุณาอัปโหลดรูปโปรไฟล์') }
            ),

        business_img: zod.custom((value) => {
            if (value != null && (Array.isArray(value) ? value.length > 0 : true)) {
                return value;
            }
        }),
    })
);
const { setValues, handleSubmit, handleReset, errors } = useForm({
    initialValues: {
        // social_media: [
        //     {
        //         social_media_id: "",
        //         social_media_link: ""

        //     },
        // ],
        // business_bank: [
        //     {
        //         business_bank_name_i18n: { th: '', en: '', cn: '' },
        //         business_bank_account_i18n: { th: '', en: '', cn: '' },
        //         business_bank_account_number: '',
        //     },
        // ],

    },
    validationSchema,
});


// ====== Multi-language fields ======
const { value: shopNameTh } = useField('shop_name.th', undefined, { initialValue: '' });
const { value: shopNameEn } = useField('shop_name.en', undefined, { initialValue: '' });
const { value: shopNameCn } = useField('shop_name.cn', undefined, { initialValue: '' });

const { value: shopAddressTh } = useField('shop_address.th', undefined, { initialValue: '' });
const { value: shopAddressEn } = useField('shop_address.en', undefined, { initialValue: '' });
const { value: shopAddressCn } = useField('shop_address.cn', undefined, { initialValue: '' });

const { value: shopDaysTh } = useField('shop_days.th', undefined, { initialValue: [] });
const { value: shopDaysEn } = useField('shop_days.en', undefined, { initialValue: [] });
const { value: shopDaysCn } = useField('shop_days.cn', undefined, { initialValue: [] });

const { value: shopDetailsTh } = useField('shop_details.th', undefined, { initialValue: '' });
const { value: shopDetailsEn } = useField('shop_details.en', undefined, { initialValue: '' });
const { value: shopDetailsCn } = useField('shop_details.cn', undefined, { initialValue: '' });
// ====== Computed for template binding ======
const shop_name = ref({
    get th() { return shopNameTh.value },
    set th(v) { shopNameTh.value = v },
    get en() { return shopNameEn.value },
    set en(v) { shopNameEn.value = v },
    get cn() { return shopNameCn.value },
    set cn(v) { shopNameCn.value = v }
});

const shop_address = ref({
    get th() { return shopAddressTh.value },
    set th(v) { shopAddressTh.value = v },
    get en() { return shopAddressEn.value },
    set en(v) { shopAddressEn.value = v },
    get cn() { return shopAddressCn.value },
    set cn(v) { shopAddressCn.value = v }
});

const shop_days = ref({
    get th() { return shopDaysTh.value },
    set th(v) { shopDaysTh.value = v },
    get en() { return shopDaysEn.value },
    set en(v) { shopDaysEn.value = v },
    get cn() { return shopDaysCn.value },
    set cn(v) { shopDaysCn.value = v }
});

function onShopDayChange(triggerLang) {
    // 1. รอ DOM/checkbox update ให้เสร็จ (ใช้ nextTick)
    nextTick(() => {
        const selectedIndexes = days
            .map((day, idx) => shop_days.value[triggerLang].includes(day[triggerLang]) ? idx : -1)
            .filter(i => i !== -1)
        langs.forEach((lang) => {
            if (lang.code === triggerLang) return

            shop_days.value[lang.code] = selectedIndexes.map(i => days[i][lang.code])
        })
    })
}



const shop_details = ref({
    get th() { return shopDetailsTh.value },
    set th(v) { shopDetailsTh.value = v },
    get en() { return shopDetailsEn.value },
    set en(v) { shopDetailsEn.value = v },
    get cn() { return shopDetailsCn.value },
    set cn(v) { shopDetailsCn.value = v }
});
// ====== Single-language fields ======
const { value: image_profile } = useField('image_profile');
const { value: image_cover } = useField('image_cover');
const { value: shop_phone } = useField('shop_phone');
const { value: shop_time_s } = useField('shop_time_s');
const { value: shop_time_e } = useField('shop_time_e');
const { value: latitude } = useField('latitude');
const { value: longitude } = useField('longitude');
const { value: business_img } = useField('business_img', null, { initialValue: [] });

const { value: shop_province_id } = useField('shop_province_id');
const { value: shop_district_id } = useField('shop_district_id');
const { value: shop_subdistrict_id } = useField('shop_subdistrict_id');


// const { push, fields, remove } = useFieldArray("social_media");
const { remove: remove1, push: push1, fields: fields1 } = useFieldArray("social_media");
const { remove: removeBank, push: pushBank, fields: fieldsBank } = useFieldArray('business_bank')


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

import { format } from 'date-fns';

const handleNext = handleSubmit(async (values) => {
    try {

        // เวลาเปิด-ปิด -> "HH:mm-HH:mm"
        const time_start = format(shop_time_s.value, 'HH:mm')
        const time_end = format(shop_time_e.value, 'HH:mm')
        const shop_time = `${time_start}-${time_end}`

        // จัดเรียงวันทำการให้คงลำดับมาตรฐาน
        const sortedShopDays = {}
            ;['th', 'en', 'cn'].forEach(lang => {
                sortedShopDays[lang] = [...(shop_days.value[lang] || [])].sort(
                    (a, b) => days.map(d => d[lang]).indexOf(a) - days.map(d => d[lang]).indexOf(b)
                )
            })

        // social media (รองรับทั้งแก้ไข/เพิ่มใหม่)
        const social_media_array = (fields1.value || []).map(f => ({
            id: f.value?.id || '',                        // ว่าง = add ใหม่
            social_media_id: f.value?.social_media_id || null,
            social_media_link: f.value?.social_media_link || null,
        }))

        // bank (รองรับทั้งแก้ไข/เพิ่มใหม่)
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

        // business_img: แนบไฟล์เฉพาะที่มี, และส่ง id เดิมกลับไปด้วย
        const bizImgIds = []
            ; (business_img.value || []).forEach(img => {
                if (img?.id) bizImgIds.push({ id: img.id, status: true })
            })

        // >>> สร้าง FormData ตามรูปแบบ API <<<
        const fd = new FormData()

        // (ใส่พารามิเตอร์ชุดนี้ถ้า endpoint ต้องการครบ; มีจาก store อยู่แล้ว)
        if (resGetBusiness.value?.service_type_id) fd.append('service_type_id', resGetBusiness.value?.service_type_id)
        if (resGetBusiness.value?.business_type_id) fd.append('business_type_id', resGetBusiness.value?.business_type_id)
        if (resGetBusiness.value?.business_model_id) fd.append('business_model_id', resGetBusiness.value?.business_model_id)

        // i18n fields
        fd.append('shop_name_i18n', JSON.stringify(values.shop_name))
        fd.append('shop_address_i18n', JSON.stringify(values.shop_address))
        fd.append('shop_details_i18n', JSON.stringify(values.shop_details))

        // วันทำการ (รูปแบบเดียวกับ cURL: ค่าแต่ละภาษาเป็น "สตริงของ JSON array")
        fd.append(
            'business_open_date_i18n',
            JSON.stringify({
                th: JSON.stringify(sortedShopDays.th || []),
                en: JSON.stringify(sortedShopDays.en || []),
                cn: JSON.stringify(sortedShopDays.cn || []),
            })
        )

        // ที่อยู่/พิกัด/เวลา/เบอร์
        fd.append('shop_province_id', String(values.shop_province_id))
        fd.append('shop_district_id', String(values.shop_district_id))
        fd.append('shop_subdistrict_id', String(values.shop_subdistrict_id))
        fd.append('shop_time', shop_time)
        fd.append('shop_phone', String(values.shop_phone || ''))
        fd.append('latitude', String(latitude.value ?? ''))
        fd.append('longitude', String(longitude.value ?? ''))

        // รูปเดี่ยว: แนบเฉพาะที่มีไฟล์จริง (ถ้าโหลดจาก URL แล้ว CORS บล็อก จะไม่มีไฟล์ -> ปล่อยว่างเพื่อคงรูปเดิม)
        if (image_cover.value?.file instanceof File) {
            fd.append('image_cover', image_cover.value.file, image_cover.value.file.name)
        }
        if (image_profile.value?.file instanceof File) {
            fd.append('image_profile', image_profile.value.file, image_profile.value.file.name)
        }

        // รูปหลายใบ: แนบไฟล์ใหม่ทั้งหมด ...

        for (const img of (business_img.value || [])) {
            if (img?.file instanceof File) {
                fd.append('business_img', img.file, img.file.name)
            }
        }
        fd.append('business_img_id', JSON.stringify(bizImgIds))

        // social & bank
        fd.append('business_social_media', JSON.stringify(social_media_array))
        fd.append('business_bank', JSON.stringify(business_bank_array))

        // >>> ยิงอัปเดต <<<
        const res = await dataApi.updateShopById(route.params.id, fd)
        toast.value = {
            show: true,
            type: 'success',
            title: t('สำเร็จ'),
            message: t('อัพเดทข้อมูลสถานที่ท่องเที่ยวสำเร็จ'),
            life: 1500
        }
        // ไปหน้าต่อไปหรือจบด้วย toast ก็ได้

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
const getFieldError = (fieldName, langCode = null) => {
    if (langCode) {
        return errors.value[`${fieldName}.${langCode}`] || null;
    }
    return errors.value[fieldName] || null;
};

// function onFileSelect(event) {
//     event.files.forEach(file => {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//             business_img.value.push({ src: e.target.result, file: file });  // Store both the image preview and the file
//         };
//         reader.readAsDataURL(file);  // Read the file as a data URL
//     });
// }
function onFileSelect(event) {
    event.files.forEach(file => {
        if (business_img.value.length >= 3) return; // จำกัดจำนวนไฟล์ที่ 5

        const reader = new FileReader();
        reader.onload = (e) => {
            if (business_img.value.length < 3) { // ตรวจสอบอีกครั้งก่อน push
                business_img.value.push({ src: e.target.result, file: file });
            }
        };
        reader.readAsDataURL(file);
    });
}

const removeImage = (index) => {
    const item = business_img.value[index]

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

                // ถ้ามี id ให้ยิง API ลบรูปก่อน
                if (item?.id) {
                    await dataApi.deleteShopImg(item.id)
                }
                // ลบออกจาก array
                business_img.value.splice(index, 1)
                toast.value = {
                    show: true,
                    type: 'success',
                    title: t('สำเร็จ'),
                    message: t('ลบรายการรูปสำเร็จ'),
                    life: 1500
                }
            } catch (e) {
                toast.value = {
                    show: true,
                    type: 'error',
                    title: t('ล้มเหลว'),
                    message: t('ลบรูปล้มเหลว'),
                    life: null
                }
                console.error('delete image failed:', e)
            } finally {
            }
        },
        // ไม่ต้องทำอะไรถ้า reject
        reject: () => { }
    })
}
const fileInput = ref(null);
const triggerFileInput = () => {
    // console.log('triggerFileInput',fileInput.value[0])
    fileInput.value[0].choose();
};

// Reference to the hidden file input
const fileInputBgCover = ref(null);

// Handle file selection
const onFileSelectBgCover = (event) => {
    const file = event.target.files[0]; // Get the first selected file
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Set the image source for preview and keep the file for upload
            image_cover.value = { src: e.target.result, file: file };
            console.log('image_cover', image_cover.value)
        };
        reader.readAsDataURL(file); // Read the file as a data URL
    }
};

// Remove the selected image
const removeImageBgCover = () => {
    image_cover.value = null; // Clear the image preview and file data
};

// Trigger the hidden file input
const triggerFileInputBgCover = () => {
    fileInputBgCover.value.click(); // Programmatically click the file input
};


// ###################### profile ##############

// Reference to the hidden file input
const fileInputBgProfile = ref(null);

// Handle file selection
const onFileSelectBgProfile = (event) => {
    const file = event.target.files[0]; // Get the first selected file
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Set the image source for preview and keep the file for upload
            image_profile.value = { src: e.target.result, file: file };
            console.log('image_profile', image_profile.value)
        };
        reader.readAsDataURL(file); // Read the file as a data URL
    }
};

// Remove the selected image
const removeImageBgProfile = () => {
    image_profile.value = null; // Clear the image preview and file data
};

// Trigger the hidden file input
const triggerFileInputProfile = () => {
    console.log('triggerFileInputProfile')
    fileInputBgProfile.value.click(); // Programmatically click the file input
};


const mapWrapperRefs = ref([]) // เก็บ container แต่ละ tab
//  MAP SECTIONS 
let map = null

const initMap = () => {
    const mapDiv = document.getElementById('map')
    if (!mapDiv || !window.longdo) return
    map = new window.longdo.Map({
        placeholder: mapDiv,
        zoom: 12,
        location: { lat: 13.736717, lon: 100.523186 }
    })
}
// บันทึกตำแหน่ง wrapper ของแต่ละ tab
const setMapWrapper = (el, idx) => {
    mapWrapperRefs.value[idx] = el
}
// ย้าย #map ไปยัง tab ปัจจุบัน
const moveMapToTab = async (idx) => {
    await nextTick()
    const mapDiv = document.getElementById('map')
    const wrapper = mapWrapperRefs.value[idx]
    if (mapDiv && wrapper) {
        wrapper.appendChild(mapDiv)
        mapDiv.style.display = 'block'
        setTimeout(() => {
            if (map) map.resize()
        }, 100)
    }
}
// เมื่อเปลี่ยน tab ให้ delay แล้ว refresh map

// ลบ Marker ทั้งหมด
const clearMarkers = () => {
    if (map) {
        map.Overlays.clear(); // ลบ Marker ทั้งหมดบนแผนที่
    }
};

// เพิ่ม Marker ตำแหน่งตรงกลางจอ
const addMarkerAtCenter = () => {
    if (!map) return;

    // ลบ Marker ทั้งหมดก่อน
    clearMarkers();

    // รับค่าพิกัดตรงกลางของแผนที่
    const center = map.location();

    // สร้าง Marker ใหม่
    const marker = new longdo.Marker(
        { lat: center.lat, lon: center.lon },
        {
            title: t('ตำแหน่งตรงกลาง'),
            detail: `Lat: ${center.lat}, Lon: ${center.lon}`,
            icon: {
                url: "/image/marker-blue.png", // ไอคอนที่กำหนดเอง
                //   offset: { x: 12, y: 45 },  // จุดอ้างอิงของไอคอน
                size: { width: 40, height: 45 }
            },
        });

    // เพิ่ม Marker ลงแผนที่
    map.Overlays.add(marker);

    // อัปเดตค่าพิกัดที่เลือก
    latitude.value = center.lat;
    longitude.value = center.lon;
};

const textSearchMap = ref();
const resLocation = ref([]);
const onLocationSearchSelect = (e) => {
    try {

        if (!e) {
            return
        }
        if (e.lat && e.lon) {
            clearMarkers();
            latitude.value = e.lat;
            longitude.value = e.lon;
            focusOnLocation(e.lat, e.lon);
        }
    } catch (error) {
        console.error("Error in selection:", error);
    }
};
// ✅ โฟกัสแผนที่ไปยังพิกัดที่เลือก
const focusOnLocation = async (lat, lon) => {
    if (!map) return;
    await clearMarkers
    const marker = new longdo.Marker(
        { lat, lon },
        {
            title: t('ตำแหน่งที่เลือก'),
            detail: `Lat: ${lat}, Lon: ${lon}`,
            icon: {
                url: "/image/marker-blue.png", // ไอคอนที่กำหนดเอง
                //   offset: { x: 12, y: 45 },  // จุดอ้างอิงของไอคอน
                size: { width: 40, height: 45 }
            },
        }
    );
    map.Overlays.add(marker);
    map.location({ lat, lon }, true);
};

// ✅ ฟังก์ชันค้นหาสถานที่จาก API
// const search = async (event) => {
//     setTimeout(() => {
//         if (!event.query.trim().length) {
//             resLocation.value = [];
//         } else {
//             if (event.query?.length >= 4) {
//                 const requestOptions = {
//                     method: "GET",
//                     redirect: "follow"
//                 };
//                 fetch(`https://search.longdo.com/mapsearch/json/search?keyword=${event.query}&limit=20&key=cffdefc2f61c2b38e32abe2c7b7e19cd`, requestOptions)
//                     .then((response) => response.json())
//                     .then((result) => {
//                         console.log("Search results:", result);
//                         resLocation.value = result.data.map(item => ({
//                             name: item.name,
//                             address: item.address || t('ไม่มีที่อยู่'),
//                             lat: item.lat,
//                             lon: item.lon,
//                             id: item.id
//                         }));
//                     })
//                     .catch((error) => console.error(error));
//             }
//         }
//     }, 250);
// };
const search = async (event) => {
    setTimeout(async () => {
        if (!event.query.trim().length) {
            resLocation.value = []
        } else if (event.query.length >= 4) {
            try {
                const { data } = await $fetch('/api/longdo-search', {
                    params: { keyword: event.query }
                })
                resLocation.value = data
            } catch (e) {
                console.error(e)
            }
        }
    }, 250)
}
// โหลดแผนที่เมื่อ DOM พร้อม

onMounted(async () => {


    await loadForEdit()
})

const onSelectChange = (e) => {
    console.log('change', e)
    //   const selected = resSociaMedia.value.find(item => item.id === selectedId);
    //   if (selected) {
    //     field.value.social_media_id = selected.id;
    //   } else {
    //     field.value.social_media_id = "";
    //   }
};



// ---------- helpers ----------
const safeJSON = (v, fb = null) => {
    try { return typeof v === 'string' ? JSON.parse(v) : (v ?? fb) } catch { return fb }
}
const normI18n = (obj) => {
    const o = safeJSON(obj, {})
    return { th: o?.th ?? '', en: o?.en ?? '', cn: o?.cn ?? '' }
}
const parseOpenDays = (i18n) => {
    const o = safeJSON(i18n, {})
    return {
        th: safeJSON(o?.th, '[]') ? safeJSON(o.th, []) : [],
        en: safeJSON(o?.en, '[]') ? safeJSON(o.en, []) : [],
        cn: safeJSON(o?.cn, '[]') ? safeJSON(o.cn, []) : [],
    }
}
const toDateFromHHmm = (hhmm) => {
    if (!hhmm) return null
    const [h, m] = hhmm.split(':').map(n => parseInt(n, 10))
    if (Number.isNaN(h) || Number.isNaN(m)) return null
    const d = new Date()
    d.setHours(h, m, 0, 0)
    return d
}
const ensureTri = (obj) => ({
    th: obj?.th || '',
    en: obj?.en || '',
    cn: obj?.cn || '',
})
const safeParse = (s) => {
    try { return JSON.parse(s || '[]') } catch { return [] }
}
const hhmmToDate = (hhmm) => {
    if (!hhmm) return null
    const [H, M] = hhmm.trim().split(':')
    const d = new Date()
    d.setHours(+H || 0, +M || 0, 0, 0)
    return d
}
const resGetBusiness = ref(null)
const loadForEdit = async () => {
    try {
        // handleReset()
        const { data } = await dataApi.getBusinessById(route.params.id)
        const d = data?.data || {}
        resGetBusiness.value = data?.data || {}
        console.log('d', d)

        // ----- ที่อยู่ / พิกัด -----
        shop_province_id.value = d.shop_province_id ?? d.business_province_id ?? null
        await loadDistricts(shop_province_id.value)
        shop_district_id.value = d.shop_district_id ?? d.business_district_id ?? null
        await loadSubdistricts(shop_district_id.value)
        shop_subdistrict_id.value = d.shop_subdistrict_id ?? d.business_subdistrict_id ?? null

        latitude.value = Number(d.latitude) || null
        longitude.value = Number(d.longitude) || null
        if (latitude.value && longitude.value) {
            setTimeout(() => focusOnLocation(latitude.value, longitude.value), 0)
        }

        // ----- i18n text -----
        setValues({
            shop_name: ensureTri(d.shop_name_i18n),
            shop_address: ensureTri(d.shop_address_i18n),
            shop_details: ensureTri(d.shop_details_i18n),
        })
        // ----- วันเปิดทำการ -----
        const daysI18n = parseOpenDays(d.business_open_date_i18n)
        shop_days.value.th = daysI18n.th
        shop_days.value.en = daysI18n.en
        shop_days.value.cn = daysI18n.cn

        // ----- เวลาเปิด-ปิด -----
        const [ts, te] = (d.shop_time || '').split('-').map(s => s.trim())
        shop_time_s.value = toDateFromHHmm(ts)
        shop_time_e.value = toDateFromHHmm(te)

        // ----- เบอร์ -----
        shop_phone.value = d.shop_phone || ''

        // ===== ภาพ: แปลงเป็น File ทันที =====
        // 1) รูปโปรไฟล์
        if (d.ImageProfileURL) {
            try {
                const f = await urlToFileAny(
                    d.ImageProfileURL,
                    (d.image_profile || 'profile.jpg').split('/').pop() || 'profile.jpg'
                )
                image_profile.value = { src: d.ImageProfileURL, file: f }
            } catch {
                // proxy ก็ยังล้มเหลว -> อย่างน้อยให้พรีวิวได้ และบังคับให้อัปใหม่ตอนบันทึก
                image_profile.value = { src: d.ImageProfileURL, file: null }
            }
        } else {
            image_profile.value = null
        }

        // 2) รูปหน้าปก
        if (d.ImageCoverURL) {
            try {
                const f = await urlToFileAny(
                    d.ImageCoverURL,
                    (d.image_cover || 'cover.jpg').split('/').pop() || 'cover.jpg'
                )
                image_cover.value = { src: d.ImageCoverURL, file: f }
            } catch {
                image_cover.value = { src: d.ImageCoverURL, file: null }
            }
        } else {
            image_cover.value = null
        }

        // 3) รูปแกลเลอรี (จำกัด 3) — โหลดคู่ขนาน
        const rawImgs = (d.business_img || []).slice(0, 3)
        const files = await Promise.all(
            rawImgs.map(async (x, idx) => {
                const url = x.business_img_url
                try {
                    const f = await urlToFileAny(url, (url?.split('/').pop() || `image_${idx}.jpg`))
                    return { id: x.id, src: url, file: f }
                } catch {
                    return { id: x.id, src: url, file: null } // อย่างน้อยมีพรีวิว
                }
            })
        )
        business_img.value = files

        // ----- Social Media -----
        fields1.value.splice(0)
            ; (d.business_social_media || []).forEach(sm => {
                push1({
                    id: sm.id,                              // เก็บ id ไว้ส่งกลับ (แก้ไข/คงไว้)
                    social_media_id: sm.social_media_id,
                    social_media_link: sm.social_media_link,
                })
            })

        // ----- Bank (ถ้ามี) -----
        fieldsBank.value.splice(0)
            ; (d.business_bank || []).forEach(b => {
                pushBank({
                    id: b.id,
                    business_bank_name_i18n: normI18n(b.business_bank_name_i18n),
                    business_bank_account_i18n: normI18n(b.business_bank_account_i18n),
                    business_bank_account_number: b.business_bank_account_number || '',
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

        <Form @submit="handleNext">

            <van-tabs v-model:active="activeLangTab" type="line" sticky animated color="#202c54" :line-width="100">
                <van-tab v-for="(lang, idx) in langs" :key="lang.code" :title="lang.label" :name="idx">
                    <div class="p-3 ">
                        <!-- <hr class="border-b-2 mb-3" /> -->
                        <h4 class="section-title mt-6">{{ t('เลขที่บัญชี') }}</h4>

                        <Button class="mb-2" :loading="isloadingAxi" type="button" :label="t('เพิ่มเลขที่บัญชี')"
                            @click="pushBank({
                                business_bank_name_i18n: { th: '', en: '', cn: '' },
                                business_bank_account_i18n: { th: '', en: '', cn: '' },
                                business_bank_account_number: '',
                            })" :pt="{
                                    label: { class: 'text-white' },
                                    root: { class: '!border-primary-main !bg-primary-second' },
                                }" />

                        <div v-if="fieldsBank?.length > 0" class="mt-3">
                            <table>
                                <thead>
                                    <tr>
                                        <th class="text-start" style="width: 11rem">{{ t('ธนาคาร') }}</th>
                                        <th class="text-start" style="width: 11rem">{{ t('ชื่อบัญชี') }}
                                        </th>
                                        <th class="text-start" style="width: 10rem">{{ t('เลขบัญชี') }}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(field, index) in fieldsBank" :key="field.key">
                                        <!-- ชื่อธนาคาร (i18n) -->
                                        <td class="align-top">
                                            <div class="space-y-0">
                                                <InputText v-model="field.value.business_bank_name_i18n[lang.code]"
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
                                                <InputText v-model="field.value.business_bank_account_i18n[lang.code]"
                                                    class="w-full custom-border" :placeholder="t('ชื่อบัญชี')" />
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
                                                size="small" @click="onRemoveBank(index)" rounded aria-label="Cancel" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <hr class="border-b-2 mb-3" />


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


                                                <Select v-model="field.value.social_media_id" :options="resSociaMedia"
                                                    style="" optionLabel="id" optionValue="id"
                                                    class="w-full h-full custom-border"
                                                    :placeholder="`${t('ประเภทโซเชียล')}...`"
                                                    @change="((e) => { onSelectChange(e) })">
                                                    <template #value="slotProps">
                                                        <span class="flex items-center space-x-2">
                                                            <template v-if="slotProps.value">
                                                                <i :class="getIconClass(slotProps.value)"
                                                                    class="text-lg"></i>
                                                                <span>
                                                                    {{ getSocialName(slotProps.value,
                                                                        lang.code)
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
                                                                slotProps.option[`social_media_name_${lang.code}`]
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
                                                <InputText v-model="field.value.social_media_link"
                                                    class="w-full custom-border"
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
                                            <Button :loading="isloadingAxi" icon="pi pi-times" severity="danger"
                                                size="small" @click="deleteShopSocialMedia(index, field)" rounded
                                                aria-label="Cancel" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>


                    </div>
                </van-tab>
            </van-tabs>
            <div class="flex justify-end mt-4 mb-4">
                <Button :loading="isloadingAxi" :label="t('ถัดไป')" severity="primary" type="submit" rounded
                    class="w-full" :pt="{
                        root: {
                            class: '!border-primary-main'
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

<style scoped>
/* .card {
    @apply bg-white rounded-sm border border-zinc-200;
}

.section-title {
    @apply font-semibold text-zinc-800 mb-2;
}

.label {
    @apply text-sm text-zinc-600;
}

.custom-border :deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-select) {
    @apply w-full;
}

.upload-box {
    @apply w-12 h-12 rounded-md border-2 border-dotted border-indigo-900 flex items-center justify-center cursor-pointer hover:border-zinc-600;
} */
</style>
