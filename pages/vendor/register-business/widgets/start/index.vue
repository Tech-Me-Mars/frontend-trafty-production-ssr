<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { useFormStore } from '@/store/businessStore.js';
import { useI18n } from 'vue-i18n';
import * as dataApi from '../../api/data.js';
const { t, locale, setLocale } = useI18n();
onMounted(()=>{
  setLocale('th-TH')
})

const isloadingAxi = useState('isloadingAxi');  // สำหรับการโหลด

const langs = [
    { code: "th", label: "ภาษาไทย" },
    { code: "en", label: "English" },
    { code: "cn", label: "中文" },
];

const router = useRouter();
const formStore = useFormStore(); // ใช้งาน Pinia Store

const resServiceType = ref([]);
const alertToast = ref({});
const activeLangTab = ref('th');      // Tab ภาษา
const selectedId = ref('');           // ID ที่เลือก

// ดึงข้อมูลประเภทการให้บริการจาก API
const loadServiceType = async () => {
    try {
        isloadingAxi.value = true
        const res = await dataApi.getServiceType();
        resServiceType.value = res.data.data;
    } catch (error) {
        alertToast.value = {
            title: t('ล้มเหลว'),
            isError: true,
            color: 'error',
            msg: error.response?.data?.message || "Error occurred",
            dataError: error
        };
    } finally {
        isloadingAxi.value = false
    }
};

// เมื่อเลือก ServiceType
const handleServiceTypeClick = async (serviceTypeId) => {
    selectedId.value = serviceTypeId;  // กำหนด id ที่เลือกไว้ (highlight ทุกภาษา)
    // เก็บลง Store / ยิง API ได้เลย เช่น
    formStore.setFormStart(serviceTypeId)
    formStore.nextPage();
    // Optional: Toast แสดงการเลือก
    // alertToast.value = { title: 'เลือกสำเร็จ', isError: false, color: 'success', msg: t('คุณเลือกแล้ว') }
};

onMounted(loadServiceType);
</script>

<template>
    <div class="bg-zinc-100 min-h-screen">
        <LayoutsBaseHeader :title="t('ประเภทการให้บริการ')" showBack backTo="/vendor/my-business"></LayoutsBaseHeader>

        <div>
            <!-- <van-tabs v-model:active="activeLangTab" type="line" sticky animated color="#202c54">
                <van-tab title="ภาษาไทย" name="th" class="p-2 pt-10">
                    <div class="text-center">
                        <Button
                            v-for="(item, index) in resServiceType"
                            :key="item.id"
                            :label="item.service_type_name_i18n.th"
                            severity="primary"
                            rounded
                            variant="outlined"
                            class="w-full mb-4"
                            :pt="{
                                label: { class: 'text-primary-main' },
                                root:  { class: selectedId === item.id ? '!border-indigo-900 bg-blue-50' : '!border-primary-main' }
                            }"
                            :loading="isloadingAxi"
                            @click="handleServiceTypeClick(item.id, item.service_type_name_i18n)" 
                        />
                    </div>
                </van-tab>
                
            </van-tabs> -->
            <van-tabs v-model:active="activeLangTab" type="line" sticky animated color="#202c54">
                <van-tab v-for="lang in langs" :title="lang.label" :name="lang.code" :key="lang.code" class="p-2">
                    <!-- <h2 class="text-center font-bold text-xl mb-8 pt-2">
                        {{ lang.code === 'th' ? 'เลือกประเภทการท่องเที่ยว' : (lang.code === 'en' ? 'Select Tourist
                        Attraction Type' : '选择旅游景点类型') }}
                    </h2>
                    <div class="grid grid-cols-2 gap-3 my-6">
                        <div v-for="item in resBusinessType" :key="item.id"
                            class="flex flex-col items-center justify-center border-2 rounded-sm p-4 cursor-pointer"
                            :class="{
                                '!border-indigo-900 bg-blue-50': selectedItem === item.id,
                                'border-gray-300': selectedItem !== item.id
                            }" @click="selectedItem = item.id">
                            <i :class="item.icon" class="text-2xl mb-2 text-primary-main"></i>
                            <span class="text-sm text-center">
                                {{ item.business_type_name_i18n_parsed?.[lang.code] || '-' }}
                            </span>
                        </div>
                    </div> -->
                    <div class="text-center pt-[4rem]">
                        <Button
                            v-for="(item, index) in resServiceType"
                            :key="item.id"
                            :label="item.service_type_name_i18n[lang.code]"
                            severity="primary"
                            rounded
                            variant="outlined"
                            class="w-full mb-4"
                            :pt="{
                                label: { class: 'text-primary-main' },
                                root:  { class: selectedId === item.id ? '!border-indigo-900 bg-blue-50' : '!border-primary-main' }
                            }"
                            :loading="isloadingAxi"
                            @click="handleServiceTypeClick(item.id)" 
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
