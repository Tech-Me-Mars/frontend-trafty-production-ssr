<template>
    <div class="p-4 bg-zinc-100 mt-6" >
        <h2 class="text-gray-800 font-semibold">{{ t('รายการธุรกิจในแหล่งท่องเที่ยว') }}</h2>
        <div class="mt-4 space-y-2">
            <!-- Loop through social_medias -->
            <div v-for="(item, index) in resInfo" :key="item.id"
                class="flex justify-between items-center text-sm card">
                <span>{{ item.business_list_name }}</span>
                <span class="font-semibold">฿{{ item.business_list_price }}</span>
            </div>
        </div>
    </div>
    <div class="flex items-center justify-center p-4 bg-white mb-2 text-sm 
        text-gray-500 cursor-pointer">
            <p>{{ t('ดูเพิ่มเติม') }} <i class="fa-solid fa-chevron-down"></i></p>
        </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const props = defineProps({
    resInfo: {
        type: Array,
        default: () => ([]), // Default to an empty object if no prop is passed
    },
});

</script>