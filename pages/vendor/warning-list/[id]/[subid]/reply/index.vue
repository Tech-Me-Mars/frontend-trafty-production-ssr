<template>
    <div class="min-h-screen bg-zinc-50">
        <!-- Header Section -->
        <van-nav-bar :title="t('จัดการใบเตือน')" left-arrow
            @click-left="navigateTo(`/vendor/warning-list/${route.params.id}`)">
        </van-nav-bar>

        <!-- <section class="bg-white shadow-sm p-4 mb-5">
            <div class="!border !border-black rounded-sm card ">
                <div class="flex items-center mb-2">
                    <i class="fas fa-exclamation-triangle text-primary-main mr-2"></i>
                    <p class="text-lg font-semibold text-primary-main">{{ resWarning?.warning_title }}</p>
                </div>
                <p class=" text-gray-600 mb-2">
                    {{ resWarning?.warning_details }}
                </p>



            </div>
        </section> -->
        <!-- {{ errors }} -->
        <Form @submit="handleNext">
            <section class="px-0">
                <div class="border bg-white mb-2 rounded-md p-4  text-gray-800">
                    <div class="flex items-center mb-2  font-semibold">
                        <i class="pi pi-comment mr-2"></i> ข้อเสนอแนะเพิ่มเติม
                    </div>

                    <Textarea v-model="suggestion" autoResize rows="3" placeholder="พิมพ์ข้อเสนอแนะเพิ่มเติม..."
                        class="w-full" />
                </div>

                <div class="px-4">
                    <h1 class="text-lg font-semibold text-primary-main ">หัวข้อที่ไม่ผ่านเกณฑ์มาตรฐานความปลอดภัย</h1>
                    <p class="text-gray-500">สามารถอัพโหลดรูปภาพได้เพีบง 1 รูปต่อข้อ</p>

                </div>

                <div class="mb-2 card max-w-md px-4" v-for="(item, index) in fields" :key="index">
                    <div class="flex items-start space-x-3 mb-2">
                        <i class="fa-solid fa-circle-xmark text-red-600 mt-1"></i>

                        <span>{{ item.value.audit_questions_text }}</span>
                    </div>

                    <div class="">
                        <div class="flex items-start gap-2">

                            <InputText v-model="item.value.respond_warning_note" class="w-full  mb-2 flex-1"
                                :placeholder="`${t('ข้อความ')}...`"
                                :invalid="errors[`list_survey[${index}].respond_warning_note`] ? true : false" />
                            <FileUpload mode="basic" accept="image/*" @select="event => onFileSelect(event, index)"
                                customUpload rounded auto severity="secondary"
                                class="rounded-full p-button-outlined border-indigo-900" style="color: rgb(49 46 129);"
                                outlined chooseLabel="" chooseIcon="fa-regular fa-images" />
                        </div>
                        <div class="flex flex-wrap gap-2 mb-3 relative" v-if="item.value.respond_warning_img?.src">
                            <div class="relative">
                                <Image :src="item.value.respond_warning_img?.src" alt="Image" width="50"
                                    class="object-cover w-20 h-20 rounded-md shadow-md"
                                    :pt="{ image: { class: 'object-cover w-20 h-20 rounded-md shadow-md' } }" preview />
                                <i class="fa-solid fa-xmark absolute top-0 right-0 p-0.5 bg-white rounded-full shadow-md cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-red-300"
                                    @click="removeImage(index, imageIndex)"></i>
                            </div>
                        </div>

                    </div>
                </div>
                <!-- <div class="relative w-full">
                    <Textarea placeholder="พิมพ์ข้อความที่ปรับปรุง" class="w-full border rounded-lg p-4  mb-2"
                        id="over_label" v-model="respond_warning_note" rows="5" cols="30" style="resize: none"
                        :maxlength="100" />
                    <span class="absolute bottom-6 right-1 text-gray-400 text-sm">
                        {{ respond_warning_note.length }}/100 ตัวอักษร
                    </span>
                </div>
                <p class="error-text" v-if="errors?.respond_warning_note">{{ errors?.respond_warning_note }}</p>
                <div class="flex flex-wrap gap-2 mb-3 relative">
                    <div v-for="(image, index) in files" :key="index" class="relative">
                        <Image :src="image.src" alt="Image" width="50"
                            class="object-cover w-20 h-20 rounded-md shadow-md"
                            :pt="{ image: { class: 'object-cover w-20 h-20 rounded-md shadow-md' } }" preview />
                        <i class="fa-solid fa-xmark absolute top-0 right-0 p-0.5 bg-white rounded-full shadow-md cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-red-300"
                            @click="removeImage(index)"></i>

                    </div>
                </div>
                <div class="mb-16">
                    <div class="flex">
                        <FileUpload mode="basic" accept="image/*" @select="onFileSelect" customUpload rounded auto
                            severity="secondary" class="rounded-full p-button-outlined border-indigo-900"
                            style="color: rgb(49 46 129);" outlined chooseLabel="เพิ่มรูปภาพ"
                            chooseIcon="fa-regular fa-images" :multiple="true" />
                    </div>

                    <p class="error-text" v-if="errors?.files">กรุณาเลือกอย่างน้อย 1 ภาพ</p>

                </div>
                <div class="max-w-sm mx-auto">
                    <Button :loading="isloadingAxi" type="submit" label="จัดการใบเตือน" class="w-full" rounded></Button>
                </div> -->
                <!-- <div class="card p-3 mb-3" v-for="(item, index) in fields" :key="item.key">
                    {{ item }}
                </div> -->
                <div class="max-w-sm mx-auto">
                    <Button :loading="isloadingAxi" type="submit" :label="t('บันทึกการตอบกลับ')" class="w-full"
                        rounded></Button>
                </div>
            </section>
        </Form>

        <MyToast :data="alertToast" />

    </div>
</template>

<style>
.van-nav-bar {
    --van-nav-bar-background: #281c74;
    --van-nav-bar-text-color: white;
    --van-nav-bar-icon-color: white;
    --van-nav-bar-title-text-color: white;
    --van-nav-bar-height: 70px;
}
</style>

<script setup>
definePageMeta({
    middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const isloadingAxi = useState("isloadingAxi");
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as dataApi from "../api/data.js";
import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";


const router = useRouter();
const route = useRoute();
const alertToast = ref({});

const amend_text = ref('')

const resWarning = ref();
const loadWarningById = async () => {
    try {
        const res = await dataApi.getSurveyWarningById(route.params.subid);
        resWarning.value = res.data.data
        const valueForAppend = res.data.data?.survey_audit_detail.flatMap(item => item.question);
        valueForAppend.forEach((e, i) => {
            push({
                // key: fields.value.length + 1,
                // value: {
                survey_warning_respond_details_id: e.survey_warning_respond_details_id,
                survey_audit_police_details_id: e.survey_audit_police_details_id,
                audit_questions_text: e.audit_questions_text,
                choice_text: e.choice_text,
                icon: e.icon,
                respond_warning_note: "",
                respond_warning_img: null,
                // }
            });
        });
    } catch (error) {
        console.error(error)
    }
}
onMounted(() => {
    loadWarningById();
})


const requireValue = t('กรุณาระบุข้อมูลให้ถูกต้อง');
// *************  VARIDATOR
const validationSchema = toTypedSchema(
    zod.object({
        // shop_name: zod.string().nonempty(requireValue).default(""),


        list_survey: zod.array(
            zod.object({
                respond_warning_note: zod.string().nonempty(requireValue).default(""),
            })
        ),
    })
);
const { handleSubmit, errors, handleReset } = useForm({
    initialValues: {

    },
    validationSchema,
});


const { value: suggestion } = useField('suggestion')
const { remove, push, fields } = useFieldArray("list_survey");


// const { value: files } = useField('files', null, {
//     initialValue: []
// })
const handleNext = handleSubmit(async () => {
    try {
        const response_count = fields.value.length
        const formData = new FormData();
        formData.append('survey_warning_id', parseInt(route.params.subid));

        formData.append('suggestion', suggestion);

        formData.append('response_count', response_count);
        fields?.value?.forEach((e, i) => {
            formData.append(`responses[${i}][survey_warning_respond_details_id]`, e.value.survey_warning_respond_details_id ? e.value.survey_warning_respond_details_id : null);
            formData.append(`responses[${i}][survey_audit_police_details_id]`, e.value.survey_audit_police_details_id ? e.value.survey_audit_police_details_id : null);
            formData.append(`responses[${i}][respond_warning_note]`, e.value.respond_warning_note ? e.value.respond_warning_note : null);
            formData.append(`responses[${i}][respond_warning_img]`, e.value.respond_warning_img ? e.value.respond_warning_img.file : null);
        });
        console.log(formData)

        const res = await dataApi.updateVendorReply(formData);
        alertToast.value = {
            title: t('สำเร็จ'),
            color: 'info',
            isError: false,
            msg: res.data.message,
        }

        // setTimeout(() => {
        navigateTo(`/vendor/warning-list/${route.params.id}/${route.params.subid}/success`)
        // }, 1500);
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
    // router.push("/vendor/register-business/form4");

});


const files = ref([]);
function onFileSelectv(event) {
    event.files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            files.value.push({ src: e.target.result, file: file });  // Store both the image preview and the file
        };
        reader.readAsDataURL(file);  // Read the file as a data URL
    });
}
const onFileSelect = (event, index) => {
    const file = event.files[0]; // เลือกไฟล์แรกเท่านั้น
    if (!file || !fields.value[index]) return;

    // กำหนดค่าเป็นอ็อบเจ็กต์ที่มี `src`
    fields.value[index].value.respond_warning_img = {
        src: URL.createObjectURL(file),
        file: file
    };
};

const removeImage = (index) => {
    if (!fields.value[index]) return;
    fields.value[index].value.respond_warning_img = null;
};
// ฟังก์ชันส่งรีวิว
// const submitReview = async () => {
//     try {
//         const formData = new FormData();
//         files.value.forEach((image) => {
//             formData.append('files[]', image.file);
//         });
//         formData.forEach((value, key) => {
//             console.log(key, value);
//         });
//     } catch (error) {
//         console.error('Error uploading files:', error);
//     }
// };
</script>