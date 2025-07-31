<script setup>
definePageMeta({
    middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const isloadingAxi = useState("isloadingAxi");

import { useFormStore } from "@/store/businessStore.js";
const formStore = useFormStore(); // ใช้ Pinia Store
const route = useRoute();
const router = useRouter();
const alertToast = ref({});
import { useConfirm } from "primevue/useconfirm";
import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import * as dataApi from "../../api/data.js";

const stepsBar = ref([
    { step: 1, active: false },
    { step: 2, active: false },
    { step: 3, active: false },
    { step: 4, active: false },
    { step: 5, active: true },
])

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
        // business_list_name: zod.string().nonempty(requireValue).default(""),
        // business_list_price: zod.string().nonempty(requireValue).default(""),
        // business_list: zod.custom((value) => {
        //     if (value != null && (Array.isArray(value) ? value.length > 0 : true)) {
        //         return value;
        //     }
        // }),
    })
);
const { handleSubmit, handleReset, errors } = useForm({
    validationSchema,
});
const { value: business_list } = useField('business_list', null, {
    initialValue: formStore.business_list // Set the initial value from the store
});


// const loadBusinessList = () => {
//     const storedBusinessList = JSON.parse(localStorage.getItem("business_list") || "[]");
//     business_list.value = storedBusinessList; // อัปเดตค่าใน useField
// };

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

const clearLocalStorageKeys = () => {
    const keysToRemove = [
        "service_type_id",
        "service_type_name",
        "business_model_id",
        "business_model_name",
        "business_type_id",
        "business_type_name",
        "business_name",
        "business_person",
        "business_address",
        "business_contact",
        "business_email",
        "shop_name",
        "shop_address",
        "shop_days",
        "shop_time",
        "shop_phone",
        "shop_details",
        "image_cover",
        "image_profile",
        "business_img",
        "business_list",
        "social_media",
        "business_documents_img"
    ];

    keysToRemove.forEach((key) => localStorage.removeItem(key));
};


const saveRegisterBusiness = async () => {
    // const payload = {
    //     service_type_id: parseInt(formStore.serviceTypeId),
    //     service_type_name: formStore.serviceTypeName,
    //     business_model_id: parseInt(formStore.business_model_id),
    //     business_model_name: formStore.business_model_name,
    //     business_type_id: parseInt(formStore.businessTypeId),
    //     business_type_name: formStore.businessTypeName,
    //     business_name: formStore.business_name,
    //     business_person: formStore.business_person,
    //     business_address: formStore.business_address,
    //     business_contact: formStore.business_contact,
    //     business_email: formStore.business_email,
    //     shop_name: formStore.shop_name,
    //     shop_address: formStore.shop_address,
    //     shop_days: formStore.shop_days,
    //     shop_time: formStore.shop_time,
    //     shop_phone: formStore.shop_phone,
    //     shop_details: formStore.shop_details,
    //     image_cover: formStore.image_cover,
    //     image_profile: formStore.image_profile,

    //     status: true,
    //     star: 0,
    //     visit_count: 0,
    //     latitude: 13.767811,
    //     longitude: 100.4429555,

    //     business_list: formStore.business_list,
    //     social_media: formStore.social_media,


    //     business_img: formStore.business_img,
    //     business_documents_img: formStore.listFiles
    // };
    const formData = new FormData();
    formData.append("service_type_id", parseInt(formStore.serviceTypeId));
    formData.append("service_type_name", formStore.serviceTypeName);
    formData.append("business_model_id", parseInt(formStore.business_model_id));
    formData.append("business_model_name", formStore.business_model_name);
    formData.append("business_type_id", parseInt(formStore.businessTypeId));
    formData.append("business_type_name", formStore.businessTypeName);
    formData.append("business_name", formStore.business_name);
    formData.append("business_person", formStore.business_person);
    formData.append("business_address", formStore.business_address);
    formData.append("business_contact", formStore.business_contact);
    formData.append("business_email", formStore.business_email);
    formData.append("shop_name", formStore.shop_name);
    formData.append("shop_address", formStore.shop_address);
    if (formStore.shop_days) {
        formData.append("shop_days", JSON.stringify(formStore.shop_days));
    }else{
        formData.append("shop_days", []);

    }
    formData.append("shop_time", formStore.shop_time);
    formData.append("shop_phone", formStore.shop_phone);
    formData.append("shop_details", formStore.shop_details);

    formData.append("status", true);
    formData.append("star", 0);
    formData.append("visit_count", 0);
    formData.append("latitude", formStore.latitude);
    formData.append("longitude", formStore.longitude);

    console.log(formStore.image_cover)
    // Append single image files
    if (formStore.image_cover) {
        // formData.append("image_cover", formStore.image_cover.file);
        formData.append("image_cover", formStore.image_cover.file);
    }
    if (formStore.image_profile) {
        formData.append("image_profile", formStore.image_profile.file);
    }
    if (formStore.business_list) {
        formData.append("business_list", JSON.stringify(formStore.business_list));
    }
    if (formStore.social_media) {
        formData.append("social_media", JSON.stringify(formStore.social_media));
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

    // let data={
    //     service_type_id: parseInt(localStorage.getItem("service_type_id")),
    //     service_type_name: localStorage.getItem("service_type_name"),
    //     business_model_id: parseInt(localStorage.getItem("business_model_id")),
    //     business_model_name: localStorage.getItem("business_model_name"),
    //     business_type_id: parseInt(localStorage.getItem("business_type_id")),
    //     business_type_name: localStorage.getItem("business_type_name"),
    //     business_name: localStorage.getItem("business_name"),
    //     business_person: localStorage.getItem("business_person"),
    //     business_address: localStorage.getItem("business_address"),
    //     business_contact: localStorage.getItem("business_contact"),
    //     business_email: localStorage.getItem("business_email"),
    //     shop_name: localStorage.getItem("shop_name"),
    //     shop_address: localStorage.getItem("shop_address"),
    //     shop_days: localStorage.getItem("shop_days"),
    //     shop_time: localStorage.getItem("shop_time"),
    //     shop_phone: localStorage.getItem("shop_phone"),
    //     shop_details: localStorage.getItem("shop_details"),
    //     image_cover: localStorage.getItem("image_cover"),
    //     image_profile: localStorage.getItem("image_profile"),

    //     status: true,
    //     star: 0,
    //     visit_count: 0,
    //     latitude: 13.767811,
    //     longitude: 100.4429555,
    //     business_img: JSON.parse(localStorage.getItem("business_img") || "[]"),

    //     business_list: JSON.parse(localStorage.getItem("business_list") || "[]"),
    //     social_media: JSON.parse(localStorage.getItem("social_media") || "[]"),
    //     business_documents_img: JSON.parse(localStorage.getItem("business_documents_img") || "[]"),
    // }

    console.log('formData', formData);

    try {
        const res = await dataApi.saveBusinessRegister(formData);
        alertToast.value = {
            title: t('สำเร็จ'),
            color: 'info',
            isError: false,
            msg: res.data.message,
        };

        // รีเซ็ตค่าทั้งหมดใน Pinia หลังจากบันทึกสำเร็จ
        // formStore.$reset();
        router.replace({ query: { ...route.query, bussiness_id: res.data.data.id } });
        formStore.goToPage(7);
        

        // นำทางไปยังหน้าสำเร็จ
        // router.push(`/vendor/register-business/finish?bussiness_id=${res.data.data.id}`);
    } catch (error) {
        alertToast.value = {
            title: t('ล้มเหลว'),
            isError: true,
            color: "error",
            msg: error.response?.data?.message || "Error occurred",
            dataError: error,
        };
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
        <LayoutsBaseHeader :title="t('ข้อมูลธุรกิจในแหล่งท่องเที่ยว')">
            <template #left>
                <ButtonIconBack @click="formStore.prevPage()" />
            </template>
        </LayoutsBaseHeader>
        <Form @submit="handleNext">
     
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
                                <p class="font-semibold text-gray-700 mb-2">{{ item.business_list_name }}</p>
                                <p class="text-gray-500 text-sm">฿ {{ item.business_list_price }}</p>
                            </div>
                            <!-- Delete Button -->
                            <button type="button" @click="removeItem(index)" class="!text-red-700 hover:text-red-700">
                                <i class="fa-solid fa-circle-xmark text-xl"></i>
                            </button>
                        </div>
                    </div>
                    <p class="error-text mb-3" v-if="errors?.business_list">{{ t('กรุณาเลือกอย่างน้อย') }} 1 {{ t('รายการ') }}</p>

                    <!-- <NuxtLink to="/vendor/register-business/form5/add-items"> -->
                    <Button @click="formStore.goToPage(8)" :loading="isloadingAxi" :label="t('เพิ่มรายการ')" size="small"
                        icon="pi pi-plus" severity="secondary"></Button>
                    <!-- </NuxtLink> -->
                </div>

                <Button @click="formStore.goToPage(7);" :loading="isloadingAxi" :label="t('ยืนยัน')" severity="primary" type="submit" rounded class="w-full"
                    :pt="{
                        root: {
                            class: '!border-primary-main'
                        },
                    }" />

            </div>
        </Form>
        <MyToast :data="alertToast" />
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
    </div>
</template>