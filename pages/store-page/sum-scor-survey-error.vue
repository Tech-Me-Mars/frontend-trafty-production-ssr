<template>
    <div class="min-h-screen bg-zinc-50 pt-8 px-4">
        <div class="w-full max-w-[420px] mx-auto">

            <!-- Circle Progress -->
            <div class="flex justify-center items-center mb-8 mt-[5rem]">
                <van-circle v-model:current-rate="percent" :rate="percent" :speed="100" :stroke-width="100"
                    color="#a3221a" layer-color="#ebedf0" size="200px" text="84%" />
            </div>

            <!-- ข้อความผลลัพธ์ -->
            <div class="text-center text-xl font-bold text-[#232323] mt-4 mb-10">
                ไม่ผ่านเกณฑ์
            </div>
            <div class="text-center text-[#35387a] text-base leading-6" style="height:  10rem;">
                ขอบคุณสำหรับข้อมูลการประเมิน<br />
                แหล่งท่องเที่ยวนี้ผ่านเกณฑ์มาตรฐานตามที่กำหนด
            </div>

            <!-- ปุ่ม -->

            <div class="mb-2 flex justify-center">
                <!-- <Button rounded
                        class="w-full py-2 rounded-full bg-[#272e77] hover:bg-[#20245a] text-white text-base font-semibold shadow-md transition"
                        label="อนุมัติให้แสดงหน้าเว็บไซต์" @click="approve" /> -->
                <Button :label="('อนุมัติให้แสดงหน้าเว็บไซต์')" severity="primary" type="button" rounded class="w-full" :pt="{
                    root: {
                        class: '!border-primary-main'
                    },
                }" @click="approve" />
            </div>
            <button class="w-full rounded-full bg-transparent text-[#232323] font-medium text-base py-2"
                @click="goHome">
                กลับสู่หน้าหลัก
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
//   import { Circle as VanCircle } from 'vant'
//   import 'vant/lib/index.css'
//   import { Button } from 'primevue/button'

const percent = ref(84)

const approve = () => {
    // alert('อนุมัติเรียบร้อย')
}
const goHome = () => {
    // router.push('/') หรือจะ window.location.href = '/' ก็ได้
    // alert('กลับหน้าหลัก')
}
</script>

<style>
/* ซ่อน spinning ของ Vant Circle */
.van-circle__text {
    display: flex;
    align-items: center;
    font-size: 1rem !important;
    justify-content: center;
}

.p-inputtextarea {
    min-height: 100px !important;
    font-size: 1rem;
    background: transparent;
    border-radius: 12px;
    box-shadow: none;
}

.p-inputtextarea:focus {
    outline: none;
    border-color: #4254f2;
}

/* ซ่อน scrollbar เวลาใช้งานมือถือ */
.p-inputtextarea::-webkit-scrollbar {
    display: none;
}
</style>