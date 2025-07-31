<script setup>
import { useRouter, useRoute } from 'vue-router';
const isloadingAxi = useState("isloadingAxi");
const router = useRouter();
const route = useRoute();

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

// import * as dataApi from "./api/data.js";
// import { useEncryptedCookie } from '~/composables/useEncryptedCookie';

const alertToast = ref({});

const requireValue = t('กรุณาระบุข้อมูลให้ถูกต้อง');

const validationSchema = toTypedSchema(
  zod.object({
    name: zod.string()
      .nonempty(requireValue)
      .max(50, `${t('ชื่อไม่ควรเกิน')} 50 ${t('ตัวอักษร')}`).default(""),
    username: zod.string()
      .nonempty(requireValue)
      .min(4, `${t('ชื่อผู้ใช้งานต้องมีอย่างน้อย')} ${t('ตัวอักษร')}`)
      .max(20, `${t('ชื่อผู้ใช้งานไม่ควรเกิน')} 20 ${t('ตัวอักษร')}`).default(""),
    email: zod.string()
      .nonempty(requireValue)
      .email(t('รูปแบบอีเมลไม่ถูกต้อง')).default(""),
    password: zod.string()
      .nonempty(requireValue)
      .min(8, `${t('รหัสผ่านต้องมีอย่างน้อย')} 8 ${t('ตัวอักษร')}`)
      .max(50, `${t('รหัสผ่านไม่ควรเกิน')} 50 ${t('ตัวอักษร')}`)
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, t('รหัสผ่านต้องมีตัวอักษรและตัวเลข')).default(""),
  })
)

const { handleSubmit, errors } = useForm({
  validationSchema,
});

const { value: name } = useField('name')
const { value: username } = useField('username')
const { value: password } = useField('password')
const { value: email } = useField('email')

const handleNext = handleSubmit(async () => {
  try {
    const payload = {
      name: name.value,
      username: username.value,
      password: password.value,
      role_id: 1,
      email: email.value,
      status: true
    };

    // const res = await dataApi.register(payload);

    // ❗ ปรับเป็นใช้ useEncryptedCookie
    // await useEncryptedCookie('token', res.data.data.access_token);
    // await useEncryptedCookie('role_id', res.data.data.user?.role_id);

    navigateTo(`/auth/login`);
  } catch (error) {
    console.error(error)
    alertToast.value = {
      title: t('ล้มเหลว'),
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
        <!-- <van-nav-bar title="ลงทะเบียนนักท่องเที่ยว" left-arrow @click-left="router.go(-1)">
        </van-nav-bar> -->
        <LayoutsBaseHeader title="ลงทะเบียนนักท่องเที่ยว" showBack></LayoutsBaseHeader>
        <div class="p-4 ">

            <!-- {{ errors }} -->
            <Form @submit="handleNext">
                <div class="card pt-5 mb-10">
                    <h2 class="font-bold text-lg mb-3">
                        {{ t('ลงทะเบียนเข้าใช้งานนักท่องเที่ยว') }}
                    </h2>


                    <div class="space-y-4">
                        <!-- ชื่อสถานที่ -->
                        <div>
                            <label class="label-input">{{ t('ชื่อ') }}</label>
                            <InputText v-model="name" :placeholder="t('ชื่อ')" class="w-full custom-border"
                                :invalid="errors?.name ? true : false" />
                            <p class="error-text" v-if="errors?.name">{{ errors?.name }}</p>
                        </div>
                        <div>
                            <label class="label-input">{{ t('อีเมล') }}</label>
                            <InputText v-model="email" :placeholder="t('อีเมล')" class="w-full custom-border"
                                :invalid="errors?.email ? true : false" />
                            <p class="error-text" v-if="errors?.email">{{ errors?.email }}</p>

                        </div>

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
                <Button :loading="isloadingAxi" :label="t('ลงทะเบียน')" type="submit" severity="primary" rounded class="w-full"
                    :pt="{
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