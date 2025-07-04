<style scoped>
.van-nav-bar {
    --van-nav-bar-background: #281c74;
    --van-nav-bar-text-color: white;
    --van-nav-bar-icon-color: white;
    --van-nav-bar-title-text-color: white;
    --van-nav-bar-height: 70px
}
</style>
<template>
    <div class="bg-white min-h-screen">
        <van-nav-bar :title="('มาตรฐานความปลอดภัย')" left-arrow
            @click-left="navigateTo(`/client/information/${route.params.id}`)">
        </van-nav-bar>

        <div class="">
            <div class="mx-auto  ">
                <div class="p-4 border-b flex justify-between">
                    <h1 class="text-lg font-bold">{{ t('มาตรฐานความปลอดภัย') }}</h1>

                </div>

                <div class="p-4">
                    <div v-for="(item,index) in resPolicy" :key="index">
                        <h2 class="text-base font-semibold mb-2">
                            {{ item?.topic_name }}
                        </h2>
                        <ul class="space-y-3" >
                            <li class="flex items-start space-x-3" v-for="(item_sub,index_sub) in item?.question" :key="index_sub">
                                <i v-if="item_sub?.choice_text == 'มี'" class="fa-solid fa-circle-check text-blue-700 mt-1"></i>
                                <i v-else class="fa-solid fa-circle-xmark text-red-600 mt-1"></i>
                                <span>{{ item_sub?.audit_questions_text }}</span>
                            </li>
                            
                        </ul>
                        <hr class="border-b mx-4 my-5" />
                    </div>
                    
                     <!-- <h2 class="text-base font-semibold mb-2 ">
                        2. ด้านความปลอดภัยสารสนสุข
                    </h2>
                    <ul class="space-y-3">
                        <li class="flex items-start space-x-3">
                            <i class="fa-solid fa-circle-check text-blue-700 mt-1"></i>
                            <span>สถานบริการได้รับมาตรฐาน SHA</span>
                        </li>
                        <li class="flex items-start space-x-3">
                            <i class="fa-solid fa-circle-xmark text-red-600 mt-1"></i>
                            <span>สถานบริการได้รับมาตรฐาน SHA PLUS</span>
                        </li>
                        <li class="flex items-start space-x-3">
                            <i class="fa-solid fa-circle-xmark text-red-600 mt-1"></i>
                            <span>จัดให้มีจุดตรวจวัดอุณหภูมิ และมีน้ำล้างมือหรือแอลกอฮอล์ 70% สำหรับล้างมือ
                                และปฏิบัติตามมาตรการป้องกันการแพร่ระบาดของไวรัสโคโรนา 2019 (DMHTT)</span>
                        </li>
                        <li class="flex items-start space-x-3">
                            <i class="fa-solid fa-circle-check text-blue-700 mt-1"></i>
                            <span>สถานที่มีความสะอาด มีการทำความสะอาดอยู่เสมอ (DMHTT)</span>
                        </li>
                        <li class="flex items-start space-x-3">
                            <i class="fa-solid fa-circle-check text-blue-700 mt-1"></i>
                            <span>มีห้องน้ำและห้องอาบน้ำสาธารณะให้บริการอย่างเพียงพอ สะอาด ถูกสุขลักษณะ
                                แยกสำหรับชาย-หญิง และผู้พิการ</span>
                        </li>
                        <li class="flex items-start space-x-3">
                            <i class="fa-solid fa-circle-check text-blue-700 mt-1"></i>
                            <span>อาหารและเครื่องดื่มสะอาดปลอดภัย ถูกสุขลักษณะ</span>
                        </li>
                        <li class="flex items-start space-x-3">
                            <i class="fa-solid fa-circle-check text-blue-700 mt-1"></i>
                            <span>ผู้ประกอบอาหารและพนักงานแต่งกายถูกหลักอนามัย มีการสวมชุด ประกอบอาหาร ผ้ากันเปื้อน
                                ถุงมือยาง หมวกประกอบอาหาร และสวมใส่หน้ากากอนามัยตลอดเวลาที่ให้บริการ</span>
                        </li>
                        <li class="flex items-start space-x-3">
                            <i class="fa-solid fa-circle-check text-blue-700 mt-1"></i>
                            <span>มีการทำความสะอาดภาชนะใส่อาหาร น้ำดื่ม น้ำแข็งให้ได้สะอาด
                                ลูกค้าเลือกใช้บริการตามหลักสุขาภิบาลอาหาร</span>
                        </li>
                        <li class="flex items-start space-x-3">
                            <i class="fa-solid fa-circle-xmark text-red-600 mt-1"></i>
                            <span>จัดให้มีสัญลักษณ์การเว้นระยะห่าง 1-2 เมตร ระหว่างผู้มาใช้บริการ เช่น
                                จัดเก้าอี้ให้เว้นระยะห่างบุคคลที่นั่งโต๊ะเดียวกัน
                                ให้ความรู้เรื่องไม่ยืนชิดระดับศีรษะ</span>
                        </li>
                        <li class="flex items-start space-x-3">
                            <i class="fa-solid fa-circle-check text-blue-700 mt-1"></i>
                            <span>จัดให้มีช่องทางการชำระเงินผ่านระบบอิเล็กทรอนิกส์</span>
                        </li>
                    </ul>
                    <hr class="border-b mx-4 my-5" />

                    <h2 class="text-base font-semibold mb-2">
                        3. ด้านความปลอดภัยในธรรมชาติของแหล่งท่องเที่ยว
                    </h2>
                    <ul class="space-y-3">
                        <li class="flex items-start space-x-3">
                            <i class="fa-solid fa-circle-check text-blue-700 mt-1"></i>
                            <span>สถานที่ตั้งได้รับอนุญาตในการก่อสร้างจากการยกร่างที่ต้อง</span>
                        </li>
                        <li class="flex items-start space-x-3">
                            <i class="fa-solid fa-circle-check text-blue-700 mt-1"></i>
                            <span>มีการปรับปรุงภูมิทัศน์ภายในแหล่งท่องเที่ยวอย่างสม่ำเสมอ</span>
                        </li>
                        <li class="flex items-start space-x-3">
                            <i class="fa-solid fa-circle-check text-blue-700 mt-1"></i>
                            <span>มีการคัดแยกขยะตามประเภทเพื่อป้องกันสิ่งที่ไม่เหมาะสมในบริเวณสถานที่</span>
                        </li>
                        <li class="flex items-start space-x-3">
                            <i class="fa-solid fa-circle-check text-blue-700 mt-1"></i>
                            <span>จุดแยกขยะหรือที่ทิ้งขยะจัดการอย่างมีระเบียบป้องกันมลพิษ</span>
                        </li>
                        <li class="flex items-start space-x-3">
                            <i class="fa-solid fa-circle-xmark text-red-600 mt-1"></i>
                            <span>ยังไม่มีเทคโนโลยีภาพเขตเพื่อกำจัดขยะ</span>
                        </li>
                        <li class="flex items-start space-x-3">
                            <i class="fa-solid fa-circle-check text-blue-700 mt-1"></i>
                            <span>การจัดการน้ำเสียอย่างถูกสุขลักษณะ ไม่ปล่อยให้มีปัญหาส่งผลต่อแหล่งน้ำใกล้เคียง</span>
                        </li>
                        <li class="flex items-start space-x-3">
                            <i class="fa-solid fa-circle-check text-blue-700 mt-1"></i>
                            <span>การใช้น้ำเสียในระบบหมุนเวียนกลับมาใช้ใหม่</span>
                        </li>
                        <li class="flex items-start space-x-3">
                            <i class="fa-solid fa-circle-check text-blue-700 mt-1"></i>
                            <span>การอนุรักษ์ธรรมชาติที่ช่วยลดผลกระทบสิ่งแวดล้อม</span>
                        </li>
                        <li class="flex items-start space-x-3">
                            <i class="fa-solid fa-circle-xmark text-red-600 mt-1"></i>
                            <span>ยังไม่มีระบบตรวจวัดปรับให้เพิ่มแนะนำเพื่อเพิ่มแผนพัฒนา</span>
                        </li>
                    </ul> -->
                </div>
            </div>
        </div>
    </div>



</template>

<script setup>
// definePageMeta({
//   middleware: ["auth"],
// });
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import * as dataApi from './api/data.js'

const route = useRoute();
const resPolicy = ref([])
const loadChoiceAudit = async () => {
    try {
        const res = await dataApi.getResultPoliceSurveyAudit(route.params.id);
        resPolicy.value = res.data.data;
    } catch (error) {

    }
}

onMounted(() => {
    loadChoiceAudit();
})
</script>