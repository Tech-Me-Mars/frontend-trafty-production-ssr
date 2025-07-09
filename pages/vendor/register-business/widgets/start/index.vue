<script setup>
import { useRouter } from 'vue-router';
import { useFormStore } from '@/store/businessStore.js';
import { useI18n } from 'vue-i18n';
import * as dataApi from '../../api/data.js';

const { t } = useI18n();
const isloadingAxi = useState('isloadingAxi');  // สำหรับการโหลด

const router = useRouter();
const formStore = useFormStore(); // ใช้งาน Pinia Store
const resServiceType = ref([]);
const alertToast = ref({});
const activeLangTab = ref('th');  // ใช้สำหรับจัดการแท็บของภาษา

// ดึงข้อมูลประเภทการให้บริการจาก API
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
const handleServiceTypeClick = async (serviceTypeId, serviceTypeName) => {
    // สร้าง Payload ที่จะใช้ส่งไปยัง API
    const payload = {
        service_type_name_i18n: {
            th: serviceTypeName.th,
            en: serviceTypeName.en,
            cn: serviceTypeName.cn
        },
        status: true  // สามารถเปลี่ยนค่า status ได้ตามความต้องการ
    };

    // ส่งข้อมูลไปที่ API
    try {
        console.log("Saving service type:", payload);
        // const response = await dataApi.saveServiceType(payload);
        // formStore.setFormStart(serviceTypeId, serviceTypeName); // เก็บลง Pinia
        // formStore.nextPage(); // เปลี่ยนไปหน้า widgetForm1
    } catch (error) {
        console.error(error);
        alertToast.value = {
            title: t('บันทึกล้มเหลว'),
            isError: true,
            color: 'error',
            msg: error.response?.data?.message || "Error occurred",
            dataError: error
        };
    }
};

onMounted(() => {
    loadServiceType();
});
</script>

<template>
    <div class="bg-zinc-100 min-h-screen">
        <LayoutsBaseHeader :title="t('ประเภทการให้บริการ')" showBack backTo="/vendor/my-business"></LayoutsBaseHeader>

        <div class="">
            <!-- <div class="text-center pt-10 mb-12">
                <h1 class="font-bold text-2xl mb-4">{{ t('ประเภทการให้บริการ') }}</h1>
                <p class="text-primary-main text-lg mb-8">{{ t('กรุณาเลือกประเภทการให้บริการของคุณ') }}</p>
            </div> -->

            <!-- ใช้ van-tabs สำหรับการเลือกภาษา -->
            <van-tabs v-model:active="activeLangTab" type="line" sticky animated color="#202c54">
                <!-- Tab ภาษาไทย -->
                <van-tab title="ภาษาไทย" name="th" class="p-2 pt-10">
                    <div class="text-center">
                        <Button :loading="isloadingAxi"
                            v-for="(item, index) in resServiceType"
                            :key="index"
                            :label="item.service_type_name_i18n.th"
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
                            @click="handleServiceTypeClick(item.id, item.service_type_name_i18n)" 
                        />
                    </div>
                </van-tab>

                <!-- Tab English -->
                <van-tab title="English" name="en" class="p-2 pt-10">
                    <div class="text-center">
                        <Button :loading="isloadingAxi"
                            v-for="(item, index) in resServiceType"
                            :key="index"
                            :label="item.service_type_name_i18n.en"
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
                            @click="handleServiceTypeClick(item.id, item.service_type_name_i18n)" 
                        />
                    </div>
                </van-tab>

                <!-- Tab 中文 -->
                <van-tab title="中文" name="cn" class="p-2 pt-10">
                    <div class="text-center">
                        <Button :loading="isloadingAxi"
                            v-for="(item, index) in resServiceType"
                            :key="index"
                            :label="item.service_type_name_i18n.cn"
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
                            @click="handleServiceTypeClick(item.id, item.service_type_name_i18n)" 
                        />
                    </div>
                </van-tab>
            </van-tabs>
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