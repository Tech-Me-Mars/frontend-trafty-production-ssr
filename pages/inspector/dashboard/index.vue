<script setup>
definePageMeta({
  middleware: ["auth"],
});
import widgetsCheckedStatistics from './widgets/widgets-checked-statistics.vue';
import WidgetsCheckedBusiness from './widgets/widgets-checked-business.vue';
import WidgetsCheckedGraph from './widgets/widgets-graph.vue';
const router = useRouter();

const areaData = ref({
  total: 7000,
  checked: 4500,
  unchecked: 2500,
  passed: 2300,
  failed: 200,
});
const businessData = ref({
  total: 6000,
  checked: 4300,
  unchecked: 1700,
  passed: 1300,
  failed: 400,
});

</script>
<style scoped>
.van-nav-bar {
  --van-nav-bar-background: #281c74;
  --van-nav-bar-text-color: white;
  --van-nav-bar-icon-color:white;
  --van-nav-bar-title-text-color: white;
  --van-nav-bar-height: 70px
}
</style>
<template>
<!-- <van-nav-bar title="ระบบจัดเก็บข้อมูล" left-arrow  @click-left="router.go(-1)">
  <template #right>
    <i class="fa-solid fa-xmark" style="color: white;font-size: 26px;"></i>
  </template>
</van-nav-bar> -->

            <LayoutsBaseHeader title="ระบบจัดเก็บข้อมูล" :showBack="true">
                <template #right>
    <i class="fa-solid fa-xmark" style="color: white;font-size: 26px;"></i>
  </template>
        </LayoutsBaseHeader>

  <!-- <i class="pi pi-check"></i> -->
  <div class="p-4 bg-gray-100 min-h-screen">
    <div class="">
      <h1 class="text-lg font-semibold mb-4">ระบบจัดเก็บข้อมูลแหล่งท่องเที่ยว</h1>

      <!-- Section 1 -->
      <div class="mb-6">
        <div class="grid grid-cols-2 gap-2 mb-4">
          <div class="card col-span-2">
            <p class="text-gray-500">พื้นที่ลงทะเบียนทั้งหมด</p>
            <p class="text-xl font-bold text-gray-700">{{ areaData.total }}</p>
          </div>
          <div class="card">
            <p class="text-gray-500">พื้นที่ที่ตรวจสอบ</p>
            <p class="text-xl font-bold text-gray-700">{{ areaData.checked }}</p>
          </div>
          <div class="card">
            <p class="text-gray-500">พื้นที่ที่ตรวจสอบแล้ว</p>
            <p class="text-xl font-bold text-gray-700">{{ areaData.unchecked }}</p>
          </div>
          <div class="card">
            <p class="text-gray-500">ผ่านการประเมิน</p>
            <p class="text-xl font-bold text-green-500">{{ areaData.passed }}</p>
          </div>
          <div class="card">
            <p class="text-gray-500">ไม่ผ่านการประเมิน</p>
            <p class="text-xl font-bold text-red-500">{{ areaData.failed }}</p>
          </div>
        </div>
         <ClientOnly>
          <widgetsCheckedStatistics />
        </ClientOnly>
         
      </div>

      <!-- Section 2 -->
      <div class="mb-4">
        <h2 class="text-lg font-semibold mb-2">ระบบจัดเก็บข้อมูลธุรกิจในแหล่งท่องเที่ยว</h2>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="card col-span-2">
            <p class="text-gray-500">พื้นที่ลงทะเบียนทั้งหมด</p>
            <p class="text-xl font-bold text-gray-700">{{ businessData.total }}</p>
          </div>
          <div class="card">
            <p class="text-gray-500">พื้นที่ที่ตรวจสอบ</p>
            <p class="text-xl font-bold text-gray-700">{{ businessData.checked }}</p>
          </div>
          <div class="card">
            <p class="text-gray-500">พื้นที่ที่ตรวจสอบแล้ว</p>
            <p class="text-xl font-bold text-gray-700">{{ businessData.unchecked }}</p>
          </div>
          <div class="card">
            <p class="text-gray-500">ผ่านการประเมิน</p>
            <p class="text-xl font-bold text-green-500">{{ businessData.passed }}</p>
          </div>
          <div class="card">
            <p class="text-gray-500">ไม่ผ่านการประเมิน</p>
            <p class="text-xl font-bold text-red-500">{{ businessData.failed }}</p>
          </div>
        </div>
        <ClientOnly>
          <WidgetsCheckedBusiness />
        </ClientOnly>

      </div>

      <div>
        <ClientOnly>
          <WidgetsCheckedGraph />
        </ClientOnly>
      </div>


    </div>
  </div>
</template>


