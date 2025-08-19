<template>
    <div class="min-h-screen bg-zinc-100">
        <LayoutsBaseHeader :title="t('ใบเตือน')" :showBack="true" />

        <section class="max-w-lg p-4 mx-auto">
            <Form @submit="handleNext">
                <div class="px-4">
                    <h1 class="text-lg font-semibold text-primary-main">
                        {{ t('หัวข้อที่ไม่ผ่านเกณฑ์มาตรฐานความปลอดภัย') }}
                    </h1>
                    <p class="text-gray-500">{{ t('สามารถอัพโหลดรูปภาพได้เพียง 1 รูปต่อข้อ') }}</p>
                </div>

                <!-- Dynamic fields -->
                <div v-if="fields.length > 0" class="mb-2 card max-w-md px-4" v-for="(item, index) in fields" :key="index">
                    <div class="flex items-start space-x-3 mb-2">
                        <i class="fa-solid fa-circle-xmark text-red-600 mt-1"></i>
                        <div>
                            <span>{{ getI18n(item.value.questions_field_name_display, locale) }}</span>
                            <p> <span class="font-bold">{{ t('หมายเหตุ') }}:</span><span>{{
                                getI18n(item?.value?.survey_audit_detail_note,locale) }}</span></p>
                        </div>

                    </div>

                    <div>
                        <div class="flex items-start gap-2">
                            <InputText v-model="item.value.respond_warning_note_detail" class="w-full mb-2 flex-1"
                                :placeholder="`${t('ข้อความโน๊ต')}...`" :invalid="errors[`list_survey[${index}].respond_warning_note_detail`] ? true : false
                                    " />

                            <FileUpload mode="basic" accept="image/*" @select="event => onFileSelect(event, index)"
                                customUpload rounded auto severity="secondary"
                                class="rounded-full p-button-outlined border-indigo-900" style="color: rgb(49 46 129);"
                                outlined chooseLabel="" chooseIcon="fa-regular fa-images" />
                        </div>

                        <div v-if="item.value.respond_warning_detail_img?.src"
                            class="flex flex-wrap gap-2 mb-3 relative">
                            <div class="relative">
                                <Image :src="item.value.respond_warning_detail_img?.src" alt="Image" width="50"
                                    class="object-cover w-20 h-20 rounded-md shadow-md" preview />
                                <i class="fa-solid fa-xmark absolute top-0 right-0 p-0.5 bg-white rounded-full shadow-md cursor-pointer hover:scale-110 hover:bg-red-300"
                                    @click="removeImage(index)"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <SharedNoData v-else />

                <!-- Submit button -->
                <div class="max-w-sm mx-auto">
                    <Button :loading="isloadingAxi" type="submit" :label="t('บันทึกการตอบกลับ')" class="w-full"
                        rounded />
                </div>
            </Form>
        </section>
    </div>
</template>

<script setup>
definePageMeta({ middleware: ["auth"] });
import { useFieldArray, useForm, Form } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import * as dataApi from "./api/data.js";
import { useI18n } from "vue-i18n";
import { SharedNoData } from "#components";

const { t, locale } = useI18n();
const route = useRoute();
const isloadingAxi = useState("isloadingAxi");

// --------- VALIDATOR ---------
const validationSchema = toTypedSchema(
    zod.object({
        list_survey: zod.array(
            zod.object({
                respond_warning_note_detail: zod
                    .string()
                    .nonempty(t("กรุณาระบุข้อมูลให้ถูกต้อง"))
                    .default(""),
            })
        ),
    })
);

const { handleSubmit, errors } = useForm({ validationSchema });
const { push, fields } = useFieldArray("list_survey");

// --------- LOAD DATA ---------
const loadWarningById = async () => {
    try {
        const res = await dataApi.getSurveyWarningBySurveyAuditId(route.params.id);

        res.data.data?.forEach((e) => {
            push({
                survey_audit_detail_note: e?.survey_audit_detail_note,
                survey_warning_respond_details_id: e?.id || "",
                survey_audit_details_id: e?.survey_audit_detail_id,
                respond_warning_note_detail: "",
                respond_warning_detail_img: null,
                questions_field_name_display: e.questions_field_name_display,
            });
        });
    } catch (error) {
        console.error(error);
    }
};
onMounted(loadWarningById);

// --------- FILE SELECT ---------
const onFileSelect = (event, index) => {
    const file = event.files?.[0];
    if (!file || !fields.value[index]) return;

    fields.value[index].value.respond_warning_detail_img = {
        src: URL.createObjectURL(file),
        file,
    };
};

const removeImage = (index) => {
    if (!fields.value[index]) return;
    fields.value[index].value.respond_warning_detail_img = null;
};

// --------- SUBMIT ---------
const handleNext = handleSubmit(async () => {
    try {
        const formData = new FormData();

        formData.append("survey_warning_id", String(route.params.id));
        formData.append("response_count", String(fields.value.length));

        fields.value.forEach((e, i) => {
            const v = e.value;

            formData.append(
                `responses[${i}][survey_warning_respond_details_id]`,
                v.survey_warning_respond_details_id || ""
            );
            formData.append(
                `responses[${i}][survey_audit_details_id]`,
                v.survey_audit_details_id || ""
            );
            formData.append(
                `responses[${i}][respond_warning_note_detail]`,
                v.respond_warning_note_detail || ""
            );

            if (v.respond_warning_detail_img?.file) {
                const file = v.respond_warning_detail_img.file;
                formData.append(
                    `responses[${i}][respond_warning_detail_img]`,
                    file,
                    file.name
                );
            }
        });

        // DEBUG: ตรวจสอบ payload
        // for (const [k, v] of formData.entries()) console.log(k, v);

        await dataApi.creatSurveyWarningRespond(formData);

        navigateTo(`/vendor/warning-list/reply/success/?BusinessId=${route.query.BusinessId}`);
    } catch (error) {
        console.error(error);
    }
});
</script>