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
  setLocale('th')
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
const requireValue = t('กรุณาเลือกหน่วยงานแหล่งท่องเที่ยว');
const validationSchema = toTypedSchema(
    zod.object({
        selectedId: zod.string().nonempty(requireValue).default(""),
    })
);
const { handleSubmit, handleReset, errors } = useForm({ validationSchema });
const { value: selectedId } = useField('selectedId', null, { initialValue: '' });
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
    <div class="bg-bg-main min-h-screen">
        <LayoutsBaseHeader :title="t('หน่วยงานแหล่งท่องเที่ยว')">
            <template #left>
                <ButtonIconBack @click="formStore.prevPage()" />
            </template>
        </LayoutsBaseHeader>
    <section class="max-w-[430px] mx-auto">

        <Form @submit="handleNext">
            <van-tabs v-model:active="activeLangTab" type="line" sticky animated color="#202c54" :line-width="100" class="">
                <van-tab v-for="lang in langs" :title="lang.label" :name="lang.code" :key="lang.code" class="p-2">
                    <h2
            class="text-center text-[20px] font-extrabold text-[#202c54] mt-4 ">
            {{ lang.code === 'th'
              ? 'เลือกหน่วยงานของคุณ'
              : lang.code === 'en'
                ? 'Select Your Organization'
                : '选择您的单位'
            }}
          </h2>
          <div class="flex flex-col gap-3 p-4 mt-2 mb-8">
            
  <label
    v-for="item in resBusinessModel"
    :key="item.id"
    class="bg-white border rounded-md px-4 py-3 flex items-center gap-3 cursor-pointer transition
           shadow-[0_1px_0_rgba(0,0,0,0.02)]"
    :class="selectedId === item.id
      ? 'border-[#243a8b] bg-[#eef3ff]'
      : 'border-gray-300 hover:border-[#202c54]/50'"
    :for="`${lang.code}_${item.id}`"
  >
    <!-- radio -->
    <input
      type="radio"
      class="w-4 h-4 accent-[#243a8b]"
      :value="item.id"
      v-model="selectedId"
      :name="`group-${lang.code}`"
      :id="`${lang.code}_${item.id}`"
    />
    <!-- ชื่อรายการ -->
    <span class="text-[15px] text-[#1f2937]">
      {{ item.business_model_name_i18n?.[lang.code] || item.business_model_name_i18n?.th }}
    </span>
  </label>
</div>
                    <p v-if="errors.selectedId" class="text-red-500 text-sm text-center mb-4">
                        {{ errors.selectedId }}
                    </p>
                </van-tab>
            </van-tabs>
            <div class="max-w-sm w-full mx-auto">
        <Button rounded :label="t('ถัดไป')" class="w-full h-12"  type="submit" />
      </div>
        </Form>
        </section>
              <!-- ปุ่มถัดไป -->

    </div>
</template>
