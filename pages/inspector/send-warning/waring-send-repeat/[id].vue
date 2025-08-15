<template>
    <div class="min-h-screen bg-zinc-50">
        <!-- <van-nav-bar :title="t('ส่งใบเตือน')" left-arrow @click-left="router.go(-1)">
            <template #right>
                <i @click="router.go(-1)" class="fa-solid fa-xmark"
                    style="color: white;font-size: 26px;"></i>
            </template>
        </van-nav-bar> -->
                <LayoutsBaseHeader :title="t('ส่งใบเตือน')" showBack>
                                    <template #right>
                <i @click="router.go(-1)" class="fa-solid fa-xmark"
                    style="color: white;font-size: 26px;"></i>
            </template>
        </LayoutsBaseHeader>
        <!-- Form Section -->
        <Form @submit="handleNext">
            <div class="p-4">

                <!-- Location Input -->
                <div class="mb-4">
                    <label class="label-input">{{ t('สถานที่') }}</label>
                    <InputText v-model="shop_name" class="w-full" />



                </div>

                <!-- Subject Input -->
                <div class="mb-32">
                    <label class="label-input">{{ t('หัวข้อ') }}</label>
                    <!-- <InputText value="แจ้งการประเมินธุรกิจในแหล่งท่องเที่ยว" class="w-full mb-3" /> -->
                    <InputText v-model="warning_title" class="w-full mb-3"
                        :invalid="errors?.warning_title ? true : false" />
                    <p class="error-text" v-if="errors?.warning_title">{{ errors?.warning_title }}</p>

                    <!-- <InputTextArea value="โอ้กะจู๋ ตำบลแสนสุข อำเภอเมือง ชลบุรี 20110" class="w-full" /> -->
                    <Textarea :placeholder="t('พิมพ์ข้อความตอบกลับ')" class="w-full" rows="6" cols="30"
                        v-model="warning_details" />
                    <p class="error-text" v-if="errors?.warning_details">{{ errors?.warning_details }}</p>

                </div>


                <!-- Submit Button -->
                <Button :loading="isloadingAxi" type="submit" :label="t('ส่งใบเตือน')" severity="primary" rounded class="w-full" :pt="{
                    root: {
                        class: '!border-primary-main'
                    },
                }" />

            </div>
        </Form>

    <MyToast :data="alertToast" />

    </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const isloadingAxi = useState("isloadingAxi");
const route = useRoute();
const router = useRouter();


const alertToast =ref({})
import * as dataApi from "../api/data.js";

import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";


const loadData = async () => {
    try {
        const res = await dataApi.getSuveyAuditPoliceAndUpdate(route.params.id);
        //   resData.value= res.data.data;
        console.log(res.data.data)
        shop_name.value = res.data.data.shop_name
    } catch (error) {
        console.error(error)
    }
}

onMounted(() => loadData())
const requireValue = t('กรุณาระบุข้อมูลให้ถูกต้อง');
// *************  VARIDATOR
const validationSchema = toTypedSchema(
    zod.object({
        warning_title: zod.string().nonempty(requireValue).default(""),
        warning_details: zod.string().nonempty(requireValue).default(""),
    })
);
const { handleSubmit, handleReset, errors } = useForm({
    validationSchema,
});


const { value: shop_name } = useField('shop_name')

const { value: warning_title } = useField('warning_title')
const { value: warning_details } = useField('warning_details')

const handleNext = handleSubmit(async () => {
    try {
        const payload = {
            "survey_audit_police_id": parseInt(route.params.id),
            "warning_title": warning_title.value,
            "warning_details": warning_details.value
        }
        const res = await dataApi.saveSurveyPoliceWarning(payload);
        handleReset()
        alertToast.value = {
            title: t('สำเร็จ'),
            color: 'info',
            isError: false,
            msg: res.data.message,
        }
        // setTimeout(() => {
            navigateTo(`/inspector/send-warning/success/${route.params.id}`)
        // }, 1000);
    } catch (error) {
        alertToast.value = {
            title: t('ล้มเหลว'),
            isError: true,
            color: "error",
            msg: error.response?.data?.message || "Error occurred",
            dataError: error,
        };
        console.error(error)
    }
})
</script>

<style>
.van-nav-bar {
    --van-nav-bar-background: #281c74;
    --van-nav-bar-text-color: white;
    --van-nav-bar-icon-color: white;
    --van-nav-bar-title-text-color: white;
    --van-nav-bar-height: 70px
}

.cutome-datepicker {
    border: none !important;
    background-color: #281c74 !important;
}
</style>