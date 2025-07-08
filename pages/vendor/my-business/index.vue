<template>
    <div class="bg-zinc-100 min-h-screen">
        <!-- <van-nav-bar :title="t('ธุรกิจของฉัน')" left-arrow @click-left="navigateTo('/')">
        </van-nav-bar> -->
        <LayoutsBaseHeader :title="t('ธุรกิจของฉัน')" :showBack="true"
        backTo="/"></LayoutsBaseHeader>
        <div class="flex justify-between flex-wrap gap-2 bg-white px-4 py-3">
            <h1 class="text-xl font-semibold">{{ t('ธุรกิจของฉัน') }} ({{ resBusiness.length }})</h1>
            <!-- <Select v-model="status_select" disabled :options="statusOptions" optionLabel="name" optionValue="id"
                class="w-[10rem]">

            </Select> -->
            <Button :loading="isloadingAxi" :label="t('เพิ่มธุรกิจ')" severity="primary" type="button" rounded
                class="w-auto" outlined :pt="{
                    root: {
                        class: '!border-primary-main'
                    },
                }" @click="navigateTo('/vendor/register-business')" />
        </div>


        <div class="p-4">
            <!-- กล่องข้อมูลธุรกิจ -->
            <div class="border rounded-lg shadow-md bg-white w-full max-w-md mx-auto mb-2"
                v-for="(item, index) in resBusiness" :key="index">
                <div class="p-4">
                    <!-- ชื่อธุรกิจ -->
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <h2 class="text-lg font-semibold text-gray-800 flex-1">{{ item?.shop_name }} <span
                                    v-if="item?.notification_status == 1"><i class="fa-solid fa-circle-exclamation"
                                        style="color: red;"></i></span></h2>

                        </div>
                        <!-- <div v-if="item?.status == true"
                            class="text-white bg-green-700 rounded-full px-2 py-2 text-xs">{{ t('อนุมัติแล้ว') }}</div>

                        <div v-else class="text-white bg-yellow-500 rounded-full px-2 py-2 text-xs">{{ t('รอตรวจสอบ') }}</div> -->
                        <div class="text-white rounded-full px-2 py-2 px-4 text-xs" :class="{
                            'bg-yellow-500': item?.survey_status_id === 0 || item?.survey_status_id === 3,
                            'bg-red-600': item?.survey_status_id === 4,
                            'bg-blue-500': item?.survey_status_id === 5,
                            'bg-[#1db900]': item?.survey_status_id === 2,
                        }">
                            {{ getStatusText(item?.survey_status_id) }}
                        </div>
                    </div>
                    <!-- ที่อยู่ธุรกิจ -->
                    <p class="text-gray-500 mt-1 text-sm mb-6"></p>


                    <!-- ปุ่มแอคชัน -->
                    <hr class="border-t mb-4 mx-5">
                    <div class="flex  gap-3">

                        <Button :loading="isloadingAxi" :label="t('รายละเอียด')" severity="primary" variant="outlined"
                            class="w-full" :pt="{
                                label: {
                                    class: 'text-primary-main'
                                },
                                root: {
                                    class: '!border-primary-main'
                                },

                            }" @click="navigateTo(`/vendor/manage-business/home/${item.id}`)" />

                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<style scoped>
.van-nav-bar {
    --van-nav-bar-background: #281c74;
    --van-nav-bar-text-color: white;
    --van-nav-bar-icon-color: white;
    --van-nav-bar-title-text-color: white;
    --van-nav-bar-height: 70px
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

const resBusiness = ref([])
const loadListData = async () => {
    try {
        const res = await dataApi.getMyBusiness();
        resBusiness.value = res.data.data;
    } catch (error) {

    }
}
onMounted(() => {
    loadListData();
})

const status_select = ref(1)
const statusOptions = ref([
    { id: 1, name: t('สถานะ:ทั้งหมด') }
])

const getStatusText = (status) => {
  switch (status) {
    case 0:
    case 3:
      return t('รอตรวจสอบ');
    case 4:
      return t('มีใบเตือน');
    case 5:
      return t('ตอบกลับใบเตือนแล้ว');
    case 2:
      return t('อนุมัติแล้ว');
    default:
      return t('ไม่ทราบสถานะ');
  }
};
</script>