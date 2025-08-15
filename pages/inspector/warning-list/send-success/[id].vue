<template>
    <div class="min-h-screen bg-zinc-50">
      <!-- Header Section -->
      <!-- <van-nav-bar :title="t('รายละเอียดใบเตือนที่ส่งไป')" left-arrow @click-left="navigateTo('/inspector/home')">
      </van-nav-bar> -->
                  <LayoutsBaseHeader :title="t('รายละเอียดใบเตือนที่ส่งไป')" :showBack="true" backTo="/inspector/home">
        </LayoutsBaseHeader>
  

      <section class="p-4">
    <div v-if="resBusinessSuccessWarningById.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="(business,indexmain) in resBusinessSuccessWarningById" :key="business.id" class="p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <!-- หัวข้อร้านค้า -->
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-semibold text-gray-800">{{ business.shop_name }}</h3>
          <!-- <i class="fas fa-file-alt text-blue-500 text-xl"></i>  -->
          <span>{{t('ครั้งที่') }} {{ indexmain+1 }}</span>
        </div>

        <!-- หัวข้อคำเตือน -->
        <p class="text-red-500 font-bold">{{ business.warning_title }}</p>
        <p class="text-gray-600 font-nomal">{{ business.warning_details }}</p>

        <!-- รายการตรวจสอบที่ไม่ผ่าน -->
        <ul class="mt-3 space-y-2">
          <li v-for="(question, index) in business.audit_questions" :key="index" class="flex items-center text-gray-700">
            <i class="fas fa-times-circle text-red-500 mr-2"></i>
        
            <span>{{ question }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- กรณีไม่มีข้อมูล -->
    <div v-else class="text-center text-gray-500 text-sm pt-10">
      <i class="fas fa-info-circle"></i> {{ $t('ไม่มีข้อมูล') }} !
    </div>
  </section>
      <MyToast :data="alertToast" />

    </div>
  </template>
  
  <style>
  .van-nav-bar {
    --van-nav-bar-background: #281c74;
    --van-nav-bar-text-color: white;
    --van-nav-bar-icon-color: white;
    --van-nav-bar-title-text-color: white;
    --van-nav-bar-height: 70px;
  }
  
  .van-tab {
    --van-tab-active-text-color: #281c74 !important
  }
  
  .van-tabs__line {
    width: 120px !important;
    background: #281c74 !important;
  }
  </style>
  
  <script setup>
  definePageMeta({
    middleware: ["auth"],
  });
  const isloadingAxi = useState("isloadingAxi");
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import * as dataApi from "../api/data.js";
  
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();
  
  const router = useRouter();
  const route = useRoute();

  const alertToast = ref({});
  
  
  const resBusinessSuccessWarningById = ref([])
  const loadBusinessSuccessWarning = async () => {
    try {
      const res = await dataApi.getBusinessWarningSuccessDetail(route.params.id);
      resBusinessSuccessWarningById.value = res.data.data;
    } catch (error) {
      console.error(error)
    }
  }
  onMounted(()=>{loadBusinessSuccessWarning()})
  </script>