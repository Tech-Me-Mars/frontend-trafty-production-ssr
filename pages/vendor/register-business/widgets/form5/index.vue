<script setup>
definePageMeta({
  middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t, locale, setLocale } = useI18n();
const isloadingAxi = useState("isloadingAxi");

import { useFormStore } from "@/store/businessStore.js";
const formStore = useFormStore(); // ใช้ Pinia Store
const route = useRoute();
const router = useRouter();
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

import { useConfirm } from 'primevue/useconfirm'
import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import * as dataApi from "../../api/data.js";




// Methods
const showNotification = (config) => {
  Object.assign(notification, {
    visible: true,
    ...config
  })
}


// Language configuration
const langs = [
  { code: 'th', label: 'ภาษาไทย', locale: 'th' },
  { code: 'en', label: 'English', locale: 'en' },
  { code: 'cn', label: '中文', locale: 'cn' }
];

const activeLangTab = ref(0);
onMounted(() => {
  setLocale('th')
})

watch(activeLangTab, (newIdx) => {
  setLocale(langs[newIdx].locale);
});


// เมื่อเปลี่ยน locale
watch(locale, (newLocale) => {
  const idx = langs.findIndex(l => l.locale === newLocale);
  if (idx !== -1) activeLangTab.value = idx;
});


const confirm1 = useConfirm();
// Function to remove an item
const removeItem = (index) => {
  confirm1.require({
    message: `${t('ยืนยันการลบ')}?`,
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: t('ยกเลิก'),
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: t('ตกลง')
    },
    accept: () => {
      business_list.value.splice(index, 1);
      // localStorage.setItem("business_list", JSON.stringify(business_list.value));
    },
    reject: () => {
      // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }
  });


};

const requireValue = t('กรุณาระบุข้อมูลให้ถูกต้อง');
const requireText = t('ระบุข้อมูล');
// *************  VARIDATOR
const validationSchema = toTypedSchema(
  zod.object({

  })
);
const { handleSubmit, handleReset, errors } = useForm({
  validationSchema,
});
const { value: business_list } = useField('business_list', null, {
  initialValue: formStore.business_list // Set the initial value from the store
});


// โหลดข้อมูลเมื่อหน้าโหลด
onMounted(() => {
  // loadBusinessList();
});
const confirm = useConfirm();

const handleNext = handleSubmit(async (values) => {
  // alert('dd')
  confirm.require({
    header: t('ยืนยัน?'),
    message: t('กดปุ่มยืนยันเพื่อลงทะเบียนร้านค้า') + '.',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: t('ยกเลิก'), severity: 'secondary', outlined: true },
    acceptProps: { label: t('ตกลง') },
    accept: () => {
      saveRegisterBusiness(); // << ตรงนี้จะวิ่งและ alert('aaa') จะขึ้น
    },
  });
});


const saveRegisterBusiness = async () => {
  // alert('aaa')
  try {

    const formData = new FormData();
    formData.append("service_type_id", (formStore.service_type_id));
    formData.append("business_type_id", formStore.business_type_id);
    formData.append("business_model_id", (formStore.business_model_id));
    formData.append("business_name_i18n", JSON.stringify(formStore.business_name_i18n));
    formData.append("business_person_i18n", JSON.stringify(formStore.business_person_i18n));
    formData.append("business_address_i18n", JSON.stringify(formStore.business_address_i18n));
    formData.append("business_province_id", formStore.business_province_id);
    formData.append("business_district_id", formStore.business_district_id);
    formData.append("business_subdistrict_id", formStore.business_subdistrict_id);

    formData.append("business_contact", JSON.stringify(formStore.business_contact_i18n));
    formData.append("business_email", formStore.business_email_i18n);
    formData.append("shop_name_i18n", JSON.stringify(formStore.shop_name_i18n));
    formData.append("shop_address_i18n", JSON.stringify(formStore.shop_address_i18n));
    formData.append("shop_province_id", formStore.shop_province_id);
    formData.append("shop_district_id", formStore.shop_district_id);
    formData.append("shop_subdistrict_id", formStore.shop_subdistrict_id);

    formData.append("shop_time", formStore.shop_time_i18n);
    formData.append("shop_phone", formStore.shop_phone_i18n);
    formData.append("shop_details_i18n", JSON.stringify(formStore.shop_details_i18n));
    formData.append("latitude", formStore.latitude_i18n);
    formData.append("longitude", formStore.longitude_i18n);
    const businessOpenDateI18n = { ...formStore.business_open_date };

    // วนลูปแต่ละ key แล้ว stringify array
    Object.keys(businessOpenDateI18n).forEach(lang => {
      businessOpenDateI18n[lang] = JSON.stringify(businessOpenDateI18n[lang]);
    });
    // จากนั้น append ลง FormData ได้เลย
    formData.append("business_open_date_i18n", JSON.stringify(businessOpenDateI18n));

    console.log(formStore.image_cover)
    // Append single image files
    if (formStore.image_cover) {
      // formData.append("image_cover", formStore.image_cover.file);
      formData.append("image_cover", formStore.image_cover.file);
    }
    if (formStore.image_profile) {
      formData.append("image_profile", formStore.image_profile.file);
    }
    // if (business_list.value) {
    formData.append("business_list", JSON.stringify(business_list.value) || []);
    // }
    if (formStore.business_social_media) {
      formData.append("business_social_media", JSON.stringify(formStore.business_social_media));
    }
    if (formStore.business_bank) {
      formData.append("business_bank", JSON.stringify(formStore.business_bank));
    }
    if (formStore.business_img) {
      formStore.business_img.forEach((item, idx) => {
        formData.append("business_img", item.file, item.file.name || `image_${idx}.jpg`);
      });
    }

    // business_documents
    if (formStore.listFiles) {
      formStore.listFiles.forEach((item, idx) => {
        formData.append("business_documents_img", item.file, item.file.name || `file_${idx}.pdf`);
      });
    }
    formData.append("Status", String(true)); // หรือ formStore.status ถ้ามี


    console.log('formData', formData);


    const res = await dataApi.saveBusinessRegister(formData);

    showNotification({
      state: res.data.dialog?.state,
      title: res.data.dialog?.title,
      detail: res.data.dialog?.detail,
      timeout: res.data.dialog?.timeout || 3000,
      redirectUrl: `/vendor/manage-business/home/${res.data.data.id}`,
      autoClose: true
    })
    // formStore.$reset();

    // alertToast.value = {
    //     title: t('สำเร็จ'),
    //     color: 'info',
    //     isError: false,
    //     msg: res.data.message,
    // };

    // รีเซ็ตค่าทั้งหมดใน Pinia หลังจากบันทึกสำเร็จ

    // router.replace({ query: { ...route.query, bussiness_id: res.data.data.id } });
    // formStore.goToPage(7);


    // นำทางไปยังหน้าสำเร็จ
    // router.push(`/vendor/register-business/finish?bussiness_id=${res.data.data.id}`);
  } catch (error) {
    showNotification({
      state: 'warning',
      title: 'คำเตือน',
      detail: 'บันทึกข้อมูลไม่สำเร็จ กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง',
      timeout: 0,
      redirectUrl: null,
      autoClose: false // ไม่นับถอยหลัง ต้องกดปุ่มปิด
    })
    // alertToast.value = {
    //     title: t('ล้มเหลว'),
    //     isError: true,
    //     color: "error",
    //     msg: error.response?.data?.message || "Error occurred",
    //     dataError: error,
    // };
    console.error(error);
  }
};
</script>
<template>
  <div class="bg-zinc-100 min-h-screen">
    <LayoutsBaseHeader :title="t('รายการธุรกิจในแหล่งท่องเที่ยว')">
      <template #left>
        <ButtonIconBack @click="formStore.prevPage()" />
      </template>
    </LayoutsBaseHeader>

    <div class="max-w-[430px] mx-auto">
      <!-- ใช้ Form ของก้อน 2 -->
      <Form @submit="handleNext">
        <van-tabs v-model:active="activeLangTab" type="line" sticky line-width="100" animated color="#202c54">
          <van-tab v-for="(lang, idx) in langs" :key="lang.code" :title="lang.label" :name="idx" class="pt-2">
            <!-- padding-bottom กันทับปุ่มล่าง แบบก้อน 1 -->
            <div class="p-3" :style="{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 90px)' }">
              <div class="bg-white rounded-sm border border-zinc-200 p-4 shadow-sm">
                <!-- Header -->
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <h2 class="font-bold text-lg text-zinc-900">
                      {{ t('ธุรกิจในแหล่งท่องเที่ยว') }}
                    </h2>
                    <p class="text-sm text-zinc-500">
                      {{ t('เพิ่มรายการธุรกิจในแหล่งท่องเที่ยว') }}
                    </p>
                  </div>
                </div>

                <!-- รายการ (ใช้ข้อมูลของก้อน 2 + สไตล์ก้อน 1) -->
                <div class="space-y-3">
                  <div v-for="(item, index) in business_list" :key="index"
                    class="flex items-start justify-between rounded-sm border border-zinc-200 p-3.5 hover:border-zinc-300 transition">
                    <div class="pr-3">
                      <p class="font-medium text-zinc-900 leading-tight">
                        {{ item.business_list_name_i18n?.[langs[activeLangTab].code] || item.business_list_name_i18n?.th
                        }}
                      </p>
                      <p class="text-sm text-zinc-700 mt-1">
                        ฿ {{ item.business_list_price }}
                      </p>
                    </div>

                    <!-- ปุ่มลบ “สี่เหลี่ยมแดง” แบบก้อน 1 แต่เรียก removeItem ของก้อน 2 -->
                    <button type="button"
                      class="inline-flex h-4 w-4 !items-center !justify-center rounded-[6px] bg-red-700 !text-white shadow-sm hover:bg-red-700 active:scale-95"
                      @click="removeItem(index)" aria-label="remove">
                      <i class="fa-solid fa-xmark text-[12px] leading-none"></i>
                    </button>
                  </div>

                  <!-- error จากก้อน 2 -->
                  <p class="error-text" v-if="errors?.business_list">
                    {{ t('กรุณาเลือกอย่างน้อย') }} 1 {{ t('รายการ') }}
                  </p>

                  <!-- ปุ่มเพิ่มแบบก้อน 1 แต่เรียก action ของก้อน 2 -->
                  <Button size="small" icon="pi pi-plus" :label="t('เพิ่มรายการ')" severity="secondary"
                    @click="formStore.goToPage(8)" />
                </div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
        <!-- <Button type="submit" :loading="isloadingAxi" :label="t('บันทึก')" severity="primary" class="w-full" rounded /> -->
        <!-- ปุ่มบันทึกชิดขอบล่าง แบบก้อน 1 แต่เป็น submit เข้าฟอร์มก้อน 2 -->
        <div class="fixed bottom-0 left-0 right-0 z-30"
          :style="{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }">
          <div class="max-w-[430px] mx-auto px-3 py-2">
            <Button type="submit" :loading="isloadingAxi" :label="t('บันทึก')" severity="primary" class="w-full"
              rounded />
          </div>
        </div>
      </Form>
    </div>

    <ConfirmDialog />
    <NotifyMessage v-model:show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
      :life="toast.life" />
    <NotificationPopup v-model:visible="notification.visible" :state="notification.state" :title="notification.title"
      :detail="notification.detail" :timeout="notification.timeout" :redirect-url="notification.redirectUrl"
      :auto-close="notification.autoClose" />
  </div>
</template>