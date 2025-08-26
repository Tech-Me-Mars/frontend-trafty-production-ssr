<template>
    <div class="bg-zinc-100 min-h-screen">
        <!-- <van-nav-bar :title="t('รายละเอียด')" left-arrow @click-left="navigateTo('/')">
            <template #right>
                <div class="flex gap-2">
                    <i @click="showShare = true" class="fa-solid fa-arrow-up-from-bracket"
                        style="color: white;font-size: 22px;"></i>
                </div>
            </template>
</van-nav-bar> -->
        <LayoutsBaseHeader :title="t('รายละเอียด')" :showBack="true" backTo="/" :showMenu="false">
            <template #right>
                <div class="flex gap-2">
                    <i @click="showShare = true" class="fa-solid fa-arrow-up-from-bracket"
                        style="color: white;font-size: 22px;"></i>
                </div>
            </template>
        </LayoutsBaseHeader>



        <!-- <van-share-sheet v-model:show="showShare" title="Share" :options="options" /> -->
        <van-share-sheet v-model:show="showShare" :title="t('แชร์')"
            :description="`${t('แชร์')} '${resInfo?.shop_name}' ${t('ไปยังโซเชียลให้เพื่อนคุณรู้')}!`"
            :options="options" @select="onSelect">
            <template #title>
                <div class="flex items-center gap-2">
                    <img :src="resInfo?.image_profile" alt="Logo" class="w-20 h-20 rounded-xl object-cover" />
                    <span class="text-md font-bold text-gray-800">{{ resInfo?.shop_name }}</span>
                </div>
            </template>

            <!-- Custom Description -->
            <template #description>
                <p class="text-sm text-gray-500  border-b border-gray-300 pb-2">
                    {{ t('แชร์') }} '{{ resInfo?.shop_name }}' {{ t('ไปยังโซเชียลให้เพื่อนคุณรู้') }}!
                </p>
            </template>
        </van-share-sheet>
        <div class="relative">
            <img :src="resInfo?.image_cover" alt="Food" class="rounded-t-lg w-full h-48 object-cover" />
        </div>
        <div class="p-4  bg-white">
            <!-- Title and Rating Section -->
            <div class="flex items-center justify-between mt-4">
                <h1 class="text-xl font-semibold">{{ resInfo?.shop_name }}</h1>
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
            <p class="text-sm text-gray-400">{{ resInfo?.business_type_name }}</p>
            <p class="text-sm text-gray-700">{{ resInfo?.shop_address }}</p>

            <!-- Details Section -->
            <!-- <div class="mt-4">
                <h2 class="text-gray-800 font-semibold">{{ t('รายละเอียด') }}</h2>
                <p class="text-sm text-gray-600 mt-2">
                    {{ resInfo?.shop_details }}
                </p>
                <div class="mt-2 text-sm text-gray-600">
                    <p><strong>{{ t('วันที่ทำการ') }}:</strong>
                        <span v-for="(item, index) in resInfo?.shop_days" :key="index">
                            {{ item?.day_name }}<span v-if="index !== resInfo.shop_days.length - 1">,</span>
                        </span>
                    </p>
                    <p><strong>{{ t('เวลาเปิด - ปิด') }}:</strong> {{ resInfo?.shop_time }}</p>
                    <p><strong>{{ t('เบอร์ติดต่อ') }}:</strong> {{ resInfo?.shop_phone }}</p>
                </div>
            </div> -->
            <div class="mt-2 text-sm text-gray-800 space-y-2">
                <h2 class="text-gray-800 font-semibold">{{ t('รายละเอียด') }}</h2>
                <p class="text-sm text-gray-600 mt-2">
                    {{ resInfo?.shop_details }}
                </p>
                <p class="flex items-start gap-2">
                    <i class="pi pi-calendar text-yellow-500 text-lg mt-1" />
                    <span>
                        <strong class="text-black">{{ t('วันที่ทำการ') }} :</strong>
                        <span class="text-primary-700">
                            <template v-for="(item, index) in resInfo?.shop_days" :key="index">
                                {{ item?.day_name }}<span v-if="index !== resInfo.shop_days.length - 1"> - </span>
                            </template>
                        </span>
                    </span>
                </p>

                <p class="flex items-start gap-2">
                    <i class="pi pi-clock text-blue-500 text-lg mt-1" />
                    <span>
                        <strong class="text-black">{{ t('เวลาเปิด - ปิด') }} :</strong>
                        <span class="text-primary-700">{{ resInfo?.shop_time }}</span>
                    </span>
                </p>

                <p class="flex items-start gap-2">
                    <i class="pi pi-phone text-green-500 text-lg mt-1" />
                    <span>
                        <strong class="text-black">{{ t('เบอร์ติดต่อ') }} :</strong>
                        <span class="text-primary-700">{{ resInfo?.shop_phone }}</span>
                    </span>
                </p>
            </div>
            <widgetSocial :resInfo="resInfo?.social_medias" />
        </div>
        <widgetItemsBusiness :resInfo="resInfo?.business_lists" />


        <widgetReview :resInfo="resInfo?.comments" />
        <widgetPolicy />

        <div class="flex justify-center gap-2 mt-10 pb-2" v-if="role_name == 'police' || role_name == 'Admin'">
            <Button :loading="isloadingAxi"
                @click="navigateTo(`/inspector/inspec-vender/${route.params.id}/safety-form/form1/`)"
                :label="t('ตรวจสอบมาตรฐาน')" rounded severity="primary" class="" />
            <Button :loading="isloadingAxi" icon="fa-regular fa-comment-dots" :label="t('ติดต่อ')" rounded
                severity="primary" variant="outlined" class="" :pt="{
                    label: {
                        class: 'text-primary-main'
                    },
                    root: {
                        class: '!border-primary-main'
                    },

                }" />
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
// definePageMeta({
//     middleware: ["auth"],
// });
import { useEncryptedCookie, useDecryptedCookie, useClearEncryptedCookie } from '~/composables/useEncryptedCookie'
import * as dataApi from './api/data.js'
import widgetSocial from './widgets/widget-social.vue';
import widgetItemsBusiness from './widgets/widget-items-business.vue';
import widgetReview from './widgets/widget-review.vue';
import widgetPolicy from './widgets/widget-policy.vue';
const router = useRouter();
const route = useRoute();
const isloadingAxi = useState("isloadingAxi");
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
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

const role_name = ref(null)
const loadProfile = async () => {
    try {
        role_name.value = await useDecryptedCookie('role_name');
    } catch (error) {
        console.error(error)
    }
}
// Handle selection
const onSelect = (option) => {
    console.log(`Selected: ${option.name}`);
    // Add share logic here, such as opening links or triggering actions
};

onMounted(async () => {
    loadDataInfo()
    loadProfile()
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
