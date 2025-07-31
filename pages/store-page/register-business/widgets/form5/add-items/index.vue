<script setup>
definePageMeta({
  middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const isloadingAxi = useState("isloadingAxi");
const router = useRouter();

import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import * as dataApi from "../../../api/data.js";

// const form=ref({
//     name:"สเต็กซี่โครงสะพานโค้ง",price:"250 - 400"
// })
const requireValue = t('กรุณาระบุข้อมูลให้ถูกต้อง');
const requireText = t('ระบุข้อมูล');
// *************  VARIDATOR
const validationSchema = toTypedSchema(
    zod.object({
        business_list_name: zod.string().nonempty(requireValue).default(""),
        business_list_price: zod.string().nonempty(requireValue).default(""),

    })
);

const { handleSubmit, handleReset, errors } = useForm({
    validationSchema,
});

const { value: business_list_name } = useField('business_list_name')
const { value: business_list_price } = useField('business_list_price')
import { useFormStore } from "@/store/businessStore.js";
const formStore = useFormStore(); // ใช้ Pinia Store
const handleNext = handleSubmit((values) => {
    formStore.setForm5(values);
    formStore.goToPage(6)
    // router.push("/vendor/register-business/form5");
});
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
        <!-- <van-nav-bar :title="t('เพิ่มรายการ')" left-arrow @click-left="formStore.goToPage(6)">
        </van-nav-bar> -->
        <LayoutsBaseHeader :title="t('เพิ่มรายการ')">
            <template #left>
                <ButtonIconBack @click="formStore.goToPage(6)" />
            </template>
        </LayoutsBaseHeader>
        <div class="p-4 ">

            <Form @submit="handleNext">
            <div class="card pt-5 mb-10">
                <!-- Title -->
                <h2 class="font-bold text-lg mb-3 ">{{ t('ธุรกิจในแหล่งท่องเที่ยว') }}</h2>

                <!-- List of Businesses -->
                <div class="space-y-4">
                    <div>
                        <label class="label-input">{{ t('ชื่อรายการ') }}</label>
                        <InputText v-model="business_list_name" :placeholder="t('ชื่อรายการ')" class="w-full custom-border" :invalid="errors?.business_list_name ? true : false" />
                        <p class="error-text" v-if="errors?.business_list_name">{{ errors?.business_list_name }}</p>

                    </div>
                    <div>
                        <label class="label-input">{{ t('ราคา') }}</label>
                        <InputText v-model="business_list_price" :placeholder="t('ราคา')" class="w-full custom-border" :invalid="errors?.business_list_price ? true : false" />
                        <p class="error-text" v-if="errors?.business_list_price">{{ errors?.business_list_price }}</p>

                    </div>

                </div>
            </div>

            <!-- <NuxtLink to="/vendor/register-business/form5"> -->
            <Button :loading="isloadingAxi" :label="t('บันทึก')" severity="primary" type="submit" rounded class="w-full" :pt="{
                root: {
                    class: '!border-primary-main'
                },
            }" />

        </Form>
            <!-- </NuxtLink> -->
        </div>

    </div>
</template>