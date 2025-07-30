<script setup>
import { ref, onMounted, computed } from "vue";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import * as dataApi from "../../api/data.js";
import { useFormStore } from "@/store/businessStore.js";
import { useI18n } from 'vue-i18n';

const { t, locale, setLocale } = useI18n();
onMounted(()=>{
  setLocale('th-TH')
})

const langs = [
  { code: "th", label: "ภาษาไทย" },
  { code: "en", label: "English" },
  { code: "cn", label: "中文" },
];

const activeLangTab = ref("th");
const resBusinessType = ref([]);
const formStore = useFormStore();

const schema = zod.object({
  selectedItem: zod.string().min(1, t('กรุณาเลือกหมวดหมู่')),
});
const { handleSubmit, errors } = useForm({ validationSchema: toTypedSchema(schema) });
const { value: selectedItem } = useField('selectedItem');

// โหลดและ parse ข้อมูล i18n
const loadBusinessType = async () => {
  try {
    const res = await dataApi.getBusinessType();
    resBusinessType.value = res.data.data.map(item => {
      let parsed_i18n = {};
      try {
        parsed_i18n = JSON.parse(item.business_type_name_i18n.th);
      } catch (e) {
        parsed_i18n = { th: "-", en: "-", cn: "-" };
      }
      return { ...item, business_type_name_i18n_parsed: parsed_i18n };
    });
  } catch (err) {
    console.error("โหลดข้อมูลล้มเหลว", err);
  }
};

const handleNext = handleSubmit(() => {
  // เก็บเฉพาะ selected id ตัวเดียว
  formStore.setForm1({ business_type_id: selectedItem.value });
  formStore.nextPage();
});

onMounted(loadBusinessType);

// สำหรับโชว์ชื่อที่เลือก (localize)
const selectedBusinessName = computed(() => {
  const found = resBusinessType.value.find(b => b.id === selectedItem.value);
  return found ? found.business_type_name_i18n_parsed?.[activeLangTab.value] : "";
});
</script>
<template>
  <div class="bg-zinc-100 min-h-screen">
    <LayoutsBaseHeader :title="t('ประเภทธุรกิจในแหล่งท่องเที่ยว')">
      <template #left>
        <ButtonIconBack @click="formStore.prevPage()" />
      </template>
    </LayoutsBaseHeader>
    <Form @submit="handleNext">
      <van-tabs v-model:active="activeLangTab" type="line" sticky animated color="#202c54">
        <van-tab v-for="lang in langs" :title="lang.label" :name="lang.code" :key="lang.code" class="p-2">
          <h2 class="text-center font-bold text-xl mb-8 pt-2">
            {{ lang.code === 'th' ? 'เลือกประเภทการท่องเที่ยว' : (lang.code === 'en' ? 'Select Tourist Attraction Type' : '选择旅游景点类型') }}
          </h2>
          <div class="grid grid-cols-2 gap-3 my-6">
            <div
              v-for="item in resBusinessType"
              :key="item.id"
              class="flex flex-col items-center justify-center border-2 rounded-sm p-4 cursor-pointer bg-white"
              :class="{
                '!border-indigo-900 bg-blue-50': selectedItem === item.id,
                'border-gray-300': selectedItem !== item.id
              }"
              @click="selectedItem = item.id"
            >
              <i :class="item.icon" class="text-2xl mb-2 text-primary-main"></i>
              <span class="text-sm text-center">
                {{ item.business_type_name_i18n?.[lang.code] || '-' }}
              </span>
            </div>
          </div>
        </van-tab>
      </van-tabs>

      <div class="mx-auto w-full max-w-md pb-10">
        <div v-if="selectedItem" class="text-center text-primary-dark text-lg mt-2">
          {{ t('คุณเลือก') }}: <span class="font-bold">{{ selectedBusinessName }}</span>
        </div>
        <p v-if="errors.selectedItem" class="text-red-500 text-center mt-2 text-sm">
          {{ errors.selectedItem }}
        </p>
        <div class="max-w-sm w-full mx-auto">
        <Button rounded :label="t('ถัดไป')" type="submit" class="w-full mt-6" />
          
        </div>
      </div>
    </Form>
  </div>
</template>
