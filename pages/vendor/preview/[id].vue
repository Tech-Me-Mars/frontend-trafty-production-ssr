<template>
    <div class="bg-zinc-100 min-h-screen">
        <LayoutsBaseHeader :title="t('พรีวิว')" :showBack="true" back-to="/">
            <template #right>
                <div class="flex gap-2">
                    <i class="fa-solid fa-xmark cursor-pointer" style="color: white; font-size: 22px;"  @click="navigateTo(`/vendor/manage-business/home/${route.params.id}`)"></i>
                </div>
            </template>
        </LayoutsBaseHeader>

        <section class="max-w-[430px] mx-auto">


            <!-- <van-share-sheet v-model:show="showShare" title="Share" :options="options" /> -->
            <van-share-sheet v-model:show="showShare" :title="t('แชร์')"
                :description="`${t('แชร์')} '${resInfo?.shop_name}' ${t('ไปยังโซเชียลให้เพื่อนคุณรู้')}!`"
                :options="options" @select="onSelect">
                <template #title>
                    <div class="flex items-center gap-2">
                        <img :src="resInfo?.image_profile" alt="Logo" class="w-20 h-20 rounded-xl object-cover" />
                        <span class="text-md font-bold text-gray-800">{{ getI18n(resInfo?.shop_name_i18n, locale)
                            }}</span>
                    </div>
                </template>

                <!-- Custom Description -->
                <template #description>
                    <p class="text-sm text-gray-500  border-b border-gray-300 pb-2">
                        {{ t('แชร์') }} '{{ getI18n(resInfo?.shop_name_i18n, locale)
                        }}' {{ t('ไปยังโซเชียลให้เพื่อนคุณรู้') }}!
                    </p>
                </template>
            </van-share-sheet>
            <div class="relative">
                <img :src="useImage(resInfo?.ImageCoverURL)" alt="Food" class=" w-full h-48 object-cover" />
            </div>
            <div class="p-4  bg-white">
                <!-- Title and Rating Section -->
                <div class="flex items-center justify-between mt-4">
                    <h1 class="text-xl font-semibold">{{ getI18n(resInfo?.shop_name_i18n, locale) }}</h1>
                    <div class="flex items-center text-gray-700">
                        <i class="fa-heart cursor-pointer text-gray-400 transition-all duration-300 transform" :class="{
                            'fa-regular': !isLiked,
                            'fa-solid text-rose-600 scale-110': isLiked,
                        }" @click="toggleLike" style="font-size: 22px"></i>
                    </div>
                </div>
                <div class="flex items-center text-orange-500">
                    <star-review class="mr-1" />
                    <span class="text-sm font-semibold">{{ resInfo?.star }}</span>
                </div>
                <p class="text-sm text-gray-400">{{ getI18n(resInfo?.business_type?.business_type_name_i18n, locale) }}
                </p>
                <p class="text-sm text-gray-700">{{ getI18n(resInfo?.shop_address, locale) }}
                    {{ getI18n(resInfo?.shop_subdistrict?.subdistrict_name_i18n, locale) }}
                    {{ getI18n(resInfo?.shop_district?.district_name_i18n, locale) }} {{
                        getI18n(resInfo?.shop_province?.provinces_name_i18n,locale) }}
                    {{ resInfo?.shop_subdistrict?.zip_code }}
                </p>

                <div class="mt-2 text-sm text-gray-800 space-y-2">
                    <h2 class="text-gray-800 font-semibold">{{ t('รายละเอียด') }}</h2>
                    <p class="text-sm text-gray-600 mt-2">
                        {{ getI18n(resInfo?.shop_details_i18n, locale) }}
                    </p>
                    <p class="flex items-start gap-2">
                        <i class="pi pi-calendar text-yellow-500 text-lg mt-1" />
                        <span>
                            <strong class="text-black">{{ t('วันที่ทำการ') }} :</strong>
                            <span class="text-primary-main">
                                {{
                                    (() => {
                                        try {
                                            const s = getI18n(resInfo?.business_open_date_i18n) || '[]'
                                            const a = JSON.parse(s)
                                return Array.isArray(a) ? a.join(' - ') : ''
                                } catch { return '' }
                                })()
                                }}
                            </span>
                        </span>
                    </p>

                    <p class="flex items-start gap-2">
                        <i class="pi pi-clock text-blue-500 text-lg mt-1" />
                        <span>
                            <strong class="text-black">{{ t('เวลาเปิด - ปิด') }} :</strong>
                            <span class="text-primary-main">{{ resInfo?.shop_time }}</span>
                        </span>
                    </p>

                    <p class="flex items-start gap-2">
                        <i class="pi pi-phone text-green-500 text-lg mt-1" />
                        <span>
                            <strong class="text-black">{{ t('เบอร์ติดต่อ') }} :</strong>
                            <span class="text-primary-main">{{ resInfo?.shop_phone }}</span>
                        </span>
                    </p>
                </div>
                <widgetSocial :resInfo="resInfo?.business_social_media" />
            </div>
            <widgetItemsBusiness class="mt-2" :resInfo="resInfo?.business_list" />


            <!-- <widgetReview :resInfo="resInfo?.comments" /> -->
            <widgetPolicy />

            <!-- <div class="flex justify-center gap-2 mt-10 pb-2" v-if="resProfile?.role_id == 3">
                <Button :loading="isloadingAxi" :label="t('ตรวจสอบมาตรฐาน')" rounded severity="primary" class="" />
                <Button :loading="isloadingAxi" icon="fa-regular fa-comment-dots" :label="t('ติดต่อ')" rounded
                    severity="primary" variant="outlined" class="" :pt="{
                        label: {
                            class: 'text-primary-main'
                        },
                        root: {
                            class: '!border-primary-main'
                        },

                    }" />
            </div> -->
        </section>
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
// definePageMeta({
//     middleware: ["auth"],
// });
import * as dataApi from './api/data.js'
import widgetSocial from './widgets/widget-social.vue';
import widgetItemsBusiness from './widgets/widget-items-business.vue';
import widgetReview from './widgets/widget-review.vue';
import widgetPolicy from './widgets/widget-policy.vue';
const router = useRouter();
const route = useRoute();
import { useI18n } from 'vue-i18n';

const { t, locale, setLocale } = useI18n()
const isloadingAxi = useState('isloadingAxi')
const localPath = useLocalePath();

const showShare = ref(false);
const options = [
    {
        name: 'Facebook',
        icon: '/image/social/facebook.png',
    },
    {
        name: 'Line',
        icon: '/image/social/line.png',
    },
    {
        name: 'Discord',
        icon: '/image/social/discord.png',
    },
    {
        name: 'Twitter',
        icon: '/image/social/twitter.png',
    },
];

// const resProfile = ref({ role_id: null })
// const loadProfile = async () => {
//     try {
//         const res = await dataApi.getProfile();
//         resProfile.value = res.data.data;
//     } catch (error) {
//         console.error(error)
//     }
// }
// Handle selection
const onSelect = (option) => {
    console.log(`Selected: ${option.name}`);
    // Add share logic here, such as opening links or triggering actions
};
onMounted(() => {
    loadDataInfo()
})

const resInfo = ref();
const loadDataInfo = async () => {
    try {
        const res = await dataApi.getBusinessById(route.params.id);
        resInfo.value = res.data.data;

        console.log(resInfo.value)


    } catch (error) {
        console.error(error)
    }
}

const isLiked = ref(false);

const toggleLike = () => {
    isLiked.value = !isLiked.value;
};
</script>
