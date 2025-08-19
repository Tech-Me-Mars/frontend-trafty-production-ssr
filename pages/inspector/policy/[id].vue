<style scoped></style>
<template>
    <div class="bg-zinc-100 min-h-screen w-full">

        <LayoutsBaseHeader title="มาตรฐานความปลอดภัย" :showBack="true"
            :backTo="`/inspector/check/business-tourlist?isBusiness=${route.query.isBusiness}`">
        </LayoutsBaseHeader>

        <div class="p-4 max-w-lg mx-auto">
            <div class="mx-auto   bg-white rounded-lg shadow-md px-4 py-2">
                <div class="border-b flex justify-between ">
                    <div class="flex justify-between flex-wrap w-full">
                        <h2 class="font-bold">{{ t('สถานะการแสดง') }}</h2>
                        <ConfirmSwitch v-model="isOpen" :message-on="`${t('คุณต้องการเปิดรีวิวนี้ให้ผู้อื่นเห็นหรือไม่?')}`"
                            :message-off="`${t('คุณต้องการปิดรีวิวนี้ใช่หรือไม่?')}`"
                            @update:modelValue="toggleReviewVisibility" />
                    </div>
                    <!-- <h1 class="text-lg font-bold">{{ t('มาตรฐานความปลอดภัย') }}</h1> -->

                </div>

                <div class="p-4">
                    <div v-for="(item, index) in resPolicy" :key="index">
                        <div class="flex items-start space-x-3">
                            <i v-if="item?.FieldValue == '1'" class="fa-solid fa-circle-check text-blue-700 mt-1"></i>
                            <i v-else class="fa-solid fa-circle-xmark text-red-600 mt-1"></i>
                            <h2 class="text-base mb-2">
                                {{ getI18n(item?.questions_field_name_display, locale) }}
                            </h2>
                        </div>
                        <!-- <ul class="space-y-3">
                            <li class="flex items-start space-x-3" v-for="(item_sub, index_sub) in item?.question"
                                :key="index_sub">
                                <i v-if="item_sub?.choice_text == 'มี'"
                                    class="fa-solid fa-circle-check text-blue-700 mt-1"></i>
                                <i v-else class="fa-solid fa-circle-xmark text-red-600 mt-1"></i>
                                <span>{{ item_sub?.audit_questions_text }}</span>
                            </li>

                        </ul> -->
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

// basic ที่ใช้ทุกหน้า
definePageMeta({
    middleware: ["auth"],
});
import { useForm, useField, Form } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'
import * as dataApi from "./api/data.js";
import { useI18n } from 'vue-i18n';
const { t, locale, setLocale } = useI18n()
const isloadingAxi = useState('isloadingAxi')
const route = useRoute()
const router = useRouter()
const toast = ref({
    show: false,
    type: null,
    title: null,
    message: null,
    life: null,
})
const notification = reactive({
    visible: false,
    state: 'success',
    title: '',
    detail: '',
    timeout: 0,
    redirectUrl: null,
    autoClose: true
})
// Methods
const showNotification = (config) => {
    Object.assign(notification, {
        visible: true,
        ...config
    })
}
// จบการ basic ที่ใช้ทุกหน้า

const resPolicy = ref([])
const loadPolicy = async () => {
    try {
        const res = await dataApi.getSurveyAuditAllByBusinessId(route.params.id);
        resPolicy.value = res.data.data.sort((a, b) => a.index - b.index);
    } catch (error) {

    }
}
const isOpen = ref(true);
const toggleReviewVisibility = async (nextValue) => {
    try {
        // // เรียก API เพื่ออัปเดตสถานะรีวิว
        const payload = {
            "status_show": nextValue
        }
        await dataApi.updateSurveyStatusShow(payload)

        // // สำเร็จ → ให้ state เป็นค่าที่กด
        isOpen.value = nextValue
    } catch (error) {
        // ถ้า error → รีเซ็ตกลับค่าเดิม
        isOpen.value = !nextValue
        console.error(error)
        toast.value = {
            show: true,
            type: 'danger',
            title: t('ผิดพลาด'),
            message: error?.response?.data?.message || t('เกิดข้อผิดพลาด'),
            life: null
        }
        // แจ้งผู้ใช้ด้วย toast หรือ alert ก็ได้
    }
}

onMounted(() => {
    loadPolicy();
})
</script>