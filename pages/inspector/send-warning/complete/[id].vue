<template>
  <div class="min-h-screen bg-zinc-50 pt-[15rem]">

    <!-- Progress Circle Section -->
    <div class="flex justify-center items-center mb-8">
      <van-circle v-model:current-rate="currentRate" :rate="rate" :speed="100" :stroke-width="50" color="#b91c1c"
        layer-color="#ebedf0" size="140px" :text="text" />
    </div>

    <!-- Text Section -->
    <div class="text-center px-4 mb-20">
      <p class="text-xl font-bold text-gray-900">{{ t('ไม่ผ่านเกณฑ์') }}</p>
      <p class="text-sm text-gray-600 mt-2 text-primary-main">
        <!-- {{ t('ขอบคุณสำหรับข้อมูลการประเมิน ธุรกิจและกิจการของท่านยังไม่ผ่านเกณฑ์มาตรฐานตามที่กำหนดในครั้งนี้ กรุณาติดต่อสถานที่เพื่อทำการแก้ไขและประเมินใหม่ในภายหลัง') }} -->
          {{ t('ไม่ผ่านเกณฑ์มาตรฐานความปลอดภัย กรุณาออกใบเตือน') }}
      </p>
    </div>

    <!-- Buttons Section -->
    <div class="max-w-[20rem] mx-auto">
      <Button :loading="isloadingAxi" @click="navigateTo(`/inspector/send-warning/waring-send/${route.params.id}`)"
        :label="t('ส่งใบเตือน')" variant="outlined" severity="primary" rounded class="w-full mb-3" :pt="{
          root: {
            class: '!border-primary-main'
          },
        }" />
      <Button :loading="isloadingAxi" @click="navigateTo('/inspector/home')" :label="t('กลับหน้าหลัก')" severity="secondary"
        rounded class="w-full" :pt="{

        }" />

    </div>

  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const isloadingAxi = useState("isloadingAxi");
import * as dataApi from "../api/data.js";

import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
const route = useRoute();

const resData = ref()
const loadData = async () => {
  try {
    const res = await dataApi.getSuveyAuditPolice(route.params.id);
    resData.value = res.data.data;
    rate.value = res.data.data?.score_percent_failed
    currentRate.value = res.data.data?.score_percent_failed
  } catch (error) {

  }
}
onMounted(() => {
  loadData();
})
const router = useRouter();
const currentRate = ref(0);
const rate = ref(0);
const text = computed(() => {
  return currentRate.value !== null && currentRate.value !== undefined
    ? `${currentRate.value.toFixed(2)}%`
    : "0%";
});
// const text = computed(() => `${(currentRate.value ?? 0).toFixed(2)}%`);

const onSubmit = () => {
  // Add submit logic here
  console.log('Submit clicked');
};

const goToHome = () => {
  router.push('/');
};
</script>