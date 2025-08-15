<script setup>
definePageMeta({
    middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const isloadingAxi = useState("isloadingAxi");
const router = useRouter();
const route = useRoute();
import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import * as dataApi from "../api/data.js";
import { format } from "date-fns";
// const form = ref({
//     companyName: "บริษัท ปลูกผักเพราะรักแม่ จำกัด (มหาชน) (โฮกฮู้)",
//     responsiblePerson: "สมชาย ใจดี",
//     address: "ตำบลห้วยใหญ่ อำเภอบางละมุง จังหวัดชลบุรี",
//     phone: "0986634474",
//     email: "yourname@gmail.com",
// });
const alertToast = ref({});


const requireValue = t('กรุณาระบุข้อมูลให้ถูกต้อง');
// *************  VARIDATOR
const validationSchema = toTypedSchema(
    zod.object({
        shop_name: zod.string().nonempty(requireValue).default(""),
        police_name: zod.string().nonempty(requireValue).default(""),
        police_headquarters_name: zod.string().nonempty(requireValue).default(""),
        safety_audit_time: zod.string().nonempty(requireValue).default(""),
        safety_audit_date: zod.date({
            required_error: requireValue,
            invalid_type_error: requireValue,
        }),
        safety_audit_location: zod.string().nonempty(requireValue).default(""),


    })
);
const { handleSubmit, handleReset, errors } = useForm({
    validationSchema,
});

const resProfile = ref({ role_id: null })
const loadProfile = async () => {
    try {
        const res = await dataApi.getProfile();
        resProfile.value = res.data.data;
        police_name.value = resProfile.value.name
    } catch (error) {
        console.error(error)
    }
}

const resBusiness = ref();
const loadBusiness = async () => {
    try {
        const res = await dataApi.getBusinessById(route.params.id)
        resBusiness.value = res.data.data;
        business_id.value = resBusiness.value.id
        shop_name.value = resBusiness.value.shop_name
        safety_audit_location.value = resBusiness.value.shop_address
    } catch (error) {
        console.error(error)

    }
}

const loadAuditTime = async () => {
    try {
        const res = await dataApi.geyTimeSurvey(route.params.id)
        security_audit_times.value = res.data.data?.security_audit_times
    } catch (error) {
        console.error(error)

    }
}
onMounted(() => {
    loadAuditTime();
    loadProfile();
    loadBusiness();
})
const { value: business_id } = useField('business_id')
const { value: shop_name } = useField('shop_name')
const { value: police_name } = useField('police_name')
const { value: police_headquarters_name } = useField('police_headquarters_name')
const { value: security_audit_times } = useField('security_audit_times')
const { value: safety_audit_date } = useField('safety_audit_date')
safety_audit_date.value = new Date();
const { value: safety_audit_time } = useField('safety_audit_time')
safety_audit_time.value = format(new Date(), 'HH:mm');
const { value: safety_audit_location } = useField('safety_audit_location')


const handleNext = handleSubmit((values) => {
    localStorage.setItem("audit_shop_name", shop_name.value);
    localStorage.setItem("audit_police_name", police_name.value);
    localStorage.setItem("audit_police_headquarters_name", police_headquarters_name.value);
    localStorage.setItem("audit_safety_audit_date", format(safety_audit_date.value, "yyyy-MM-dd"));
    localStorage.setItem("audit_security_audit_times", security_audit_times.value);
    localStorage.setItem("audit_safety_audit_location", safety_audit_location.value);

    localStorage.setItem("audit_safety_audit_time", safety_audit_time.value);

    router.push(`/inspector/inspec-vender/${route.params.id}/safety-form/form2`);


});


const stepsBar = ref([
    { step: 1, active: true },
    { step: 2, active: false },
    { step: 3, active: false },
    { step: 4, active: false },
    { step: 5, active: false },
])
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
        <!-- <van-nav-bar :title="t('แบบตรวจสอบด้านความปลอดภัย')" left-arrow @click-left="router.go(-1)">
        </van-nav-bar> -->
        <LayoutsBaseHeader :title="t('แบบตรวจสอบด้านความปลอดภัย')"  :showBack="true">
        </LayoutsBaseHeader>
        <div class="p-4 ">
            <div class="flex space-x-5 items-center justify-center mb-8">
                <div v-for="(item, index) in stepsBar" :key="index"
                    :class="item.active ? 'w-8 h-2 bg-blue-900' : 'w-8 h-2 bg-gray-200'"></div>
            </div>
            <!-- {{ errors }} -->
            <Form @submit="handleNext">
                <div class="card pt-5 mb-10">
                    <h2 class="font-bold text-lg mb-3">
                        {{ t('ประเภทสถานที่จำหน่ายอาหาร เครื่องดื่ม สถานบริการ') }}
                    </h2>


                    <div class="space-y-4">
                        <!-- ชื่อสถานที่ -->
                        <div>
                            <label class="label-input">{{ t('ชื่อสถานที่') }}</label>
                            <InputText v-model="shop_name" :placeholder="t('ชื่อสถานที่')" class="w-full custom-border"
                                :invalid="errors?.shop_name ? true : false" />
                            <p class="error-text" v-if="errors?.shop_name">{{ errors?.shop_name }}</p>
                        </div>

                        <!-- กก -->
                        <div>
                            <label class="label-input">{{ t('กก') }}</label>
                            <InputText v-model="police_name" placeholder="-" class="w-full custom-border"
                                :invalid="errors?.police_name ? true : false" />
                            <p class="error-text" v-if="errors?.police_name">{{ errors?.police_name }}</p>

                        </div>

                        <!-- กองบังคับการ -->
                        <div>
                            <label class="label-input">{{ t('กองบังคับการตำรวจท่องเที่ยว') }}</label>
                            <InputText v-model="police_headquarters_name" placeholder=""
                                :invalid="errors?.police_headquarters_name ? true : false"
                                class="w-full custom-border" />
                            <p class="error-text" v-if="errors?.police_headquarters_name">{{
                                errors?.police_headquarters_name }}
                            </p>

                        </div>

                        <!-- ครั้งที่ -->
                        <div>
                            <label class="label-input">{{ t('ครั้งที่') }}</label>
                            <InputNumber v-model="security_audit_times" placeholder="" class="w-full custom-border"
                                inputClass="w-full custom-border" :invalid="errors?.security_audit_times ? true : false"
                                :useGrouping="false" />
                            <p class="error-text" v-if="errors?.security_audit_times">{{ errors?.security_audit_times }}
                            </p>

                        </div>

                        <!-- เจ้าหน้าที่ผู้ปฏิบัติ -->
                        <div>
                            <label class="label-input">{{ t('เจ้าหน้าที่ผู้ปฏิบัติ') }}</label>
                            <InputText v-model="police_name" placeholder=""
                                :invalid="errors?.police_name ? true : false" class="w-full custom-border" />
                            <p class="error-text" v-if="errors?.police_name">{{ errors?.police_name }}</p>

                        </div>

                        <!-- วันที่ตรวจสอบ -->
                        <div>
                            <label class="label-input">{{ t('วันที่ตรวจสอบ') }}</label>
                            <DatePicker v-model="safety_audit_date" dateFormat="dd-mm-yy" placeholder="" class="w-full"
                                inputClass="custom-border" :invalid="errors?.safety_audit_date ? true : false" />
                            <p class="error-text" v-if="errors?.safety_audit_date">{{ errors?.safety_audit_date }}</p>

                        </div>

                        <!-- เวลา -->
                        <div>
                            <label class="label-input">{{ t('เวลา') }}</label>
                            <InputMask v-model="safety_audit_time" :placeholder="`${t('ชั่วโมง')}:${t('นาที')}`"
                                mask="99:99" slotChar="hh:mm" class="w-full custom-border"
                                :invalid="errors?.safety_audit_time ? true : false" />
                            <p class="error-text" v-if="errors?.safety_audit_time">{{ errors?.safety_audit_time }}</p>

                        </div>

                        <!-- สถานที่ออกตรวจ -->
                        <div>
                            <label class="label-input">{{ t('สถานที่ออกตรวจ') }}</label>
                            <InputText v-model="safety_audit_location" placeholder="" class="w-full custom-border"
                                :invalid="errors?.safety_audit_location ? true : false" />
                            <p class="error-text" v-if="errors?.safety_audit_location">{{ errors?.safety_audit_location
                                }}</p>

                        </div>
                    </div>

                </div>


                <!-- <NuxtLink to="/inspector/inspec-vender/1/safety-form/form2"> -->
                <Button :loading="isloadingAxi" :label="t('ถัดไป')" type="submit" severity="primary" rounded
                    class="w-full" :pt="{
                        root: {
                            class: '!border-primary-main'
                        },
                    }" />
                <!-- </NuxtLink> -->
            </Form>
        </div>

    </div>
</template>