<template>
    <div class="min-h-screen bg-zinc-50">
        <!-- Header Section -->
        <van-nav-bar :title="t('แจ้งเตือน')" left-arrow @click-left="router.go(-1)">
        </van-nav-bar>

        <!-- Notification Section -->
        <section class="space-y-2">
    <div
      v-for="item in resNotify"
      :key="item.id"
      @click="navigateTo(`/vendor/warning-list/${route.params.id}/${item.id}/reply`)"
      class="flex items-center bg-white shadow-sm p-4 cursor-pointer"
    >
      <!-- Icon -->
      <div class="flex-shrink-0 bg-indigo-900 w-10 h-10 flex items-center justify-center rounded">
        <img
          src="/image/logo_erp.png"
          alt="Notification Icon"
          class="h-8 w-8 rounded"
        />
      </div>

      <!-- Content -->
      <div class="ml-4">
        <p class="text-sm font-semibold text-gray-900">{{ item.warning_title }}</p>
        <p class="text-sm text-gray-600 mt-1">
          {{ item.warning_details }}
        </p>
        <p class="text-xs text-gray-400 mt-2">
          {{ formatTime(item.created_at) }}
        </p>
      </div>
    </div>
  </section>
      <MyToast :data="alertToast" />

    </div>
</template>

<style scoped>
.van-nav-bar {
    --van-nav-bar-background: #281c74;
    --van-nav-bar-text-color: white;
    --van-nav-bar-icon-color: white;
    --van-nav-bar-title-text-color: white;
    --van-nav-bar-height: 70px;
}
</style>

<script setup>
definePageMeta({
  middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const isloadingAxi = useState("isloadingAxi");
const router = useRouter();
const route = useRoute();
const alertToast = ref({});
import * as dataApi from "./api/data.js";


const resNotify=ref([])
const loadNotify = async ()=>{
    try {
        const res = await dataApi.getNotify(route.params.id);
        resNotify.value =res.data.data;
    } catch (error) {
        console.error(error)
    }
}

onMounted(()=>{
    loadNotify();
})

const formatTime = (datetime) => {
  const date = new Date(datetime);
  return date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>