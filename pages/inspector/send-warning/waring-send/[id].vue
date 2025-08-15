<template>
    <div class="min-h-screen bg-zinc-50">
        <!-- <van-nav-bar :title="t('ส่งใบเตือน')">
            <template #right>
                <i @click="navigateTo('/inspector/home')" class="fa-solid fa-xmark"
                    style="color: white;font-size: 26px;"></i>
            </template>
</van-nav-bar> -->
        <LayoutsBaseHeader :title="t('ส่งใบเตือน')">
                        <template #right>
                <i @click="navigateTo('/inspector/home')" class="fa-solid fa-xmark"
                    style="color: white;font-size: 26px;"></i>
            </template>
        </LayoutsBaseHeader>
        <!-- Form Section -->
        <Form @submit="handleNext">
            <div class="p-4">

                <!-- Location Input -->
                <div class="mb-4">
                    <label class="label-input">{{ t('สถานที่') }}</label>
                    <InputText v-model="shop_name" readonly class="w-full" />



                </div>

                <!-- Subject Input -->
                <!-- <div class="mb-32">
                    <label class="label-input">หัวข้อ</label>
                    <InputText v-model="warning_title" class="w-full mb-3"
                        :invalid="errors?.warning_title ? true : false" />
                    <p class="error-text" v-if="errors?.warning_title">{{ errors?.warning_title }}</p>
                    <Textarea placeholder="พิมพ์ข้อความตอบกลับ" class="w-full" rows="6" cols="30"
                        v-model="warning_details" />
                    <p class="error-text" v-if="errors?.warning_details">{{ errors?.warning_details }}</p>
                </div> -->
                <!-- ข้อที่ไม่ผ่านเกณมาตรฐาน -->
                <div class="p-4 border-b flex justify-between">
                    <h1 class="text-lg font-bold">{{ t('ข้อที่ไม่ผ่านเกณฑ์มาตรฐานความปลอดภัย') }}</h1>

                </div>

                <div class="p-4 card mb-10">
                    <div v-for="(item, index) in resData?.survey_audit_police_details" :key="index">
                        <h2 class="text-base font-semibold mb-2">
                            {{ item?.topic_name }}
                        </h2>
                        <ul class="space-y-3">
                            <li class="flex items-start space-x-3" v-for="(item_sub, index_sub) in item?.question"
                                :key="index_sub">
                                <i v-if="item_sub?.choice_text == 'มี'"
                                    class="fa-solid fa-circle-check text-blue-700 mt-1"></i>
                                <i v-else class="fa-solid fa-circle-xmark text-red-600 mt-1"></i>
                                <span>{{ item_sub?.audit_questions_text }}</span>
                            </li>

                        </ul>
                        <hr class="border-b mx-4 my-5" />
                    </div>
                </div>



                <!-- Submit Button -->
                <Button :loading="isloadingAxi" type="submit" :label="t('ส่งใบเตือน')" severity="primary" rounded
                    class="w-full" :pt="{
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


const alertToast = ref({})
import * as dataApi from "../api/data.js";

import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";


const resData = ref()
const loadData = async () => {
    try {
        const res = await dataApi.getSuveyAuditPolice(route.params.id);
        resData.value = res.data.data
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
        // warning_title: zod.string().nonempty(requireValue).default(""),
        // warning_details: zod.string().nonempty(requireValue).default(""),
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