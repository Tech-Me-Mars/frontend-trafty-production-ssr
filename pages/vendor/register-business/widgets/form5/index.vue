<script setup>
definePageMeta({
    middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t, locale, setLocale } = useI18n();
const isloadingAxi = useState("isloadingAxi");

import { useFormStore } from "@/store/businessStore.js";
const formStore = useFormStore(); // ใช้ Pinia Store
const route = useRoute();
const router = useRouter();

import { useConfirm } from "primevue/useconfirm";
import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import * as dataApi from "../../api/data.js";


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


// Language configuration
const langs = [
    { code: 'th', label: 'ภาษาไทย', locale: 'th-TH' },
    { code: 'en', label: 'English', locale: 'en-US' },
    { code: 'cn', label: '中文', locale: 'ch-Ch' }
];

const activeLangTab = ref(0);
onMounted(() => {
    setLocale('th-TH')
})

watch(activeLangTab, (newIdx) => {
    setLocale(langs[newIdx].locale);
});


// เมื่อเปลี่ยน locale
watch(locale, (newLocale) => {
    const idx = langs.findIndex(l => l.locale === newLocale);
    if (idx !== -1) activeLangTab.value = idx;
});


const confirm1 = useConfirm();
// Function to remove an item
const removeItem = (index) => {
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
        accept: () => {
            business_list.value.splice(index, 1);
            localStorage.setItem("business_list", JSON.stringify(business_list.value));
        },
        reject: () => {
            // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });


};

const requireValue = t('กรุณาระบุข้อมูลให้ถูกต้อง');
const requireText = t('ระบุข้อมูล');
// *************  VARIDATOR
const validationSchema = toTypedSchema(
    zod.object({

    })
);
const { handleSubmit, handleReset, errors } = useForm({
    validationSchema,
});
const { value: business_list } = useField('business_list', null, {
    initialValue: formStore.business_list // Set the initial value from the store
});


// โหลดข้อมูลเมื่อหน้าโหลด
onMounted(() => {
    // loadBusinessList();
});
const confirm = useConfirm();
const handleNext = handleSubmit(async (values) => {
    confirm.require({
        group: 'headless',
        header: `${t('ยืนยัน')}?`,
        message: `${t('กดปุ่นยืนยันเพื่อลงทะเบียนร้านค้า')}.`,
        accept: () => {
            saveRegisterBusiness();
        },
        reject: () => {
            // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
});


const saveRegisterBusiness = async () => {

    const formData = new FormData();
    formData.append("service_type_id", parseInt(formStore.service_type_id));
    formData.append("business_type_id", formStore.business_type_id);
    formData.append("business_model_id", parseInt(formStore.business_model_id));
    formData.append("business_name_i18n", formStore.business_name_i18n);
    formData.append("business_person_i18n", formStore.business_person_i18n);
    formData.append("business_address_i18n", formStore.business_address_i18n);
    formData.append("business_province_id", formStore.business_province_id);
    formData.append("business_district_id", formStore.business_district_id);
    formData.append("business_subdistrict_id", formStore.business_subdistrict_id);
    
    formData.append("business_contact_i18n", formStore.business_contact_i18n);
    formData.append("business_email_i18n", formStore.business_email_i18n);
    formData.append("shop_name_i18n", formStore.shop_name_i18n);
    formData.append("shop_address_i18n", formStore.shop_address_i18n);
    formData.append("shop_province_id", formStore.shop_province_id);
    formData.append("shop_district_id", formStore.shop_district_id);
    formData.append("shop_subdistrict_id", formStore.shop_subdistrict_id);

    formData.append("shop_time_i18n", formStore.shop_time_i18n);
    formData.append("shop_phone_i18n", formStore.shop_phone_i18n);
    formData.append("shop_details_i18n", formStore.shop_details_i18n);
    formData.append("latitude_i18n", formStore.latitude_i18n);
    formData.append("longitude_i18n", formStore.longitude_i18n);
    const businessOpenDateI18n = { ...formStore.business_open_date };

    // วนลูปแต่ละ key แล้ว stringify array
    Object.keys(businessOpenDateI18n).forEach(lang => {
        businessOpenDateI18n[lang] = JSON.stringify(businessOpenDateI18n[lang]);
    });
    // จากนั้น append ลง FormData ได้เลย
    formData.append("business_open_date", JSON.stringify(businessOpenDateI18n));

    console.log(formStore.image_cover)
    // Append single image files
    if (formStore.image_cover) {
        // formData.append("image_cover", formStore.image_cover.file);
        formData.append("image_cover", formStore.image_cover.file);
    }
    if (formStore.image_profile) {
        formData.append("image_profile", formStore.image_profile.file);
    }
    // if (business_list.value) {
    formData.append("business_list", business_list.value || []);
    // }
    if (formStore.business_social_media) {
        formData.append("social_media", formStore.business_social_media);
    }
    if (formStore.business_img) {
        formStore.business_img.forEach((item) => {
            formData.append("business_images", item.file);
        });
    }

    // Append multiple business documents
    if (formStore.listFiles) {
        formStore.listFiles.forEach((item) => {
            formData.append("business_documents", item.file);
        });
    }


    console.log('formData', formData);

    try {
        const res = await dataApi.saveBusinessRegister(formData);
        
        showNotification({
            state: res.data.dialog?.state,
            title: res.data.dialog?.title,
            detail: res.data.dialog?.detail,
            timeout: res.data.dialog?.timeout || 3000,
            redirectUrl: `/vendor/manage-business/home/${res.data.data.id}`,
            autoClose: true
        })
        formStore.$reset();

        // alertToast.value = {
        //     title: t('สำเร็จ'),
        //     color: 'info',
        //     isError: false,
        //     msg: res.data.message,
        // };

        // รีเซ็ตค่าทั้งหมดใน Pinia หลังจากบันทึกสำเร็จ

        // router.replace({ query: { ...route.query, bussiness_id: res.data.data.id } });
        // formStore.goToPage(7);


        // นำทางไปยังหน้าสำเร็จ
        // router.push(`/vendor/register-business/finish?bussiness_id=${res.data.data.id}`);
    } catch (error) {
        showNotification({
            state: 'warning',
            title: 'คำเตือน',
            detail: 'บันทึกข้อมูลไม่สำเร็จ กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง',
            timeout: 0,
            redirectUrl: null,
            autoClose: false // ไม่นับถอยหลัง ต้องกดปุ่มปิด
        })
        // alertToast.value = {
        //     title: t('ล้มเหลว'),
        //     isError: true,
        //     color: "error",
        //     msg: error.response?.data?.message || "Error occurred",
        //     dataError: error,
        // };
        console.error(error);
    }
};
</script>
<style scoped>
.van-nav-bar {
    --van-nav-bar-background: #281c74;
    --van-nav-bar-text-color: white;
    --van-nav-bar-icon-color: white;
    --van-nav-bar-title-text-color: white;
    --van-nav-bar-height: 70px
}
</style>
<template>
    <div class="bg-zinc-100 min-h-screen">
        <!-- <van-nav-bar :title="t('รายการธุรกิจในแหล่งท่องเที่ยว')" left-arrow @click-left="formStore.prevPage()">
        </van-nav-bar> -->
        <LayoutsBaseHeader :title="t('รายการธุรกิจในแหล่งท่องเที่ยว')">
            <template #left>
                <ButtonIconBack @click="formStore.prevPage()" />
            </template>
        </LayoutsBaseHeader>


        <Form @submit="handleNext">
            <van-tabs v-model:active="activeLangTab" type="line" sticky animated color="#202c54" @change="moveMapToTab">
                <van-tab v-for="(lang, idx) in langs" :key="lang.code" :title="lang.label" :name="idx">
                    <div class="p-4 ">

                        <div class="card pt-5 mb-10 px-4">
                            <!-- Title -->
                            <h2 class="font-bold text-lg mb-3 ">{{ t('ธุรกิจในแหล่งท่องเที่ยว') }}</h2>
                            <p class="text-sm ">{{ t('เพิ่มรายการสินค้า') }}</p>

                            <!-- List of Businesses -->
                            <div class="space-y-2 mt-3 mb-5">
                                <!-- Business Item -->
                                <div v-for="(item, index) in business_list" :key="index"
                                    class="flex justify-between items-start p-3 border rounded-md shadow-sm">
                                    <div>
                                        <p class="font-semibold text-gray-700 mb-2">
                                            {{ item.business_list_name[lang.code] }}
                                        </p>
                                        <p class="text-gray-500 text-sm">฿ {{ item.business_list_price }}</p>
                                    </div>
                                    <!-- Delete Button -->
                                    <button type="button" @click="removeItem(index)"
                                        class="!text-red-700 hover:text-red-700">
                                        <i class="fa-solid fa-circle-xmark text-xl"></i>
                                    </button>
                                </div>
                            </div>
                            <p class="error-text mb-3" v-if="errors?.business_list">{{ t('กรุณาเลือกอย่างน้อย') }} 1 {{
                                t('รายการ') }}</p>

                            <!-- <NuxtLink to="/vendor/register-business/form5/add-items"> -->
                            <Button @click="formStore.goToPage(8)" :loading="isloadingAxi" :label="t('เพิ่มรายการ')"
                                size="small" icon="pi pi-plus" severity="secondary"></Button>
                            <!-- </NuxtLink> -->
                        </div>

                        <Button :loading="isloadingAxi" :label="t('ยืนยัน')" severity="primary" type="submit" rounded
                            class="w-full" :pt="{
                                root: {
                                    class: '!border-primary-main'
                                },
                            }" />

                    </div>

                </van-tab>
            </van-tabs>

        </Form>

        <ConfirmDialog></ConfirmDialog>
        <ConfirmDialog group="headless">
            <template #container="{ message, acceptCallback, rejectCallback }">
                <div class="flex flex-col items-center p-8 bg-surface-0  rounded">
                    <!-- <div class="rounded-full bg-primary text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
                    <i class="pi pi-question text-5xl"></i>
                </div> -->
                    <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
                    <p class="mb-0">{{ message.message }}</p>
                    <div class="flex items-center gap-2 mt-6">
                        <Button :loading="isloadingAxi" :label="t('ยืนยัน')" @click="acceptCallback"></Button>
                        <Button :loading="isloadingAxi" :label="t('ยกเลิก')" outlined @click="rejectCallback"></Button>
                    </div>
                </div>
            </template>
        </ConfirmDialog>
        <NotificationPopup v-model:visible="notification.visible" :state="notification.state"
            :title="notification.title" :detail="notification.detail" :timeout="notification.timeout"
            :redirect-url="notification.redirectUrl" :auto-close="notification.autoClose"
            @close="onNotificationClose" />
    </div>
</template>