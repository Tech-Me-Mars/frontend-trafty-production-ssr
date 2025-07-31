<script setup>
import { useRouter } from 'vue-router';
import { useFormStore } from '@/store/businessStore.js';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const isloadingAxi = useState('isloadingAxi')

const router = useRouter();
const formStore = useFormStore(); // ใช้งาน Pinia Store
import * as dataApi from '../../api/data.js'

const resServiceType = ref([]);
const alertToast = ref({});

const loadServiceType = async () => {
    try {
        const res = await dataApi.getServiceType();
        resServiceType.value = res.data.data;
    } catch (error) {
        console.error(error);
        alertToast.value = {
            title: t('ล้มเหลว'),
            isError: true,
            color: 'error',
            msg: error.response?.data?.message || "Error occurred",
            dataError: error
        };
    }
};

// ฟังก์ชันเมื่อคลิกปุ่ม
const handleServiceTypeClick = (serviceTypeId, serviceTypeName) => {
    formStore.setFormStart(serviceTypeId, serviceTypeName); // เก็บลง Pinia
    formStore.nextPage(); // เปลี่ยนไปหน้า widgetForm1
};

onMounted(() => {
    loadServiceType();
});
</script>
<template>
    <div class="bg-zinc-100 min-h-screen">

        <LayoutsBaseHeader :title="t('ประเภทการให้บริการ')" :showBack="true" backTo="/vendor/my-business">
                        <template #right>
                <i @click="navigateTo('/vendor/my-business')" class="fa-solid fa-xmark"
                    style="color: white;font-size: 26px;"></i>
            </template>
        </LayoutsBaseHeader>


        <div class="p-4">
            <div class="text-center pt-10 mb-12">
                <h1 class="font-bold text-2xl mb-4">{{ t('ประเภทการให้บริการ') }}</h1>
                <p class="text-primary-main text-lg mb-8">{{ t('กรุณาเลือกประเภทการให้บริการของคุณ') }}</p>
            </div>
            <div class="text-center">
                <!-- ปุ่มสำหรับแต่ละประเภท -->
                <Button :loading="isloadingAxi"
                    v-for="(item, index) in resServiceType"
                    :key="index"
                    :label="item.service_type_name"
                    severity="primary"
                    rounded
                    variant="outlined"
                    class="w-full mb-4"
                    :pt="{
                        label: {
                            class: 'text-primary-main'
                        },
                        root: {
                            class: '!border-primary-main'
                        }
                    }"
                     @click="handleServiceTypeClick(item.id, item.service_type_name)" 
                />
            </div>
        </div>
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