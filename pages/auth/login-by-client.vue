<script setup>
const isloadingAxi = useState("isloadingAxi");
const router = useRouter();
const route = useRoute();
import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import * as dataApi from "./api/data.js";

import { format } from "date-fns";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

import { useEncryptedCookie } from '~/composables/useEncryptedCookie'

const alertToast = ref({});
const requireValue = t('กรุณาระบุข้อมูลให้ถูกต้อง');

// ************* VALIDATOR
const validationSchema = toTypedSchema(
  zod.object({
    username: zod.string().nonempty(requireValue).default(""),
    password: zod.string().nonempty(requireValue).default(""),
  })
);

const { handleSubmit, handleReset, errors } = useForm({ validationSchema });
const { value: username } = useField('username')
const { value: password } = useField('password')

const handleNext = handleSubmit(async (values) => {
  try {
    const payload = {
      username: username.value,
      password: password.value,
    }

    const res = await dataApi.login(payload)

    // 🔐 เก็บ token และ role_id ด้วยการเข้ารหัส
    await useEncryptedCookie("token", res.data.data.access_token)
    await useEncryptedCookie("role_id", res.data.data.user?.role_id)

    navigateTo(`/`);
  } catch (error) {
    console.error(error)
    alertToast.value = {
      title: t("ล้มเหลว"),
      isError: true,
      color: "error",
      msg: error.response?.data?.message || "Error occurred",
      dataError: error,
    };
  }
});
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
<template>
    <div class="bg-zinc-100 min-h-screen">
        <van-nav-bar :title="t('เข้าสู่ระบบนักท่องเที่ยว')" left-arrow @click-left="navigateTo('/auth/login')">
        </van-nav-bar>
        <div class="p-4 ">

            <!-- {{ errors }} -->
            <Form @submit="handleNext">
                <div class="card pt-5 mb-10">
                    <h2 class="font-bold text-lg mb-3">
                        {{ t('เข้าสู่ระบบนักท่องเที่ยว') }}
                    </h2>


                    <div class="space-y-4">



                        <!-- กก -->
                        <div>
                            <label class="label-input">{{ t('ชื่อผู้ใช้งาน') }}</label>
                            <InputText v-model="username" placeholder="" class="w-full custom-border"
                                :invalid="errors?.username ? true : false" />
                            <p class="error-text" v-if="errors?.username">{{ errors?.username }}</p>

                        </div>

                        <!-- กองบังคับการ -->
                        <div>
                            <label class="label-input">{{ t('รหัสผ่าน') }}</label>
                            <Password toggleMask v-model="password" placeholder=""
                                :invalid="errors?.password ? true : false" class="w-full custom-border"
                                inputClass="w-full custom-border" :feedback="false" />
                            <p class="error-text" v-if="errors?.password">{{
                                errors?.password }}</p>

                        </div>


                    </div>

                </div>


                <!-- <NuxtLink to="/inspector/inspec-vender/1/safety-form/form2"> -->
                <!-- เพิ่ม dialog resigster -->
                <Button :loading="isloadingAxi" :label="t('เข้าสู่ระบบ')" type="submit" severity="primary" rounded
                    class="w-full" :pt="{
                        root: {
                            class: '!border-primary-main'
                        },
                    }" />
                <!-- </NuxtLink> -->
            </Form>
        </div>

    </div>

    <MyToast :data="alertToast" />

</template>