<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const localPath = useLocalePath();
const router = useRouter();
const route = useRoute();

const props = defineProps({
    resInfo: {
        type: Array,
        default: () => ([]), // Default to an empty object if no prop is passed
    },
});
import { format } from 'date-fns';

const formatDate = (date) => {
    if (!date) return '';

    const d = new Date(date);

    // ใช้ getUTC*() เพื่อป้องกันการแปลง Timezone
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0'); // เดือนเริ่มที่ 0 ต้อง +1
    const day = String(d.getUTCDate()).padStart(2, '0');
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

import * as dataApi from '../api/data.js'
const alertToast = ref({});
// const
const resComment = ref([]);
const avg = ref(0);

const loadComment = async () => {
    try {
        const res = await dataApi.getComments(route.params.id);
        resComment.value = res.data.data?.comments;
        avg.value = res.data.data?.AVG
    } catch (error) {
        console.error(error)
        alertToast.value = {
            title: t('ล้มเหลว'),
            isError: true,
            color: "error",
            msg: error.response?.data?.message || "Error occurred",
            dataError: error,
        };
    }
}
onMounted(() => loadComment());
// const reviews = [
//     {
//         id: 1,
//         name: 'Maya',
//         avatar: 'https://www.unesco.org/sites/default/files/styles/paragraph_medium_desktop/public/2022-04/godwin-angeline-benjo-An7LvVMb6rY-unsplash.jpeg?itok=3STf8JD9',
//         date: '2 mins ago',
//         tag: 'การบริการดีเยี่ยม',
//         comment: 'ไปทานในวันแม่ บรรยากาศดีมากๆ มีกิจกรรมถ่ายรูปให้ภายในร้าน พนักงานบริการดี เข้าใจลูกค้าในวันที่คนเยอะ ใส่ใจลูกค้าดีค่ะ',
//         rating: 5,
//     },
//     {
//         id: 2,
//         name: 'Ploy',
//         avatar: 'https://cdn.goenhance.ai/user/2024/07/19/c0c1400b-abc2-4541-a849-a7e4f361d28d_0.jpg',
//         date: '12-02-2024',
//         tag: 'การบริการแย่',
//         comment: 'อาหารอร่อยเกือบทุกอย่างยกเว้นบางเมนูมีรสออกหวานนำไปหน่อย การบริการไม่ค่อยทั่วถึง',
//         rating: 4,
//     },
//     {
//         id: 3,
//         name: 'Marie',
//         avatar: 'https://cdn.pixabay.com/photo/2024/03/05/20/13/girl-8615258_640.jpg',
//         date: '29-07-2023',
//         tag: 'ไม่ถูกสุขลักษณะ',
//         comment: 'ห้องน้ำไม่สะอาดและไม่เพียงพอต่อการต้อนรับนักท่องเที่ยวค่ะ อาหารแพงมาก',
//         rating: 2,
//     },
// ];

</script>
<template>
    <div class="mb-4">
        <div class="mx-auto bg-white shadow-md rounded-lg">
            <div class="p-4 border-b flex justify-between items-center">
                <div class="flex items-center text-lg font-bold">
                    <star-review class="mr-1" />
                    {{ avg }}
                </div>
                <div class="text-gray-500 text-sm">{{ t('คะแนนรีวิว') }} ({{ resInfo.length }})</div>
                <NuxtLink :to="`/client/ratings/${route.params.id}`" class="text-gray-500 text-sm">{{ t('ดูทั้งหมด') }}
                    <i class="fa-solid fa-chevron-right"></i></NuxtLink>
            </div>

            <div v-for="review in resInfo.slice(0, 3)" :key="review.id" class="p-4 border-b">
                <div class="flex items-center space-x-3">
                    <img :src="review.visitors_img" alt="" class="w-10 h-10 rounded-full object-cover" />
                    <div>
                        <div class="font-semibold">{{ review?.visitors_name }}</div>
                        <div class="text-gray-400 text-sm flex gap-2">
                            <i v-for="star in 5" :key="star" class="fa-solid fa-star"
                                :class="{ 'text-orange-500': star <= Math.floor(review.star_id), 'text-gray-300': star > Math.floor(review.star_id) }"></i>
                            {{ formatDate(review.created_at) }}
                        </div>
                    </div>
                </div>

                <div class="mt-2">
                    <span class="px-2 py-1 text-sm rounded-md bg-orange-100 text-orange-600">
                        {{ review.star_name }}
                    </span>
                </div>

                <p class="mt-2 text-gray-700 text-sm leading-relaxed">
                    {{ review.comment }}
                </p>
                <!-- แสดงรูปภาพแบบแนวนอน -->
                <div class="flex space-x-2 overflow-x-auto mt-2" v-if="review?.business_img?.length > 0">
                    <Image v-for="img in review?.business_img" :key="img.id" :src="img.business_comment_img"
                        alt="Business Image" style="width: 7rem; height: 7rem;"  preview />
                </div>
            </div>
        </div>
    </div>
</template>