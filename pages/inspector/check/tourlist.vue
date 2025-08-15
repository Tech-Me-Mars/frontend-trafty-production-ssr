<template>
    <div class="bg-zinc-100 min-h-screen">

        <LayoutsBaseHeader :title="t('จัดการแหล่งท่องเที่ยว')" :showBack="true" backTo="/inspector/home">
        </LayoutsBaseHeader>
        <div class="flex justify-between flex-wrap gap-2 bg-white px-4 py-3">
            <h1 class="text-xl font-semibold">{{ t('แหล่งท่องเที่ยว') }} ({{ resSurveytouristwaiting.length }})</h1>
            <Select v-model="status_select" disabled :options="statusOptions" optionLabel="name" optionValue="id"
                class="w-[10rem]">

            </Select>
        </div>


        <div class="p-4">
            <!-- กล่องข้อมูลธุรกิจ -->
            <div class="border rounded-lg shadow-md bg-white w-full max-w-md mx-auto mb-2" v-for="(item,index) in resSurveytouristwaiting" :key="index">
                <div class="p-4">
                    <!-- ชื่อธุรกิจ -->
                    <div class="flex justify-between items-center">
                        <h2 class="text-lg font-semibold text-gray-800">{{ item?.shop_name }}</h2>
                        <span class="text-white bg-yellow-500 rounded-full px-2 py-2 text-xs">{{ item?.survey_success_text }}</span>
                    </div>
                    <!-- ที่อยู่ธุรกิจ -->
                    <p class="text-gray-500 mt-1 text-sm mb-6"></p>


                    <!-- ปุ่มแอคชัน -->
                    <hr class="border-t mb-4 mx-5">
                    <div class="flex  gap-3">

                        <Button v-if="item?.survey_status_id == 1" disabled :loading="isloadingAxi" :label="t('ตรวจสอบแล้ว')" severity="primary" variant="outlined" class="w-full" :pt="{
                            label: {
                                class: 'text-primary-main'
                            },
                            root: {
                                class: '!border-primary-main'
                            },

                        }"  />
                        <Button v-else :loading="isloadingAxi" :label="t('ตรวจสอบ')" severity="primary" variant="outlined" class="w-full" :pt="{
                            label: {
                                class: 'text-primary-main'
                            },
                            root: {
                                class: '!border-primary-main'
                            },

                        }" @click="navigateTo(`/client/information/${item.business_id}`)" />
                        <!-- <Button :loading="isloadingAxi" label="แก้ไข" severity="primary" variant="outlined" class="w-full" :pt="{
                            label: {
                                class: 'text-primary-main'
                            },
                            root: {
                                class: '!border-primary-main'
                            },

                        }" />
                        <Button :loading="isloadingAxi" icon="fa-regular fa-trash-can" label="" severity="danger" variant="outlined"
                            class="!w-[10rem]" /> -->
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

const resSurveytouristwaiting = ref([])
const loadListData = async () => {
    try {
        const res = await dataApi.getsurveytouristwaiting();
        resSurveytouristwaiting.value = res.data.data;
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
</script>