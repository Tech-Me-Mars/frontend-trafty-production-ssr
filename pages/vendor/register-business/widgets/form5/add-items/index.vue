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
        business_list_price: zod.string().nonempty(t('กรุณาระบุข้อมูลราคา')),

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
    <div class="bg-zinc-100 min-h-screen">
        <LayoutsBaseHeader :title="t('เพิ่มรายการ')">
            <template #left>
                <ButtonIconBack @click="formStore.goToPage(6)" />
            </template>
        </LayoutsBaseHeader>

        <div class="p-4 ">
            <Form @submit="handleNext">
                <van-tabs v-model:active="activeLangTab" type="line" sticky animated color="#202c54"
                    @change="moveMapToTab">
                    <van-tab v-for="(lang, idx) in langs" :key="lang.code" :title="lang.label" :name="idx">
                        <div class="card pt-5 mb-10">
                            <h2 class="font-bold text-lg mb-3 ">{{ t('ธุรกิจในแหล่งท่องเที่ยว') }}</h2>

                            <!-- List of Businesses -->
                            <div class="space-y-4">
                                <div>
                                    <label class="label-input">{{ t('ชื่อรายการ') }}</label>
                                    <InputText v-model="business_list_name_i18n[lang.code]" :placeholder="t('ชื่อรายการ')"
                                        class="w-full custom-border" :invalid="getFieldError('business_list_name_i18n')" />
                                    <p v-if="getFieldError('business_list_name_i18n', lang.code)" class="error-text">
                                        {{ getFieldError('business_list_name_i18n', lang.code) }}
                                    </p>

                                </div>
                                <div>
                                    <label class="label-input">{{ t('ราคา') }}</label>
                                    <InputText v-model="business_list_price" :placeholder="t('ราคา')"
                                       class="w-full custom-border" inputClass="custom-border" :invalid="errors?.business_list_price ? true : false"  />
                                    <p class="error-text" v-if="errors?.business_list_price">{{
                                        errors?.business_list_price }}
                                    </p>

                                </div>

                            </div>
                        </div>
                    </van-tab>
                </van-tabs>
           
                <Button :loading="isloadingAxi" :label="t('บันทึก')" severity="primary" type="submit" rounded
                    class="w-full" :pt="{
                        root: {
                            class: '!border-primary-main'
                        },
                    }" />

            </Form>
  
        </div>

    </div>
</template>