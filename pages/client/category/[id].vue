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
    <div class="bg-zinc-100 min-h-screen">
        <van-nav-bar :title="t('หมวดหมู่')" left-arrow @click-left="navigateTo(`/`)">
        </van-nav-bar>

        <section class="p-4">
            <!-- {{ resCategory }} -->
            <div class="p-4 max-w-2xl mx-auto">
                <div class="bg-white rounded-2xl shadow-lg mb-4" v-for="(item,index) in resCategory" :key="index">
                    <div class="flex overflow-hidden rounded-t-2xl">
                        <img :src="item?.image_cover"
                            alt="food" class="object-cover h-[5rem] md:h-[8rem] lg:-[h-10] w-full rounded-md" />
                    </div>
                    <div class="flex items-start p-4">
                        <div class=" flex-1">
                            <h2 class="text-lg font-bold">{{ item?.shop_name }}</h2>
                            <p class="text-sm text-gray-600">{{ item?.shop_details }}</p>
                            <div class="flex items-center mt-2">
                                <span class="flex items-center text-start text-xs justify-center bg-red-700 rounded-md px-2 text-white font-medium mr-2">
                                    <i class="fa-solid fa-star mr-1"></i> {{ item?.star }}
                                </span>
                                <!-- <span class="text-gray-500 text-sm mr-4">3 รีวิว</span> -->
                                <!-- <span class="text-green-500 font-medium">เปิดอยู่</span> -->
                            </div>
                            <p class="text-sm text-gray-500 mt-2">{{ item?.business_address }}</p>
                        </div>
                        <div class="">
                            <img :src="item?.image_profile"
                                class="w-20 h-20 object-cover rounded-md" alt="">
                        </div>
                    </div>
                    <hr>
                    <div class="p-4 rounded-b-2xl flex justify-between items-center">
                        <!-- <div class="text-green-500 font-medium">เดลิเวอรี่</div> -->
                        <van-tag color="#de6c10">{{ item?.business_type_name }}</van-tag>
                        <Button :label="t('ดูรายละเอียด')" size="small" @click="navigateTo(`/client/information/${item?.id}`)">
                            
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    </div>



</template>

<script setup>
// definePageMeta({
//     middleware: ["auth"],
// });
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import * as dataApi from './api/data.js'

const route = useRoute();
const resCategory = ref([])
const loadCategory = async () => {
    try {
        const res = await dataApi.getBusinessByTypeId(route.params.id);
        resCategory.value = res.data.data;
    } catch (error) {

    }
}

onMounted(() => {
    loadCategory();
})
</script>