<template>
  <div class="min-h-screen bg-zinc-100">
    <LayoutsBaseHeader :title="t('ตอบกลับใบเตือน')" :showBack="true" />

    <section class="max-w-[430px] mx-auto">
      <!-- กล่องข้อเสนอแนะ (กรอบแดง + พื้นอ่อน) -->
      <div class="p-3 bg-white">
        <div class="rounded-sm border border-[#F04438] bg-[#FFF6F6] p-4 mb-5">
          <div class="flex items-start gap-2 mb-1">
            <i class="fa-solid fa-comment-dots text-[#F04438] text-base mt-0.5"></i>
            <span class="font-semibold text-gray-800 text-base">
              {{ t('ข้อเสนอแนะเพิ่มเติม') }}
            </span>
          </div>
          <p class="text-sm gray-700 leading-6">
            {{
              t('ขอให้ผู้ประกอบการพิจารณาปรับปรุงการให้บริการแก่นักท่องเที่ยวเพื่อยกระดับคุณภาพและความพึงพอใจของผู้มาใช้บริการ')
            }}
          </p>
        </div>
      </div>

      <div class=" p-3">
        <!-- หัวข้อใหญ่ -->
        <div class="px-1 mb-3">
          <h1 class="text-[16px] font-semibold text-[#202c54]">
            {{ t('หัวข้อที่ไม่ผ่านเกณฑ์มาตรฐานความปลอดภัย') }}
          </h1>
          <p class="text-[12px] text-zinc-500">
            {{ t('สามารถอัปโหลดรูปภาพได้เพียง 1 รูปต่อข้อ') }}
          </p>
        </div>

        <!-- SKELETON LOADING -->
        <div v-if="isLoading" class="p-1">
          <div v-for="n in 3" :key="'sk-'+n" class="bg-white rounded-sm border border-zinc-200 shadow-sm p-4 mb-3 animate-pulse">
            <div class="flex items-start gap-3">
              <div class="w-5 h-5 rounded-full bg-zinc-200 mt-0.5"></div>
              <div class="flex-1">
                <div class="h-4 bg-zinc-200 rounded w-[90%] mb-2"></div>
                <div class="h-3 bg-zinc-200 rounded w-[70%]"></div>
              </div>
            </div>
            <div class="flex gap-3 mt-3">
              <div class="h-9 bg-zinc-200 rounded w-full"></div>
              <div class="h-9 bg-zinc-200 rounded w-24"></div>
            </div>
            <div class="mt-3 flex gap-2">
              <div class="w-20 h-20 bg-zinc-200 rounded-sm"></div>
            </div>
          </div>
          <div class="mt-4">
            <div class="h-10 bg-zinc-200 rounded w-full"></div>
          </div>
        </div>

        <!-- FORM CONTENT -->
        <Form v-else @submit="handleNext">
          <!-- Empty state -->
          <SharedNoData v-if="fields.length === 0" />

          <!-- รายการการ์ด -->
          <div
            v-else
            v-for="(item, index) in fields"
            :key="index"
            class="bg-white rounded-sm border border-zinc-200 shadow-sm p-4 mb-3"
          >
            <!-- หัวการ์ด -->
            <div class="flex items-start gap-3">
              <i class="fa-solid fa-circle-xmark text-red-600 text-lg mt-0.5"></i>
              <div class="flex-1">
                <div class="text-[14px] font-medium text-zinc-800 leading-6">
                  {{ getI18n(item.value.questions_field_name_display, locale) }}
                </div>
                <div class="text-[13px] text-zinc-600 mt-1">
                  <span class="font-semibold">{{ t('หมายเหตุ') }}:</span>
                  <span>
                    {{ getI18n(item?.value?.survey_audit_detail_note, locale) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- ปุ่มแอคชัน -->
            <div class="flex gap-3 mt-2">
              <InputText
                v-model="item.value.respond_warning_note_detail"
                class="w-full"
                :placeholder="t('ข้อความโน๊ต')"
                :invalid="!!errors[`list_survey[${index}].respond_warning_note_detail`]"
              />
              <!-- คง logic เดิม: ใช้ FileUpload + onFileSelect -->
              <FileUpload
                mode="basic"
                accept="image/*"
                @select="event => onFileSelect(event, index)"
                customUpload
                rounded
                auto
                severity="secondary"
                :chooseLabel="t('เลือก')"
                chooseIcon="fa-regular fa-images"
                class="rounded-md p-button-outlined border-primary-main text-primary-main"
                :pt="{ root: { class: '!border-primary-main' } }"
              />
            </div>

            <!-- พรีวิวรูป -->
            <div v-if="item.value.respond_warning_detail_img?.src" class="mt-3 flex flex-wrap gap-2">
              <div class="relative">
                <Image
                  :src="item.value.respond_warning_detail_img.src"
                  alt="preview"
                  class="object-cover w-20 h-20 rounded-sm shadow"
                  preview
                />
                <button
                  type="button"
                  class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center hover:bg-red-100"
                  @click="removeImage(index)"
                >
                  <i class="fa-solid fa-xmark text-[12px]"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- ปุ่มบันทึก -->
          <div class="pt-2">
            <Button :loading="isloadingAxi" type="submit" :label="t('บันทึกการตอบกลับ')" class="w-full" rounded />
          </div>
        </Form>
      </div>
    </section>
        <NotifyMessage v-model:show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
      :life="toast.life" />
    <NotificationPopup v-model:visible="notification.visible" :state="notification.state" :title="notification.title"
      :detail="notification.detail" :timeout="notification.timeout" :redirect-url="notification.redirectUrl"
      :auto-close="notification.autoClose" @close="onNotificationClose" />

  </div>
</template>

<script setup>
definePageMeta({ middleware: ["auth"] });

import { useFieldArray, useForm, Form } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import * as dataApi from "./api/data.js";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const route = useRoute();
const isloadingAxi = useState("isloadingAxi");
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

// --------- VALIDATOR (คงเดิม) ---------
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
const { handleSubmit, errors } = useForm({
  validationSchema,
  validateOnMount: false,
  validateOnBlur: false,
  validateOnChange: false,
  validateOnInput: false,
  validateOnModelUpdate: false,
});
const { push, fields } = useFieldArray("list_survey");

// --------- LOADING STATE ใหม่ (เพิ่ม) ---------
const isLoading = ref(true);

// --------- LOAD DATA (คง logic เดิม) ---------
const loadWarningById = async () => {
  try {
    isLoading.value = true;
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
  } finally {
    isLoading.value = false;
  }
};
onMounted(loadWarningById);

// --------- FILE SELECT (คงเดิม) ---------
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

// --------- SUBMIT (คงเดิม) ---------
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

    await dataApi.creatSurveyWarningRespond(formData);
    navigateTo(`/vendor/warning-list/reply/success/?BusinessId=${route.query.BusinessId}`);
  } catch (error) {
        toast.value = {
      show: true,
      type: 'danger',
      title: t('ผิดพลาด'),
      message: error?.response?.data?.message || t('เกิดข้อผิดพลาด'),
      life: null
    }
    console.error(error);
  }
});
</script>
