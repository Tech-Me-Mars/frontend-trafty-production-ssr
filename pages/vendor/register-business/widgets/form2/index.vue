<script setup>
definePageMeta({ middleware: ["auth"] });

import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useFormStore } from "@/store/businessStore.js";
import { useI18n } from 'vue-i18n';
import * as dataApi from "../../api/data.js";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

const { t, locale, setLocale } = useI18n();
onMounted(()=>{
  setLocale('th-TH')
})

const isloadingAxi = useState("isloadingAxi");
const router = useRouter();
const formStore = useFormStore();

const langs = [
    { code: "th", label: "ภาษาไทย" },
    { code: "en", label: "English" },
    { code: "cn", label: "中文" }
];

const activeLangTab = ref("th");

const resBusinessModel = ref([]);
// const selectedId = ref(""); // id ที่เลือก

// ดึงข้อมูล model
const loadBusinessModel = async () => {
    try {
        isloadingAxi.value = true;
        const res = await dataApi.getBusinessModel();
        resBusinessModel.value = res.data.data;
    } catch (error) {
        console.error(error);
    } finally {
        isloadingAxi.value = false;
    }
};
onMounted(loadBusinessModel);

// VeeValidate
const requireValue = t('เลือกรูปแบบธุรกิจในแหล่งท่องเที่ยว');
const validationSchema = toTypedSchema(
    zod.object({
        selectedId: zod.string().min(1, requireValue),
    })
);
const { handleSubmit, handleReset, errors } = useForm({ validationSchema });
const { value: selectedId } = useField('selectedId', null, { initialValue: null });
// sync selectedId <-> selectedIdField
// watch(selectedId, v => selectedIdField.value = v);
// watch(selectedIdField, v => selectedId.value = v);

// Submit
const handleNext = handleSubmit(() => {
    formStore.setForm2(selectedId.value);  // << เก็บ id เดียว
    formStore.nextPage();
});


</script>

<template>
    <div class="bg-zinc-100 min-h-screen">
        <LayoutsBaseHeader :title="t('หน่วยงานแหล่งท่องเที่ยว')">
            <template #left>
                <ButtonIconBack @click="formStore.prevPage()" />
            </template>
        </LayoutsBaseHeader>
        <Form @submit="handleNext">
            <van-tabs v-model:active="activeLangTab" type="line" sticky animated color="#202c54" class="">
                <van-tab v-for="lang in langs" :title="lang.label" :name="lang.code" :key="lang.code" class="p-2">
                    <h2 class="text-center font-bold text-xl mb-8 pt-2">
                        {{ lang.code === 'th'
                            ? 'เลือกหน่วยงานของคุณ'
                            : lang.code === 'en'
                                ? 'Select Your Organization'
                                : '选择您的单位'
                        }}
                    </h2>
                    <div class="flex flex-col gap-2 p-4 mb-[3rem]">
                        <div v-for="item in resBusinessModel" :key="item.id"
                            class="border border-blue-900 card rounded-md p-4 flex items-center space-x-3 cursor-pointer"
                            :class="{
                                '!border-indigo-900 bg-blue-50': selectedId === item.id,
                                'border-gray-300': selectedId !== item.id
                            }" @click="selectedId = item.id">
                            <RadioButton v-model="selectedId" :inputId="`${lang.code}_${item.id}`" :value="item.id"
                                :name="`group-${lang.code}`" />
                            <label :for="`${lang.code}_${item.id}`" class="text-sm font-medium">
                                {{ item.business_model_name_i18n?.[lang.code] }}
                            </label>
                        </div>
                    </div>
                    <p v-if="errors.selectedId" class="text-red-500 text-sm text-center mb-4">
                        {{ errors.selectedId }}
                    </p>
                </van-tab>
            </van-tabs>
            <div class="mx-auto w-full max-w-sm pb-10">
                <Button :loading="isloadingAxi" :label="t('ถัดไป')" severity="primary" type="submit" rounded
                    class="w-full mt-4" :pt="{ root: { class: '!border-primary-main' } }" />
            </div>
        </Form>
    </div>
</template>
