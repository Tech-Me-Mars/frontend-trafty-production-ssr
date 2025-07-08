<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useField, useForm, Form } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useFormStore } from "@/store/businessStore.js";
import * as dataApi from "../../api/data.js";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const formStore = useFormStore();
const resBusinessType = ref([]);
const activeLangTab = ref("th");

const loadBusinessType = async () => {
  try {
    const res = await dataApi.getBusinessType();
    resBusinessType.value = res.data.data;
  } catch (err) {
    console.error("โหลดข้อมูลล้มเหลว", err);
  }
};

// ✅ schema validation
const schema = zod.object({
  selectedItem_th: zod.number({ required_error: t('กรุณาเลือกหมวดหมู่ (TH)') }),
  selectedItem_en: zod.number({ required_error: t('กรุณาเลือกหมวดหมู่ (EN)') }),
  selectedItem_cn: zod.number({ required_error: t('กรุณาเลือกหมวดหมู่ (CN)') }),
});

const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(schema),
});

const { value: selectedItem_th } = useField('selectedItem_th');
const { value: selectedItem_en } = useField('selectedItem_en');
const { value: selectedItem_cn } = useField('selectedItem_cn');

const handleNext = handleSubmit(() => {
  formStore.setForm1({
    th: selectedItem_th.value,
    en: selectedItem_en.value,
    cn: selectedItem_cn.value,
  });
  formStore.nextPage();
});

onMounted(() => loadBusinessType());
</script>

<style></style>
<template>
  <div class="bg-zinc-100 min-h-screen">
    <LayoutsBaseHeader :title="t('ประเภทธุรกิจในแหล่งท่องเที่ยว')">
      <template #left>
        <ButtonIconBack @click="formStore.prevPage()" />
      </template>
    </LayoutsBaseHeader>

    <div class="">
      <Form @submit="handleNext">
        <van-tabs v-model:active="activeLangTab" type="line" sticky animated color="#202c54">

          <!-- 🔵 ภาษาไทย -->
          <van-tab title="ภาษาไทย" name="th" class="p-2">

            <h2 class="text-center font-bold text-xl mb-8 pt-2">เลือกประเภทการท่องเที่ยว</h2>

            <div class="grid grid-cols-2 gap-3 my-6">
              <div v-for="(item, index) in resBusinessType" :key="index"
                class="flex flex-col items-center justify-center border-2 rounded-sm p-4 cursor-pointer"
                :class="selectedItem_th === item.id ? '!border-indigo-900 bg-blue-50' : 'border-gray-300'"
                @click="selectedItem_th = item.id">
                <i :class="item.icon" class="text-2xl mb-2 text-primary-main"></i>
                <span class="text-sm text-center">{{ item.business_type_name }}</span>
              </div>
            </div>
            <p v-if="errors.selectedItem_th" class="text-red-500 text-center mt-2 text-sm">
              {{ errors.selectedItem_th }}
            </p>
          </van-tab>

          <!-- 🔵 English -->
          <van-tab title="English" name="en" class="p-2">
            <h2 class="text-center font-bold text-xl mb-8 pt-2">Select Tourist Attraction Type</h2>

            <div class="grid grid-cols-2 gap-3 my-6">
              <div v-for="(item, index) in resBusinessType" :key="index"
                class="flex flex-col items-center justify-center border-2 rounded-sm p-4 cursor-pointer"
                :class="selectedItem_en === item.id ? '!border-indigo-900 bg-blue-50' : 'border-gray-300'"
                @click="selectedItem_en = item.id">
                <i :class="item.icon" class="text-2xl mb-2 text-primary-main"></i>
                <span class="text-sm text-center">{{ item.business_type_name }}</span>
              </div>
            </div>
            <p v-if="errors.selectedItem_en" class="text-red-500 text-center mt-2 text-sm">
              {{ errors.selectedItem_en }}
            </p>
          </van-tab>

          <!-- 🔵 中文 -->
          <van-tab title="中文" name="cn" class="p-2">
            <h2 class="text-center font-bold text-xl mb-8 pt-2">选择旅游景点类型</h2>

            <div class="grid grid-cols-2 gap-3 my-6">
              <div v-for="(item, index) in resBusinessType" :key="index"
                class="flex flex-col items-center justify-center border-2 rounded-sm p-4 cursor-pointer"
                :class="selectedItem_cn === item.id ? '!border-indigo-900 bg-blue-50' : 'border-gray-300'"
                @click="selectedItem_cn = item.id">
                <i :class="item.icon" class="text-2xl mb-2 text-primary-main"></i>
                <span class="text-sm text-center">{{ item.business_type_name }}</span>
              </div>
            </div>
            <p v-if="errors.selectedItem_cn" class="text-red-500 text-center mt-2 text-sm">
              {{ errors.selectedItem_cn }}
            </p>
          </van-tab>
        </van-tabs>

        <!-- ✅ ปุ่มถัดไป -->
        <div class="mx-auto w-full max-w-md pb-10">

          <Button rounded :label="t('ถัดไป')" type="submit" class="w-full mt-6" @click="formStore.nextPage();" />

        </div>
      </Form>
    </div>
  </div>
</template>
