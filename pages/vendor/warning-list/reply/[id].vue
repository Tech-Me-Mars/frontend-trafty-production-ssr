<template>
    <div class="min-h-screen bg-zinc-100">
        <LayoutsBaseHeader :title="t('ใบเตือน')" :showBack="true" />
        <section class="max-w-lg p-4 mx-auto">
            <Form @submit="handleNext">
                <section class="px-0">
                    <div class="rounded-xl border border-red-300 bg-red-50 mb-4 p-4">
                        <div class="flex items-center gap-2 mb-2">
                            <!-- ไอคอน -->
                            <span
                                class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-red-50 text-red-500">
                                <!-- chat-bubble icon -->
                                <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true">
                                    <path
                                        d="M2 12.75C2 8.47 5.8 5 10.5 5S19 8.47 19 12.75c0 4.28-3.8 7.75-8.5 7.75-1.04 0-2.05-.16-2.98-.47-.27-.09-.56-.04-.78.14L4.6 21.9a.75.75 0 0 1-1.22-.58l.15-2.22c.02-.28-.1-.55-.32-.73A7.72 7.72 0 0 1 2 12.75Z" />
                                </svg>
                            </span>
                            <h3 class="text-sm font-semibold text-gray-900">{{ t('ข้อเสนอแนะเพิ่มเติม') }}</h3>
                        </div>

                        <p class="text-gray-700 leading-relaxed">
                            {{ t('ขอให้ผู้ประกอบการพิจารณาปรับปรุงการให้บริการแก่นักท่องเที่ยวเพื่อยกระดับคุณภาพและความพึงพอใจของผู้มาใช้บริการ') }}
                        </p>
                    </div>



                    <div class="px-4">
                        <h1 class="text-lg font-semibold text-primary-main ">{{
                            t('หัวข้อที่ไม่ผ่านเกณฑ์มาตรฐานความปลอดภัย') }}</h1>
                        <p class="text-gray-500">{{ t('สามารถอัพโหลดรูปภาพได้เพีบง 1 รูปต่อข้อ') }}</p>

                    </div>

                    <div class="mb-2 card max-w-md px-4" v-for="(item, index) in fields" :key="index">
                        <div class="flex items-start space-x-3 mb-2">
                            <i class="fa-solid fa-circle-xmark text-red-600 mt-1"></i>
                            <div>
                            <span>{{ getI18n(item.value.questions_field_name_display,locale) }}</span>

                            <p ><span class="font-bold">{{ t('หมายเหตุ') }}</span> <span>{{ item?.value?.FieldValue }}</span></p>

                            </div>
                        </div>


                        <div class="">
                            <div class="flex items-start gap-2">

                                <InputText v-model="item.value.respond_warning_note" class="w-full  mb-2 flex-1"
                                    :placeholder="`${t('ข้อความ')}...`"
                                    :invalid="errors[`list_survey[${index}].respond_warning_note`] ? true : false" />
                                <FileUpload mode="basic" accept="image/*" @select="event => onFileSelect(event, index)"
                                    customUpload rounded auto severity="secondary"
                                    class="rounded-full p-button-outlined border-indigo-900"
                                    style="color: rgb(49 46 129);" outlined chooseLabel=""
                                    chooseIcon="fa-regular fa-images" />
                            </div>
                            <div class="flex flex-wrap gap-2 mb-3 relative" v-if="item.value.respond_warning_img?.src">
                                <div class="relative">
                                    <Image :src="item.value.respond_warning_img?.src" alt="Image" width="50"
                                        class="object-cover w-20 h-20 rounded-md shadow-md"
                                        :pt="{ image: { class: 'object-cover w-20 h-20 rounded-md shadow-md' } }"
                                        preview />
                                    <i class="fa-solid fa-xmark absolute top-0 right-0 p-0.5 bg-white rounded-full shadow-md cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-red-300"
                                        @click="removeImage(index, imageIndex)"></i>
                                </div>
                            </div>

                        </div>
                    </div>
                   
                    <div class="max-w-sm mx-auto">
                        <Button :loading="isloadingAxi" type="submit" :label="t('บันทึกการตอบกลับ')" class="w-full"
                            rounded></Button>
                    </div>
                </section>
            </Form>

        </section>
    </div>
    <NotifyMessage v-model:show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
        :life="toast.life" />
    <NotificationPopup v-model:visible="notification.visible" :state="notification.state" :title="notification.title"
        :detail="notification.detail" :timeout="notification.timeout" :redirect-url="notification.redirectUrl"
        :auto-close="notification.autoClose" />
</template>

<script setup>
// basic ที่ใช้ทุกหน้า
definePageMeta({
    middleware: ["auth"],
});
import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import * as dataApi from "./api/data.js";
import { useI18n } from 'vue-i18n';
const { t, locale, setLocale } = useI18n()
const isloadingAxi = useState('isloadingAxi')
const route = useRoute()
const router = useRouter()
const toast = ref({
    show: false,
    type: null,
    title: null,
    message: null,
    life: null,
})
const notification = reactive({
    visible: false,
    state: 'success',
    title: '',
    detail: '',
    timeout: 0,
    redirectUrl: null,
    autoClose: true
})
// Methods
const showNotification = (config) => {
    Object.assign(notification, {
        visible: true,
        ...config
    })
}
// จบการ basic ที่ใช้ทุกหน้า



const loadWarningById = async () => {
    try {
        const res = await dataApi.getSurveyWarningBySurveyAuditId(route.params.id);
        res.data.data?.forEach((e, i) => {
            push({

                survey_audit_id: e.survey_audit_id,
                respond_warning_note_detail_i18n: "",
                business_id: e.business_id,
                ShopNameI18n: e.ShopNameI18n,
                group_questions_id: e.group_questions_id,
                questions_field_name_display: e.questions_field_name_display,
                index: e.index,
                FieldValue: e?.items[0]?.FieldValue || "",
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


        // setTimeout(() => {
        navigateTo(`/vendor/warning-list/${route.params.id}/${route.params.subid}/success`)
        // }, 1500);
    } catch (error) {
        toast.value = {
            show: true,
            type: 'danger',
            title: t('ผิดพลาด'),
            message: error?.response?.data?.message || t('เกิดข้อผิดพลาด'),
            life: null
        }
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
</script>