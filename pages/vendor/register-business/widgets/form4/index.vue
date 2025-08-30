<script setup>
import { useI18n } from 'vue-i18n';
const { t, locale, setLocale } = useI18n();

const isloadingAxi = useState("isloadingAxi");
const router = useRouter();

import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import * as dataApi from "../../api/data.js";
const stepsBar = ref([
    { step: 1, active: false },
    { step: 2, active: false },
    { step: 3, active: false },
    { step: 4, active: true },
    { step: 5, active: false },
]);




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
            th: zod.array(zod.string()).min(1, t('กรุณาเลือกวันที่ทำการ')),
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
                social_media_id: zod.string().nonempty(t('เลือกประเภทโซเชียล')),
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
const { handleSubmit, handleReset, errors } = useForm({
    initialValues: {
        social_media: [
            {
                social_media_id: "",
                social_media_link: ""

            },
        ],
        business_bank: [
            {
                business_bank_name_i18n: { th: '', en: '', cn: '' },
                business_bank_account_i18n: { th: '', en: '', cn: '' },
                business_bank_account_number: '',
            },
        ],

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
const provinces = ref([])
const districts = ref([])
const subdistricts = ref([])
// โหลดจังหวัด อำเภอ ตำบล (ใช้ map เหมือนเดิม)

const districtLabelField = computed(() => {
    const lang = langs[activeLangTab.value]
    if (lang.code === 'cn') {
        const d = districts.value[0]
        if (d && !d.district_name_cn) {
            if (d.district_name_en) return 'district_name_en'
            return 'district_name_th'
        }
        return 'district_name_cn'
    }
    return `district_name_${lang.code}`
})

const subdistrictLabelField = computed(() => {
    const lang = langs[activeLangTab.value]
    if (lang.code === 'cn') {
        const s = subdistricts.value[0]
        if (s && !s.subdistrict_name_cn) {
            if (s.subdistrict_name_en) return 'subdistrict_name_en'
            return 'subdistrict_name_th'
        }
        return 'subdistrict_name_cn'
    }
    return `subdistrict_name_${lang.code}`
})

const provinceLabelField = computed(() => {
    const lang = langs[activeLangTab.value]
    if (lang.code === 'cn') {
        const s = provinces.value[0]
        if (s && !s.provinces_name_cn) {
            if (s.provinces_name_en) return 'provinces_name_en'
            return 'provinces_name_th'
        }
        return 'provinces_name_cn'
    }
    return `provinces_name_${lang.code}`
})

// โหลดจังหวัด
const loadProvinces = async () => {
    try {
        const res = await dataApi.getProvinces()
        provinces.value = res.data.data.map((item) => ({
            ...item,
            provinces_name_th: item?.provinces_name_i18n?.th || "",
            provinces_name_en: item?.provinces_name_i18n?.en || "",
            provinces_name_cn: item?.provinces_name_i18n?.cn || "",
        }))
    } catch (err) { console.log(err) }
}

// โหลดอำเภอ ตามจังหวัด
const loadDistricts = async (provinceId) => {
    if (!provinceId) return districts.value = []
    try {
        const res = await dataApi.getDistrictByProvinceId(provinceId)
        districts.value = res.data.data.map((item) => ({
            ...item,
            district_name_th: item?.district_name_i18n?.th || "",
            district_name_en: item?.district_name_i18n?.en || "",
            district_name_cn: item?.district_name_i18n?.cn || "",
        }))
    } catch (err) { console.log(err) }
}

// โหลดตำบล ตามอำเภอ
const loadSubdistricts = async (districtId) => {
    if (!districtId) return subdistricts.value = []
    try {
        const res = await dataApi.getSubDistrictByDistrictId(districtId)
        subdistricts.value = res.data.data.map((item) => ({
            ...item,
            subdistrict_name_th: item?.subdistrict_name_i18n?.th || "",
            subdistrict_name_en: item?.subdistrict_name_i18n?.en || "",
            subdistrict_name_th: item?.subdistrict_name_i18n?.th || ""

        }))
    } catch (err) { console.log(err) }
}

// watch เมื่อ select จังหวัดเปลี่ยน → โหลดอำเภอใหม่, reset ค่าด้านล่าง
watch(shop_province_id, val => {
    shop_district_id.value = null
    shop_subdistrict_id.value = null
    districts.value = []
    subdistricts.value = []
    if (val) loadDistricts(val)
})

// watch เมื่อ select อำเภอเปลี่ยน → โหลดตำบลใหม่, reset ค่าด้านล่าง
watch(shop_district_id, val => {
    shop_subdistrict_id.value = null
    subdistricts.value = []
    if (val) loadSubdistricts(val)
})


// const { push, fields, remove } = useFieldArray("social_media");
const { remove: remove1, push: push1, fields: fields1 } = useFieldArray("social_media");
const { remove: removeBank, push: pushBank, fields: fieldsBank } = useFieldArray('business_bank')

// const { value: business_name } = useField('business_name', null, {
//     initialValue: null
// })
import { format } from 'date-fns';
import { useFormStore } from "@/store/businessStore.js";
const formStore = useFormStore(); // ใช้ Pinia Store
const handleNext = handleSubmit((values) => {
    try {
        console.log('Form shop_name:', shop_name.value);
        console.log('Form values:', values);

        const time_start = format(shop_time_s.value, "HH:mm");
        const time_end = format(shop_time_e.value, "HH:mm");
        const shop_time = `${time_start}-${time_end}`
        const sortedShopDays = {};
        ['th', 'en', 'cn'].forEach(lang => {
            sortedShopDays[lang] = [...shop_days.value[lang]].sort(
                (a, b) => days.map(day => day[lang]).indexOf(a) - days.map(day => day[lang]).indexOf(b)
            )
        })

        const business_img_array = business_img.value.map((item) => item);

        const social_media_array = fields1.value.map((field) => ({
            social_media_id: field.value.social_media_id || null,
            social_media_link: field.value.social_media_link || null,
        }));
        const business_bank_array = (fieldsBank?.value || []).map((field) => ({
            business_bank_name_i18n: {
                th: field.value?.business_bank_name_i18n?.th || '',
                en: field.value?.business_bank_name_i18n?.en || '',
                cn: field.value?.business_bank_name_i18n?.cn || '',
            },
            business_bank_account_i18n: {
                th: field.value?.business_bank_account_i18n?.th || '',
                en: field.value?.business_bank_account_i18n?.en || '',
                cn: field.value?.business_bank_account_i18n?.cn || '',
            },
            // เก็บเฉพาะตัวเลข/ตัดช่องว่าง (ถ้าไม่ต้องการให้ตัด ให้ใช้ String(...) เฉย ๆ)
            business_bank_account_number: String(field.value?.business_bank_account_number ?? ''),
        }));
        // console.log('shop_details', shop_details.value)

        // เก็บข้อมูลลง Pinia แทน LocalStorage
        formStore.setForm4(
            values.shop_name,
            values.shop_address,
            values.shop_province_id,
            values.shop_district_id,
            values.shop_subdistrict_id,
            sortedShopDays,
            shop_time,
            values.shop_phone,
            values.shop_details,
            image_cover.value,
            image_profile.value,
            business_img_array,
            business_bank_array,
            social_media_array,
            latitude.value,
            longitude.value
        );

        // เปลี่ยนหน้าไป form5
        formStore.nextPage();
    } catch (error) {
        console.error('Error handling form submission:', error);
    }
});
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
    business_img.value.splice(index, 1);  // Remove the image from the array
};
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
    await useLongdoLoader()
    await nextTick()
    initMap()
    moveMapToTab(activeLangTab.value)
    loadProvinces()
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

</script>
<template>
    <div class="bg-zinc-100 min-h-screen">
        <LayoutsBaseHeader :title="t('ข้อมูลธุรกิจในแหล่งท่องเที่ยว')">
            <template #left>
                <ButtonIconBack @click="formStore.prevPage()" />
            </template>
        </LayoutsBaseHeader>
        <section class="max-w-[430px] mx-auto">


            <div class=" ">
                <Form @submit="handleNext">
                    <!-- {{ errors }}
                <pre>
            {{ fields1 }}
        </pre> -->
                    <!-- Map จริง ถูก render ทีเดียว -->
                    <div id="map" class="map-container" style="width: 100%; height: 100%; display: none;" />
                    <!-- {{ activeLangTab }} -->
                    <van-tabs v-model:active="activeLangTab" type="line" sticky animated color="#202c54"
                        @change="moveMapToTab" :line-width="100">
                        <van-tab v-for="(lang, idx) in langs" :key="lang.code" :title="lang.label" :name="idx">
                            <div class="p-3 ">

                                <div class="card p-4 overflow-hidden">
                                    <!-- <p class="text-primary-main mb-3">ร้านอาหาร</p> -->
                                    <!-- <van-uploader :after-read="afterRead" /> -->
                                    <div class="space-y-4 mb-5">
                                        <div>
                                            <h4 class="section-title">{{ t('รูปภาพธุรกิจ') }}</h4>

                                            <p class="text-gray-500 text-sm">{{ t('อัพโหลดรูปภาพโปรไฟล์') }}</p>
                                            <div class="flex flex-wrap gap-2 mb-3 relative">
                                                <!-- Display the image preview if available -->
                                                <div class="relative" v-if="image_profile?.src">
                                                    <!-- <img :src="image_cover.src" alt="Preview"
                                        class="object-cover w-12 h-12 rounded-md" /> -->
                                                    <Image :src="image_profile.src" alt="Image" width="50"
                                                        class="object-cover "
                                                        :pt="{ image: { class: 'object-cover w-12 h-12 rounded-md ' } }"
                                                        preview />
                                                    <i class="fa-solid fa-xmark absolute top-0 right-0 p-0.5 text-white bg-gray-300 rounded-full cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-red-300"
                                                        @click="removeImageBgProfile"></i>
                                                </div>

                                                <!-- Upload Button -->
                                                <div class="flex" v-else>
                                                    <label
                                                        class="w-12 h-12 border-2 border-dotted border-blue-900 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-600"
                                                        for="upload-image">
                                                        <i
                                                            class="pi pi-plus text-2xl text-gray-600 hover:scale-110 transition-transform"></i>
                                                    </label>
                                                    <!-- Hidden File Input -->
                                                    <input ref="fileInputBgProfile" id="upload-image" type="file"
                                                    accept=".jpg,.jpeg,.png,image/jpeg,image/png" @change="onFileSelectBgProfile"
                                                        class="hidden" />
                                                </div>


                                            </div>
                                            <p class="error-text" v-if="errors?.image_profile">{{
                                                t('กรุณาเลือกอย่างน้อย')
                                            }} 1
                                                {{
                                                    t('ภาพ') }}
                                            </p>
                                        </div>


                                        <div>
                                            <p class="text-gray-500 text-sm">{{ t('อัพโหลดรูปภาพหน้าปก') }}</p>
                                            <div class="flex flex-wrap gap-2 mb-3 relative">
                                                <!-- Display the image preview if available -->
                                                <div class="relative" v-if="image_cover?.src">
                                                    <!-- <img :src="image_cover.src" alt="Preview"
                                        class="object-cover w-12 h-12 rounded-md" /> -->
                                                    <Image :src="image_cover.src" alt="Image" width="50"
                                                        class="object-cover "
                                                        :pt="{ image: { class: 'object-cover w-12 h-12 rounded-md ' } }"
                                                        preview />
                                                    <i class="fa-solid fa-xmark absolute top-0 right-0 p-0.5 text-white bg-gray-300 rounded-full cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-red-300"
                                                        @click="removeImageBgCover"></i>
                                                </div>

                                                <!-- Upload Button -->
                                                <div class="flex" v-else>
                                                    <label
                                                        class="w-12 h-12 border-2 border-dotted border-blue-900 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-600"
                                                        for="upload-image-bg-cover">
                                                        <i
                                                            class="pi pi-plus text-2xl text-gray-600 hover:scale-110 transition-transform"></i>
                                                    </label>
                                                    <!-- Hidden File Input -->
                                                    <input ref="fileInputBgCover" id="upload-image-bg-cover" type="file"
                                                    accept=".jpg,.jpeg,.png,image/jpeg,image/png" @change="onFileSelectBgCover" class="hidden" />
                                                </div>


                                            </div>
                                            <p class="error-text" v-if="errors?.image_cover">{{ t('กรุณาเลือกอย่างน้อย')
                                            }}
                                                1 {{
                                                    t('ภาพ') }}</p>
                                        </div>

                                        <p class="text-gray-500 text-sm">{{ t('อัพโหลดรูปภาพ') }} ({{ t('ไม่เกิน') }} 3
                                            {{
                                                t('รูป') }})
                                        </p>
                                        <div class="flex flex-wrap gap-2 mb-3 relative">
                                            <div v-for="(image, index) in business_img" :key="index" class="relative">
                                                <!-- Image Display -->
                                                <Image :src="image.src" alt="Image" width="50" class="object-cover "
                                                    :pt="{ image: { class: 'object-cover w-12 h-12 rounded-md ' } }"
                                                    preview />

                                                <!-- Delete Icon (Overlay on Top-Right) -->
                                                <i class="fa-solid fa-xmark absolute top-0 right-0 p-0.5 text-white bg-gray-300  rounded-full cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-red-300"
                                                    @click="removeImage(index)"></i>

                                            </div>
                                            <div class="flex">
                                                <label
                                                    class="w-12 h-12 border-2 border-dotted border-blue-900 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-600"
                                                    @click="triggerFileInput">
                                                    <i
                                                        class="pi pi-plus text-2xl text-gray-600 hover:scale-110 transition-transform"></i>
                                                </label>
                                                <FileUpload ref="fileInput" id="upload-image-store"
                                                    inputId="upload-image-store" mode="basic" accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                                                    @select="onFileSelect" customUpload :auto="true" class="!hidden"
                                                    multiple />
                                            </div>
                                        </div>
                                        <p class="error-text" v-if="errors?.business_img">{{ t('กรุณาเลือกอย่างน้อย') }}
                                            1
                                            {{
                                                'ภาพ' }}
                                        </p>

                                        <div>
                                            <!-- <client-only> -->
                                                <h4 class="section-title">{{ t('พิกัดสถานที่ท่องเที่ยวหรือธุรกิจ') }}
                                                </h4>

                                                <AutoComplete v-model="textSearchMap" forceSelection optionLabel="name"
                                                    :placeholder="`${t('ค้นหาสถานที่ใกล้เคียง')}...`"
                                                    :suggestions="resLocation" @complete="search"
                                                    @value-change="onLocationSearchSelect"
                                                    dropdownicon="fa-regular fa-trash-can" class="mb-2"
                                                    inputClass="custom-border w-full">

                                                    <template #option="slotProps" class="w-full">
                                                        <div class="flex flex-col p-2 border-b border-gray-200">
                                                            <span class="font-medium text-lg text-primary-main">{{
                                                                slotProps.option?.name }}</span>
                                                            <span class="text-sm text-gray-500">{{
                                                                slotProps.option?.address
                                                            }}</span>
                                                        </div>
                                                    </template>
                                                </AutoComplete>

                                                <div class="h-64 mt-2 rounded-lg overflow-hidden border"
                                                    :ref="el => setMapWrapper(el, idx)">
                                                </div>
                                                <p class="error-text" v-if="errors?.longitude">{{
                                                    t('กรุณาปักหมุดสถานที่ท่องเที่ยวหรือธุรกิจ')
                                                }}
                                                </p>

                                            <!-- </client-only> -->

                                            <div class="mt-2">
                                                <p class="text-xs text-zinc-600" v-if="latitude && longitude">
                                                    {{ t('ตำแหน่ง') }}: {{ latitude }}, {{ longitude }}
                                                </p>
                                                <Button icon="fa-solid fa-location-dot" size="small" outlined
                                                    @click="addMarkerAtCenter" :label="t('ปักหมุดตรงกลาง')" />
                                                <!-- <Button icon="fa-solid fa-location-dot" size="small" outlined
                                                    @click="addMarkerAtCenter" severity="primary"
                                                    :label="t('ปักหมุดตำแหน่งธุรกิจหรือสถานที่ท่องเที่ยว')" /> -->
                                            </div>
                                            <!-- <div class="mt-2">
                  <p class="text-xs text-zinc-600" v-if="latitude && longitude">
                    {{ t('ตำแหน่ง') }}: {{ latitude }}, {{ longitude }}
                  </p>
                  <Button icon="fa-solid fa-location-dot" size="small" outlined @click="addMarkerAtCenter"
                    :label="t('ปักหมุดตรงกลาง')" />
                </div> -->

                                        </div>


                                        <!-- <div>
                                    <label class="label-input">{{ t('ละติจูด') }}</label>
                                    <InputText v-model="latitude" placeholder="" readonly
                                        class="w-full custom-border" />
                                </div>
                                <div>
                                    <label class="label-input">{{ t('ลองจิจูด') }}</label>
                                    <InputText v-model="longitude" placeholder="" readonly
                                        class="w-full custom-border" />
                                </div> -->
                                        <div>
                                            <label class="label-input">{{ t('ละติจูด') }}</label>
                                            <InputText v-model="latitude" placeholder="" readonly
                                                class="w-full custom-border"
                                                :invalid="errors?.latitude ? true : false" />
                                            <p class="error-text" v-if="errors?.latitude">{{
                                                errors?.latitude }}</p>
                                        </div>
                                        <div>
                                            <label class="label-input">{{ t('ลองจิจูด') }}</label>
                                            <InputText v-model="longitude" placeholder="" readonly
                                                class="w-full custom-border"
                                                :invalid="errors?.longitude ? true : false" />
                                            <p class="error-text" v-if="errors?.longitude">{{
                                                errors?.longitude }}</p>
                                        </div>

                                        <!-- ชื่อบริษัท -->
                                        <h4 class="section-title">{{ t('ข้อมูลธุรกิจ') }}</h4>

                                        <div>

                                            <label class="label-input">{{ t('ชื่อธุรกิจในแหล่งท่องเที่ยว') }}</label>
                                            <InputText v-model="shop_name[lang.code]"
                                                :placeholder="t('ชื่อธุรกิจในแหล่งท่องเที่ยว')"
                                                class="w-full custom-border" :invalid="getFieldError('shop_name')" />
                                            <p v-if="getFieldError('shop_name', lang.code)" class="error-text">
                                                {{ getFieldError('shop_name', lang.code) }}
                                            </p>

                                        </div>
                                        <!-- ชื่อบริษัท -->
                                        <div>
                                            <label class="label-input">{{ t('ที่อยู่ธุรกิจในแหล่งท่องเที่ยว') }}</label>
                                            <InputText v-model="shop_address[lang.code]"
                                                :placeholder="t('ที่อยู่ธุรกิจ')" :invalid="getFieldError(shop_address)"
                                                class="w-full custom-border" />
                                            <p v-if="getFieldError('shop_address', lang.code)" class="error-text">
                                                {{ getFieldError('shop_address', lang.code) }}
                                            </p>

                                        </div>


                                        <!-- จังหวัด -->
                                        <div>
                                            <label class="label-input">{{ t('จังหวัด') }}</label>
                                            <Dropdown v-model="shop_province_id" :options="provinces" optionValue="id"
                                                :optionLabel="provinceLabelField" :placeholder="t('เลือกจังหวัด')"
                                                class="w-full h-full custom-border" :filter="true" :showClear="true"
                                                :invalid="errors?.shop_province_id ? true : false" />
                                            <p class="error-text" v-if="errors?.shop_province_id">{{
                                                errors?.shop_province_id }}</p>

                                        </div>
                                        <!-- อำเภอ -->
                                        <div>
                                            <label class="label-input">{{ t('อำเภอ') }}</label>
                                            <Dropdown v-model="shop_district_id" :options="districts" optionValue="id"
                                                :optionLabel="districtLabelField" :placeholder="t('เลือกอำเภอ')"
                                                class="w-full h-full custom-border" :filter="true" :showClear="true"
                                                :invalid="errors?.shop_district_id ? true : false" />
                                            <p class="error-text" v-if="errors?.shop_district_id">{{
                                                errors?.shop_district_id }}</p>
                                        </div>
                                        <!-- ตำบล -->
                                        <div>
                                            <label class="label-input">{{ t('ตำบล') }}</label>
                                            <Dropdown v-model="shop_subdistrict_id" :options="subdistricts"
                                                optionValue="id" :optionLabel="subdistrictLabelField"
                                                :placeholder="t('เลือกตำบล')" class="w-full h-full custom-border"
                                                :filter="true" :showClear="true"
                                                :invalid="errors?.shop_subdistrict_id ? true : false" />
                                            <p class="error-text" v-if="errors?.shop_subdistrict_id">{{
                                                errors?.shop_subdistrict_id }}</p>
                                        </div>




                                        <div>
                                            <label class="label-input">{{ t('วันที่ทำการ') }}</label>

                                            <div class="mt-2">
                                                <!-- <pre>
                                            {{ shop_days }}
                                        </pre> -->
                                                <div class="grid grid-cols-3 gap-x-6 gap-y-3 lg:w-fit w-full">
                                                    <div v-for="day in days" :key="day[lang.code]"
                                                        class="flex items-center space-x-2">
                                                        <Checkbox v-model="shop_days[lang.code]"
                                                            :inputId="`${day[lang.code]}-${lang.code}`"
                                                            :value="day[lang.code]" @change="onShopDayChange(lang.code)"
                                                            :invalid="getFieldError('shop_days', lang.code) ? true : false" />
                                                        <label :for="`${day[lang.code]}-${lang.code}`"
                                                            class="text-gray-700 cursor-pointer hover:text-blue-600 ml-2">
                                                            {{ day[lang.code] }}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <p v-if="getFieldError('shop_days', lang.code)" class="error-text">
                                                {{ getFieldError('shop_days', lang.code) }}
                                            </p>

                                        </div>
                                        <div>
                                            <label class="label-input block">{{ t('เวลาทำการ') }}</label>
                                            <DatePicker id="datepicker-timeonly" v-model="shop_time_s" timeOnly
                                                inputClass="custom-border" style="width: 6rem;"
                                                :invalid="errors?.shop_time_s ? true : false"
                                                :placeholder="t('ชั่วโมง:นาที')" />

                                            <label class="label-input">{{ t('ถึง') }}</label>
                                            <DatePicker id="datepicker-timeonly" v-model="shop_time_e" timeOnly
                                                class="custom-border" inputClass="custom-border" style="width: 6rem;"
                                                :invalid="errors?.shop_time_e ? true : false"
                                                :placeholder="t('ชั่วโมง:นาที')" />

                                            <p class="error-text" v-if="errors?.shop_time_s || errors?.shop_time_e">{{
                                                t('กรุณาเลือกเวลาทำการ')
                                            }}</p>

                                        </div>
                                        <!-- ติดต่อ -->
                                        <div>
                                            <label class="label-input">{{ t('เบอร์ติดต่อ') }}</label>
                                            <InputText v-model="shop_phone" v-keyfilter.int
                                                :placeholder="t('เบอร์โทรศัพท์')" class="w-full custom-border"
                                                :invalid="errors?.shop_phone ? true : false" />
                                            <p class="error-text" v-if="errors?.shop_phone">{{ errors?.shop_phone }}</p>
                                        </div>

                                        <div>
                                            <label class="label-input">{{ t('รายละเอียดธุรกิจในแหล่งท่องเที่ยว')
                                            }}</label>
                                            <InputText v-model="shop_details[lang.code]" placeholder=""
                                                class="w-full custom-border" :invalid="getFieldError('shop_details')" />
                                            <p class="error-text" v-if="getFieldError('shop_details', lang.code)">{{
                                                getFieldError('shop_details', lang.code) }}</p>

                                        </div>

                                    </div>
                                    <hr class="border-b-2 mb-3" />
                                    <h4 class="section-title mt-6">{{ t('เลขที่บัญชี') }}</h4>

                                    <Button :loading="isloadingAxi" type="button" :label="t('เพิ่มเลขที่บัญชี')" @click="pushBank({
                                        business_bank_name_i18n: { th: '', en: '', cn: '' },
                                        business_bank_account_i18n: { th: '', en: '', cn: '' },
                                        business_bank_account_number: '',
                                    })" :pt="{
                                        label: { class: 'text-white' },
                                        root: { class: '!border-primary-main !bg-primary-second' },
                                    }" />

                                    <div v-if="fieldsBank?.length > 0" class="mt-3 space-y-3">
                                        <div v-for="(field, index) in fieldsBank" :key="field.key"
                                            class="bg-white border rounded-sm shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow">
                                            <!-- header -->
                                            <div class="flex items-center justify-between mb-3">
                                                <h4 class="text-sm font-medium text-zinc-700">
                                                    {{ t('บัญชีธนาคาร') }} #{{ index + 1 }}
                                                </h4>
                                                <Button :loading="isloadingAxi" icon="pi pi-times" severity="danger"
                                                    size="small" @click="removeBank(index)" rounded
                                                    aria-label="Remove" />
                                            </div>

                                            <!-- body -->
                                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <!-- ชื่อธนาคาร (i18n) -->
                                                <div>
                                                    <label class="block text-sm text-zinc-700 mb-1">{{ t('ธนาคาร')
                                                        }}</label>
                                                    <InputText v-model="field.value.business_bank_name_i18n[lang.code]"
                                                        class="w-full custom-border focusable"
                                                        :placeholder="t('ธนาคาร')"
                                                        :invalid="!!errors?.[`business_bank[${index}].business_bank_name_i18n.${lang.code}`]" />
                                                    <p v-if="errors?.[`business_bank[${index}].business_bank_name_i18n.${lang.code}`]"
                                                        class="text-red-500 text-sm mt-1">
                                                        {{
                                                            errors[`business_bank[${index}].business_bank_name_i18n.${lang.code}`]
                                                        }}
                                                    </p>
                                                </div>

                                                <!-- ชื่อบัญชี (i18n) -->
                                                <div>
                                                    <label class="block text-sm text-zinc-700 mb-1">{{ t('ชื่อบัญชี')
                                                        }}</label>
                                                    <InputText
                                                        v-model="field.value.business_bank_account_i18n[lang.code]"
                                                        class="w-full custom-border focusable"
                                                        :placeholder="t('ชื่อบัญชี')"
                                                        :invalid="!!errors?.[`business_bank[${index}].business_bank_account_i18n.${lang.code}`]" />
                                                    <p v-if="errors?.[`business_bank[${index}].business_bank_account_i18n.${lang.code}`]"
                                                        class="text-red-500 text-sm mt-1">
                                                        {{
                                                            errors[`business_bank[${index}].business_bank_account_i18n.${lang.code}`]
                                                        }}
                                                    </p>
                                                </div>

                                                <!-- เลขบัญชี -->
                                                <div class="sm:col-span-2">
                                                    <label class="block text-sm text-zinc-700 mb-1">{{ t('เลขบัญชี')
                                                        }}</label>
                                                    <InputText v-model="field.value.business_bank_account_number"
                                                        v-keyfilter.int class="w-full custom-border focusable"
                                                        :placeholder="t('เลขบัญชี')"
                                                        :invalid="!!errors?.[`business_bank[${index}].business_bank_account_number`]" />
                                                    <p v-if="errors?.[`business_bank[${index}].business_bank_account_number`]"
                                                        class="text-red-500 text-sm mt-1">
                                                        {{
                                                            errors[`business_bank[${index}].business_bank_account_number`]
                                                        }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Empty state (ใช้เดิมได้ ถ้าอยากเพิ่มความสวยงามก็ส่วนนี้) -->
                                    <div v-else
                                        class="mt-4 border-2 border-dashed border-zinc-200 rounded-2xl p-8 text-center bg-white">
                                        <div class="flex flex-col items-center gap-2">
                                            <i class="pi pi-wallet text-3xl"></i>
                                            <p class="text-zinc-600">{{ t('ยังไม่มีข้อมูลบัญชี กรุณาเพิ่มรายการใหม่') }}
                                            </p>
                                            <!-- ปุ่มเพิ่ม ให้เรียกวิธีเดิมของคุณ (เช่น pushBank หรือ onAddBank) -->
                                            <!-- <Button :loading="isloadingAxi" :label="t('เพิ่มเลขที่บัญชีแรก')" @click="onAddBank()" ... /> -->
                                        </div>
                                    </div>
                                    <hr class="border-b-2 mb-3 mt-3" />


                                    <h4 class="section-title">{{ t('ช่องทางโซเชียลมีเดีย') }}</h4>


                                    <Button :loading="isloadingAxi" type="button" :label="t('เพิ่มรายการโซเชียล')"
                                        @click="push1({

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


                                                            <Select v-model="field.value.social_media_id"
                                                                :options="resSociaMedia" style="" optionLabel="id"
                                                                optionValue="id" class="w-full h-full custom-border"
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
                                                                        <i :class="slotProps.option.icon"
                                                                            class="text-lg"></i>
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
                                                        <Button :loading="isloadingAxi" icon="pi pi-times"
                                                            severity="danger" size="small" @click="remove1(index)"
                                                            rounded aria-label="Cancel" />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!-- Empty state (ใช้เดิมได้ ถ้าอยากเพิ่มความสวยงามก็ส่วนนี้) -->
                                    <div v-else
                                        class="mt-4 border-2 border-dashed border-zinc-200 rounded-2xl p-8 text-center bg-white">
                                        <div class="flex flex-col items-center gap-2">
                                            <i class="pi pi-share-alt text-3xl text-zinc-500"></i>
                                            <p class="text-zinc-600">
                                                {{ t('ยังไม่มีข้อมูลโซเชียล กรุณาเพิ่มรายการใหม่') }}
                                            </p>
                                            <!-- ปุ่มเพิ่ม (ถ้าต้องการให้ผู้ใช้กดเพิ่มเลย) -->
                                            <!--
    <Button
      :loading="isloadingAxi"
      :label="t('เพิ่มโซเชียลแรก')"
      @click="onAddSocial()"  // หรือ pushSocial
      :pt="{
        label: { class: 'text-white' },
        root: { class: '!border-primary-main !bg-primary-second' },
      }"
    />
    -->
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </van-tab>
                    </van-tabs>
                    <div class="p-3">
                        <Button :loading="isloadingAxi" :label="t('ถัดไป')" severity="primary" type="submit" rounded
                            class="w-full" :pt="{
                                root: {
                                    class: '!border-primary-main'
                                },
                            }" />
                    </div>

                </Form>

            </div>
        </section>
    </div>
</template>

<style scoped>
.card {
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
}
</style>
