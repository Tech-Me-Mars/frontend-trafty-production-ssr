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
//     phone_office: "0986634474",
//     email: "yourname@gmail.com",
// });
const alertToast = ref({});


const requireValue = t('กรุณาระบุข้อมูลให้ถูกต้อง');
// *************  VARIDATOR
const validationSchema = toTypedSchema(
    zod.object({
        // shop_name: zod.string().nonempty(requireValue).default(""),
        police_name: zod.string().nonempty(requireValue).default(""),
        responsibilities: zod.string().nonempty(requireValue).default(""),
        cid: zod.string().nonempty(requireValue).default(""),
        safety_audit_location: zod.string().nonempty(requireValue).default(""),
        phone_office: zod.string().nonempty(requireValue).default(""),
        phone: zod.string().nonempty(requireValue).default(""),



    })
);
const { handleSubmit, handleReset, errors } = useForm({
    validationSchema,
});

const loadDataToForm = async () => {
    try {
        // const res = await dataApi.getBusinessById(route.params.id)
        // resBusiness.value = res.data.data;
        // business_id.value = resBusiness.value.id
        // shop_name.value = resBusiness.value.shop_name
        // safety_audit_location.value  = resBusiness.value.shop_address
        police_name.value = localStorage.getItem("audit_police_name")
        safety_audit_location.value = localStorage.getItem("audit_safety_audit_location")


    } catch (error) {

    }

}
onMounted(() => {
    loadDataToForm()
    // loadProfile();
    // loadBusiness();
})
const { value: shop_name } = useField('shop_name')
const { value: police_name } = useField('police_name')
const { value: responsibilities } = useField('responsibilities')
const { value: cid } = useField('cid')

const { value: checked } = useField('checked', null, {
    initialValue: true
})
const { value: score_show } = useField('score_show', null, {
    initialValue: true
})

const { value: safety_audit_location } = useField('safety_audit_location')
const { value: phone_office } = useField('phone_office')
const { value: phone } = useField('phone')



const { value: listFiles } = useField('listFiles', null, {
    initialValue: []
})
const clearAuditLocalStorageKeys = () => {
    const keysToRemove = [
        "audit_shop_name",
        "audit_police_name",
        "audit_police_headquarters_name",
        "audit_safety_audit_date",
        "audit_security_audit_times",
        "audit_safety_audit_location",
        "audit_safety_audit_time",
        "audit_choice",
        "audit_business_id"
    ];

    keysToRemove.forEach((key) => localStorage.removeItem(key));
};
const handleNext = handleSubmit(async (values) => {
    localStorage.setItem("audit_police_name", police_name.value);
    localStorage.setItem("audit_safety_audit_location", safety_audit_location.value);
    // router.push(`/inspector/inspec-vender/1/safety-form/form2/${route.params.id}`);

    try {
        const storedChoice = JSON.parse(localStorage.getItem("audit_choice")) || [];
        const payload = {
            "business_id": parseInt(route.params.id),
            "user_type": "เจ้าหน้าที่ตำรวจท่องเที่ยว",
            "user_id": null,
            "user_name": null,
            "police_id": null,
            "police_name": null,
            "police_headquarters_id": 1,
            "police_headquarters_name": localStorage.getItem("audit_police_headquarters_name"),
            "security_audit_times": parseInt(localStorage.getItem("audit_security_audit_times")),
            "safety_audit_date": localStorage.getItem("audit_safety_audit_date"),
            "safety_audit_time": localStorage.getItem("audit_safety_audit_time"),
            "safety_audit_location": localStorage.getItem("audit_safety_audit_location"),
            "choice": storedChoice,
            "score_show": score_show.value,
        }
        const res = await dataApi.saveSurveyAudit(payload);
        alertToast.value = {
            title: t('สำเร็จ'),
            color: 'info',
            isError: false,
            msg: res.data.message,
        }
        clearAuditLocalStorageKeys();
        // เปลี่ยนเส้นทางไปยังหน้าอื่น
        // setTimeout(() => {
        navigateTo(`/inspector/home`);
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

});


const stepsBar = ref([
    { step: 1, active: false },
    { step: 2, active: false },
    { step: 3, active: false },
    { step: 4, active: false },
    { step: 5, active: true },
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
                    <!-- <h2 class="font-bold text-lg mb-3">
                        {{ t('ประเภทสถานที่จำหน่ายอาหาร เครื่องดื่ม สถานบริการ') }}
                    </h2> -->


                    <div class="space-y-4">
                        <div class="flex gap-4">
                            <label class="flex items-center gap-3">
                                <Checkbox v-model="checked" binary />{{ t('ใช้ข้อมูลที่บันทึกไว้') }}
                            </label>
                            <label class="flex items-center gap-3">
                                <Checkbox v-model="score_show" binary />{{ t('แสดงมาตรฐานความปลอดภัย') }}
                            </label>
                        </div>




                        <!-- กก -->
                        <div>
                            <label class="label-input">{{ t('ชื่อ') }}</label>
                            <InputText v-model="police_name" placeholder="-" class="w-full custom-border"
                                :invalid="errors?.police_name ? true : false" />
                            <p class="error-text" v-if="errors?.police_name">{{ errors?.police_name }}</p>

                        </div>

                        <div>
                            <label class="label-input">{{ t('หน้าที่รับผิดชอบ') }}</label>
                            <InputText v-model="responsibilities" placeholder="" class="w-full custom-border"
                                :invalid="errors?.responsibilities ? true : false" />
                            <p class="error-text" v-if="errors?.responsibilities">{{ errors?.responsibilities }}</p>

                        </div>


                        <!-- ชื่อสถานที่ -->
                        <div>
                            <label class="label-input">{{ t('หมายเลขบัตรประชาชน/หนังสือเดินทาง') }}</label>
                            <InputText v-model="cid" placeholder="" class="w-full custom-border"
                                :invalid="errors?.cid ? true : false" />
                            <p class="error-text" v-if="errors?.cid">{{ errors?.cid }}</p>
                        </div>

                        <!-- สถานที่ออกตรวจ -->
                        <div>
                            <label class="label-input">{{ t('ที่อยู่') }}</label>
                            <InputText v-model="safety_audit_location" placeholder="" class="w-full custom-border"
                                :invalid="errors?.safety_audit_location ? true : false" />
                            <p class="error-text" v-if="errors?.safety_audit_location">{{ errors?.safety_audit_location
                                }}</p>

                        </div>
                        <div>
                            <label class="label-input">{{ t('หมายเลขโทรศัพท์สำนักงาน') }}</label>
                            <InputText v-keyfilter.int v-model="phone_office" placeholder=""
                                class="w-full custom-border" :invalid="errors?.phone_office ? true : false" />
                            <p class="error-text" v-if="errors?.phone_office">{{ errors?.phone_office
                                }}</p>

                        </div>
                        <div>
                            <label class="label-input">{{ t('มือถือ') }}</label>
                            <InputText v-keyfilter.int v-model="phone" placeholder="" class="w-full custom-border"
                                :invalid="errors?.phone ? true : false" />
                            <p class="error-text" v-if="errors?.phone">{{ errors?.phone
                                }}</p>

                        </div>







                    </div>

                </div>


                <!-- <NuxtLink to="/inspector/inspec-vender/1/safety-form/form2"> -->
                <Button :loading="isloadingAxi" :label="t('ถัดไป')" type="submit" severity="primary" rounded class="w-full"
                    :pt="{
                        root: {
                            class: '!border-primary-main'
                        },
                    }" />
                <!-- </NuxtLink> -->
            </Form>
        </div>
        <MyToast :data="alertToast" />

    </div>
</template>