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
  setLocale('th')
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
  selectedItem: zod.string().nonempty(t('กรุณาเลือกหมวดหมู่')),
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
  formStore.setForm1(selectedItem.value);
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
    <main class="max-w-[430px] mx-auto">

    <Form @submit="handleNext">
      <van-tabs v-model:active="activeLangTab" type="line" sticky animated color="#202c54">
        <van-tab v-for="lang in langs" :title="lang.label" :name="lang.code" :key="lang.code" class="p-2">
          <section class="px-3 pb-8 pt-3 ">

          <h2 class="text-center text-[19px] sm:text-[20px] font-extrabold text-[#202c54] tracking-tight my-3">
            {{ lang.code === 'th' ? 'เลือกประเภทการท่องเที่ยว' : (lang.code === 'en' ? 'Select Tourist Attraction Type' : '选择旅游景点类型') }}
          </h2>
          <div class="grid grid-cols-2 gap-3 mt-3.5">
            <div
              v-for="item in resBusinessType"
              :key="item.id"
              class="flex flex-col items-center justify-center border-2 rounded-sm p-4 cursor-pointer bg-white"

              :class="selectedItem === item.id ? 'tile--active' : 'tile--normal'"
              @click="selectedItem = item.id"
            >
            <div class="icon-wrap">
                    <!-- fixed-width + normalize line-height -->
                    <i :class="[item.icon, '']"></i>
                  </div>

              <!-- <i :class="item.icon" class="text-2xl mb-2 text-primary-main"></i> -->
              <span class="name clamp-2">
                {{ item.business_type_name_i18n?.[lang.code] || '-' }}
              </span>
            </div>
          </div>
          </section>
        </van-tab>
      </van-tabs>

      <div class="mx-auto w-full max-w-md pb-10">
        <p v-if="errors.selectedItem" class="text-red-500 text-center mt-2 text-sm">
          {{ t('กรุณาเลือกหมวดหมู่') }}
        </p>
        <div class="max-w-sm w-full mx-auto">
        <Button rounded :label="t('ถัดไป')" type="submit" class="w-full mt-6" />
          
        </div>
      </div>
    </Form>
    </main>
  </div>
</template>


<style scoped>
.tile {
  @apply flex flex-col items-center justify-start bg-white rounded-sm border px-3 py-3 text-center shadow-sm transition;
}

.tile--normal {
  @apply border-zinc-200 hover:border-[#202c54]/50;
}

.tile--active {
  @apply border-[#243a8b] bg-[#eef3ff];
}

/* กล่องไอคอนขนาดคงที่ */
.icon-wrap {
  @apply w-10 h-10 rounded-md bg-[#eef2ff] flex items-center justify-center mb-2;
}

/* ทำให้ไอคอนอยู่ระดับเดียวกันทุกใบ */
.icon {
  @apply text-[18px] text-[#202c54];
  line-height: 1;
  display: block;
}

/* ชื่อ: สูงเท่ากับ 2 บรรทัดเสมอ (text-sm/leading-5 => 20px x 2 = 40px) */
.name {
  @apply text-[#202c54] text-sm leading-5 min-h-10;
}

/* ตัดข้อความ 2 บรรทัด */
.clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
