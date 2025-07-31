<template>
    <div class="min-h-screen bg-white">
        <!-- Header -->
        <LayoutsBaseHeader title="มาตรฐานความปลอดภัย" showBack></LayoutsBaseHeader>


        <!-- Main Content -->
        <div class="">
            <!-- Status Header -->
            <div class="text-center mb-8 bg-zinc-100 h-[10rem] pt-5">
                <p class="text-gray-800 text-sm mb-2">การประเมินองคุณ</p>
                <h2 class="text-xl font-semibold text-gray-800">ค่อนข้างดี</h2>
            </div>

            <!-- Progress Circle -->
            <div class="bg-white rounded-lg p-2  border-2 border-gray-100 -mt-[6.5rem]  max-w-[22rem] mx-auto">
                <h3 class="text-lg font-medium mb-2">ประเภทรับอาหาร</h3>

                <div class="flex justify-center">
                    <!-- Gauge Component -->
                     <!-- size-36 -->
                    <div class="relative  w-[10rem] h-[5.5rem]">
                        <svg class=" rotate-180" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            <!-- Background Circle (Gauge) -->
                            <circle cx="18" cy="18" r="16" fill="none"
                                class="stroke-current text-gray-200 dark:text-[#e5e7eb]" stroke-width="2"
                                stroke-dasharray="50 100" stroke-linecap="round"></circle>

                            <!-- Gauge Progress -->
                            <circle cx="18" cy="18" r="16" fill="none"
                                class="stroke-current text-[#fccc0c] dark:text-[#fccc0c]" stroke-width="2"
                                stroke-dasharray="37.5 100" stroke-linecap="round"></circle>
                        </svg>

                        <!-- Value Text -->
                        <div class="absolute top-9 start-1/2 transform -translate-x-1/2 text-center">
                            <span class="text-2xl font-bold text-[#000000] dark:text-[#000000]">87%</span>
                            <!-- <span class="text-sm text-[#000000] dark:text-[#000000] block">Score</span> -->
                        </div>
                    </div>

                </div>


            </div>

            <!-- Tab Navigation -->
            <!-- <div class="flex border-b border-gray-200 mb-4">
                <button class="flex-1 py-2 text-center text-sm font-medium border-b-2 border-blue-500 text-blue-600">
                    อยู่ในเกณฑ์ดี
                </button>
                <button class="flex-1 py-2 text-center text-sm font-medium text-gray-500">
                    ต้องปรับปรุง
                </button>
            </div> -->
        <van-tabs v-model:active="active" animated swipeable color="#281c74">
                <van-tab title="อยู่ในเกณฑ์ดี">

                    </van-tab>
                                    <van-tab title="ต้องปรับปรุง">

                    </van-tab>
            </van-tabs>


            <!-- Assessment Details -->
            <div class="space-y-4">
                <!-- Item 1 -->
                <div class="bg-white rounded-lg p-4 shadow-sm">
                    <h4 class="font-medium text-gray-800 mb-3">
                        1. ด้านความปลอดภัยในชีวิตและทรัพย์สินของนักท่องเที่ยว
                    </h4>
                    <p class="text-sm text-gray-600 mb-3">
                        มีการจัดเจ้าหน้าที่รักษาความปลอดภัยไว้ตลอดเวลาก่อนหน้า
                        ยังช่วงเวลาเก็บ มีการออกเดินตรวจความ
                    </p>
                    <p class="text-sm text-gray-600">
                        เรียบร้อยอยู่สม่ำเสมอ
                    </p>
                </div>

                <!-- Item 2 -->
                <div class="bg-white rounded-lg p-4 shadow-sm">
                                        <h4 class="font-medium text-gray-800 mb-3">
                        2. ด้านความปลอดภัยในชีวิตและทรัพย์สินของนักท่องเที่ยว
                    </h4>
                    <p class="text-sm text-gray-600">
                        มีการติดตั้งกล้องวงจรปิด สามารถใช้ได้อย่างและ
                        ตรวจสอบย้อนหลัง หลังได้
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
const active = ref(0)
// Data
const progress = ref(0)
const targetProgress = 100
const semiCircumference = Math.PI * 40 // radius = 40 for semi-circle

// Methods
const goBack = () => {
    // Handle back navigation
    console.log('Going back...')
}

// Animate progress on mount
onMounted(() => {
    setTimeout(() => {
        progress.value = targetProgress
    }, 300)
})
</script>

<style scoped>
/* Additional custom styles if needed */
.transition-all {
    transition: all 1s ease-out;
}

.van-tabs__line {
  width: 120px !important;
  background: #281c74 !important;
}
.van-tab {
  --van-tab-active-text-color: #281c74 !important
}

</style>