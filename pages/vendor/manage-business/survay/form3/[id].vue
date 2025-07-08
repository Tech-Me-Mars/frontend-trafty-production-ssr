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
    <!-- <Form :validation-schema="yupSchema" @submit="onSubmit">
    <div v-for="(field, index) in formSchema.fields" :key="index" class="form-group">
      <label>{{ field.label }}</label>
      <div v-for="choice in field.choices" :key="choice.id" class="flex items-center gap-2">

        <Field type="radio " :name="field.name" v-slot="{ field }">
          <RadioButton v-bind="field" v-model="field.name" :value="choice.id" />
        </Field>

        <label :for="`choice-${field.name}-${choice.id}`">{{ choice.audit_choice_text }}</label>
      </div>
      <ErrorMessage class="text-red-500" :name="field.name" />
    </div>
    <button class="p-5 border-2" type="submit">Submit</button>
  </Form> -->
    <div class="bg-zinc-100 min-h-screen">
        <van-nav-bar :title="t('แบบตรวจสอบด้านความปลอดภัย')" left-arrow
            @click-left="navigateTo(`/vendor/manage-business/survay/form2/${route.params.id}`)">
        </van-nav-bar>
        <div class="p-4 ">
            <Form :validation-schema="yupSchema" @submit="onSubmit">
                <div class="flex space-x-5 items-center justify-center mb-8">
                    <div v-for="(item, index) in stepsBar" :key="index"
                        :class="item.active ? 'w-8 h-2 bg-blue-900' : 'w-8 h-2 bg-gray-200'"></div>
                </div>


                <div class="card mb-5">
                    <h2 class="font-bold text-lg mb-8">
                        {{ t('รายละเอียดการตรวจสอบมาตรฐานด้านความปลอดภัยสำหรับการท่องเที่ยว') }}
                    </h2>
                    <h2 class="font-bold text-lg mb-8">
                        {{ resSurvey?.topic?.name }}
                    </h2>

                    <div class="space-y-4">
                        <div v-for="(field, index) in formSchema.fields" :key="index" class="form-group">
                            <label class="label-survay">{{ field.label }}</label>
                            <div class="flex flex-col flex-wrap gap-2">
                                <div class="flex items-center gap-2" v-for="choice in field.choices" :key="choice.id">
                                    <Field type="radio " :name="field.name" v-slot="{ field }">
                                        <RadioButton v-bind="field" v-model="field.name" :value="choice.id" />
                                    </Field>
                                    <label :for="`choice-${field.name}-${choice.id}`">{{ choice.audit_choice_text
                                        }}</label>


                                </div>
                                <ErrorMessage class="text-red-500" :name="field.name" />
                            </div>
                        </div>

                    </div>
                </div>
                <!-- <NuxtLink to="/vendor/manage-business/survay/form3"> -->
                <Button :loading="isloadingAxi" :label="t('ถัดไป')" severity="primary" type="submit" rounded class="w-full" :pt="{
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

<script setup>
definePageMeta({
  middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const isloadingAxi = useState("isloadingAxi");
import { ref, computed, onMounted } from "vue";
import { useForm, Field, Form, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import * as dataApi from "./api/data.js";
const alertToast = ref({});

const route = useRoute();
// Schema ของฟอร์ม
const formSchema = ref({
    fields: [],
});
const stepsBar = ref([
    { step: 1, active: false },
    { step: 2, active: false },
    { step: 3, active: true },
])
// ค่าของฟอร์ม
const formValues = ref({});

// โหลดคำถามจาก API
const resSurvey = ref()
const loadSurvey = async () => {
    try {
        const res = await dataApi.geySurveyBuId(3);
        resSurvey.value = res.data.data;
        const questions = res.data.data.questions;

        formSchema.value.fields = questions.map((question) => ({
            label: question.text, // คำถาม
            name: question.id.toString(), // ใช้ ID เป็นชื่อ
            choices: question.choices, // ตัวเลือกช้อยส์
            rules: Yup.number().required(t('กรุณาเลือกแบบสอบถาม')), // Validation Rule
        }));

        // กำหนดค่าเริ่มต้นให้กับ formValues
        formValues.value = formSchema.value.fields.reduce((acc, field) => {
            acc[field.name] = null; // ค่าเริ่มต้นของแต่ละฟิลด์เป็น null
            return acc;
        }, {});

        // อัปเดตค่า initialValues ใน useForm
        setValues(formValues.value);
    } catch (error) {
        console.error("Failed to load survey:", error);
    }
};

// สร้าง Yup schema จาก formSchema
const yupSchema = computed(() => {
    const shape = formSchema.value.fields.reduce((acc, field) => {
        acc[field.name] = field.rules;
        return acc;
    }, {});
    return Yup.object().shape(shape);
});

// ตั้งค่าฟอร์ม
const { handleSubmit, setValues } = useForm({
    initialValues: formValues.value,
    validationSchema: yupSchema,
});


const clearLocalStorageKeys = () => {
    const keysToRemove = [
        "choice"
    ];

    keysToRemove.forEach((key) => localStorage.removeItem(key));
};
// ฟังก์ชันเมื่อ Submit
const onSubmit = async (values) => {
    try {
        // ตรวจสอบว่า values เป็น object และไม่ว่างเปล่า
        if (!values || typeof values !== "object" || Object.keys(values).length === 0) {
            console.error("Invalid values:", values);
            return;
        }

        // วนลูป key-value ใน values
        for (const [key, value] of Object.entries(values)) {
            // สร้าง key-value object
            const keyValue = { [key]: value };

            // บันทึกลง localStorage
            await saveToLocalStorage("choice", keyValue);
        }
        const storedChoice = JSON.parse(localStorage.getItem("choice")) || [];
        const payload = {
            "business_id": parseInt(route.params.id),
            "user_type": null,
            "user_id": null,
            "user_name": null,
            "police_id": null,
            "police_name": null,
            "police_headquarters_id": null,
            "police_headquarters_name": null,
            "security_audit_times": 2,
            "safety_audit_date": null,
            "safety_audit_time": null,
            "safety_audit_location": null,
            "choice": storedChoice
        }
        const res = await dataApi.saveSurveyVendor(payload);
        alertToast.value = {
            title: t('สำเร็จ'),
            color: 'info',
            isError: false,
            msg: res.data.message,
        }
        clearLocalStorageKeys()
        // เปลี่ยนเส้นทางไปยังหน้าอื่น
        setTimeout(() => {
            navigateTo(`/vendor/manage-business/survay/finish/${route.params.id}`);
        }, 1000);
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
};

function saveToLocalStorage(key, newValue) {
    // ตรวจสอบว่ามีข้อมูลใน localStorage หรือไม่
    let storedData = JSON.parse(localStorage.getItem(key)) || [];

    // ตรวจสอบว่า key ใน newValue มีอยู่แล้วใน storedData หรือไม่
    let isKeyExists = storedData.some(item => Object.keys(item)[0] === Object.keys(newValue)[0]);

    if (isKeyExists) {
        // อัปเดตค่าถ้ามี key เดิม
        storedData = storedData.map(item =>
            Object.keys(item)[0] === Object.keys(newValue)[0] ? newValue : item
        );
    } else {
        // เพิ่มข้อมูลใหม่ถ้ายังไม่มี key
        storedData.push(newValue);
    }

    // บันทึกกลับไปยัง localStorage
    localStorage.setItem(key, JSON.stringify(storedData));
}

// โหลดข้อมูลเมื่อ component ถูก mount
onMounted(() => {
    loadSurvey();
});
</script>

<style scoped>
.form-group {
    margin-bottom: 1rem;
}

.text-red-500 {
    font-size: 0.875rem;
    color: red;
}
</style>