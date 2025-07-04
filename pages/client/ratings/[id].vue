<template>
    <div class=" bg-white min-h-screen">
        <van-nav-bar :title="t('รายละเอียด')" left-arrow
            @click-left="navigateTo(`/client/information/${route.params.id}`)">

        </van-nav-bar>
        <section class="p-4">

            <!-- Overall Rating -->
            <div class="flex items-center justify-between border-b pb-4">
                <div>
                    <span class="text-2xl font-bold">{{ scoreShop }} <star-review /> </span>
                    <span class="text-gray-500 text-sm">{{ t('คะแนนรีวิว') }} ({{ resComment.length }})</span>
                </div>
                <Button :loading="isloadingAxi" @click="navigateTo(`/client/review/${route.params.id}`)"
                    :label="t('เขียนรีวิว')" variant="outlined" rounded icon="fa fa-plus" class="" :pt="{
                        label: {
                            class: 'text-indigo-900'
                        },
                        icon: {
                            class: 'text-indigo-900'
                        }
                    }">

                </Button>
            </div>

            <!-- Rating Breakdown -->
            <div class="mt-4 space-y-1">
                <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="flex items-center">
                    <span class="text-sm text-gray-600">{{ star }}</span>
                    <div class="flex-1 mx-2 bg-gray-200 rounded h-2">
                        <div class="h-2 bg-orange-500 rounded" :style="{ width: starPercentage[star] + '%' }"></div>
                    </div>
                    <span class="text-sm text-gray-600">
                        {{ starCounts[star] || 0 }}
                    </span>
                </div>
            </div>

            <!-- Reviews -->

            <div class="mt-6">
                <h2 class="text-lg font-semibold mb-4">{{ t('รีวิวทั้งหมด') }}</h2>

                <!-- Loop through reviews -->
                <div v-for="review in resComment" :key="review.id" class="pb-2 border-b mb-5">
                    <div class="flex items-center space-x-3">
                        <img :src="review?.visitors_img" alt="" class="w-10 h-10 rounded-full object-cover" />
                        <div>
                            <div class="font-semibold">{{ review.visitors_name }}</div>
                            <div class="text-gray-400 text-sm flex gap-2">
                                <i v-for="star in 5" :key="star" class="fa-solid fa-star"
                                    :class="{ 'text-orange-500': star <= Math.floor(review.star_id), 'text-gray-300': star > Math.floor(review.star_id) }"></i>
                                <span>{{ formatDate(review.date) }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-2">
                        <span class="px-2 py-1 text-sm rounded-md bg-orange-100 text-orange-600">
                            {{ review.star_name }}
                        </span>
                    </div>

                    <p class="mt-2 text-gray-700 text-sm leading-relaxed">
                        {{ review?.comment }}
                    </p>
                    <div class="flex space-x-2 overflow-x-auto mt-2" v-if="review?.business_img?.length > 0">
                    <Image v-for="img in review?.business_img" :key="img.id" :src="img.business_comment_img"
                        alt="Business Image" style="width: 7rem; height: 7rem;"  preview />
 
                </div>
                </div>
            </div>

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
//   middleware: ["auth"],
// });
const isloadingAxi = useState("isloadingAxi");
import * as dataApi from './api/data.js'

const route = useRoute();
const router = useRouter();
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const localPath = useLocalePath();

const scoreShop = ref(0)
const resComment = ref([])
const loadComment = async () => {
    try {
        const res = await dataApi.getComment(route.params.id)

        resComment.value = res.data.data?.comments;
        scoreShop.value = res.data.data?.AVG

        countStars();
    } catch (error) {
        console.error();
    }
}
// เก็บจำนวนคะแนนแต่ละระดับ
const starCounts = reactive({});

// จำนวนรีวิวทั้งหมด
const totalReviews = computed(() => Object.values(starCounts).reduce((a, b) => a + b, 0));

// คำนวณเปอร์เซ็นต์คะแนน
const starPercentage = computed(() => {
    const percentages = {};
    for (let star = 1; star <= 5; star++) {
        const count = starCounts[star] || 0;
        percentages[star] = (count / totalReviews.value) * 100 || 0;
    }
    return percentages;
});

// ฟังก์ชันคำนวณจำนวนคะแนน
const countStars = () => {
    resComment.value.forEach((review) => {
        if (!starCounts[review.star_id]) {
            starCounts[review.star_id] = 0;
        }
        starCounts[review.star_id]++;
    });
};

const token = localStorage.getItem("token");

onMounted(() => {
    loadComment();
})

import { format } from 'date-fns';
import { th } from 'date-fns/locale'; // สำหรับภาษาไทย
const formatDate = (date) => {
    if (!date) {
        return ''
    }
    return format(new Date(date), "dd MMMM yyyy, HH:mm", { locale: th });
}
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
//         rating: 3,
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