<script setup>
definePageMeta({
    middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t, locale, setLocale } = useI18n();
const isloadingAxi = useState("isloadingAxi");
const router = useRouter();

import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import * as dataApi from "../../../api/data.js";


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


const requireValue = t('กรุณาระบุข้อมูลให้ถูกต้อง');
const requireText = t('ระบุข้อมูล');
// *************  VARIDATOR
const validationSchema = toTypedSchema(
    zod.object({
        business_list_name_i18n: zod.object({
            th: zod.string().min(1, t('กรุณากรอก')),
            en: zod.string().optional().or(zod.literal('')),
            cn: zod.string().optional().or(zod.literal('')),
        }),
        business_list_price: zod.string().nonempty(t('กรุณาระบุข้อมูลราคา')).default(''),

    })
);

const { handleSubmit, handleReset, errors } = useForm({
    validationSchema,
});


const { value: business_list_name_th } = useField('business_list_name_i18n.th', undefined, { initialValue: '' });
const { value: business_list_name_en } = useField('business_list_name_i18n.en', undefined, { initialValue: '' });
const { value: business_list_name_cn } = useField('business_list_name_i18n.cn', undefined, { initialValue: '' });


const { value: business_list_price } = useField('business_list_price')


const business_list_name_i18n = ref({
    get th() { return business_list_name_th.value },
    set th(v) { business_list_name_th.value = v },
    get en() { return business_list_name_en.value },
    set en(v) { business_list_name_en.value = v },
    get cn() { return business_list_name_cn.value },
    set cn(v) { business_list_name_cn.value = v }
});

import { useFormStore } from "@/store/businessStore.js";
const formStore = useFormStore(); // ใช้ Pinia Store
const handleNext = handleSubmit((values) => {
    formStore.setForm5(values);
    formStore.goToPage(6)
    // router.push("/vendor/register-business/form5");
});

const getFieldError = (fieldName, langCode = null) => {
    if (langCode) {
        return errors.value[`${fieldName}.${langCode}`] || null;
    }
    return errors.value[fieldName] || null;
};
</script>
<template>
    <div class="bg-zinc-100 min-h-screen">
        <LayoutsBaseHeader :title="t('เพิ่มรายการ')">
            <template #left>
                <ButtonIconBack @click="formStore.goToPage(6)" />
            </template>
        </LayoutsBaseHeader>

        <div
      class="max-w-[430px] mx-auto h-[calc(100vh-56px)] overflow-y-auto"
      :style="{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 88px)' }"
    >
            <!-- ใช้ Form ของ vee-validate -->
            <Form @submit="handleNext">
                <van-tabs v-model:active="activeLangTab" type="line" sticky animated color="#202c54"
                     :line-width="100">
                    <van-tab v-for="(lang, idx) in langs" :key="lang.code" :title="lang.label" :name="idx">
                        <div class="p-3">
                            <div class="bg-white rounded-sm border border-zinc-200 p-4 shadow-sm">
                            <h2 class="font-bold text-lg mb-3">
                                {{ t('ธุรกิจในแหล่งท่องเที่ยว') }}
                            </h2>

                            <!-- List of Businesses -->
                            <div class="space-y-4">
                                <div>
                                    <label class="label-input">{{ t('ชื่อรายการ') }}</label>
                                    <InputText v-model="business_list_name_i18n[lang.code]"
                                        :placeholder="t('ชื่อรายการ')" class="w-full custom-border"
                                        :invalid="!!getFieldError('business_list_name_i18n', lang.code)" />
                                    <p v-if="getFieldError('business_list_name_i18n', lang.code)" class="error-text">
                                        {{ getFieldError('business_list_name_i18n', lang.code) }}
                                    </p>
                                </div>

                                <div>
                                    <label class="label-input">{{ t('ราคา') }}</label>
                                    <InputText v-model="business_list_price" :placeholder="t('ราคา')"
                                        class="w-full custom-border" inputClass="custom-border"
                                        :invalid="!!errors?.business_list_price" />
                                    <p class="error-text" v-if="errors?.business_list_price">
                                        {{ errors?.business_list_price }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        </div>
                    </van-tab>
                </van-tabs>

                <!-- <Button :loading="isloadingAxi" :label="t('บันทึก')" severity="primary" type="submit" rounded
                    class="w-full" :pt="{ root: { class: '!border-primary-main' } }" /> -->
                            <!-- ✅ ปุ่มบันทึกชิดขอบล่างจอเสมอ -->
        <div class="fixed bottom-0 left-0 right-0 z-30"
            :style="{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }">
            <div class="max-w-[430px] mx-auto px-3 py-2">
                <Button :label="t('บันทึก')" severity="primary" class="w-full " rounded type="submit" />
            </div>
        </div>
            </Form>
        </div>

    </div>
</template>