<style scoped>
.van-nav-bar {
    --van-nav-bar-background: #281c74;
    --van-nav-bar-text-color: white;
    --van-nav-bar-icon-color: white;
    --van-nav-bar-title-text-color: white;
    --van-nav-bar-height: 70px;
}
</style>

<template>

    <LayoutsBaseHeader :title="t('รายการโปรด')" :showBack="true"
        :showMenu="false"></LayoutsBaseHeader>


    <div class="p-4">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-4xl mx-auto">
            <div v-for="card in cards" :key="card.id" class="bg-white shadow-lg rounded-lg overflow-hidden">
                <img :src="card.image" :alt="card.title" class="w-full h-48 object-cover" />
                <div class="p-4">
                    <div class="flex justify-between items-start">
                        <h3 class="text-lg font-bold break-words max-w-[80%]">{{ card.title }}</h3>
                        <button class="ml-2">
                            <i class="fa-solid fa-heart" style="color: red; font-size: 22px;"></i>
                        </button>
                    </div>
                    <p class="text-gray-500 text-sm">{{ card.location }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const router = useRouter();

// Cards ไม่ต้องแปล
const cards = [
    {
        id: 1,
        title: 'หาดวอนนภา',
        location: 'อ.เมืองชลบุรี จ.ชลบุรี',
        image: 'https://wikicommunity.sac.or.th/files/community/913/thumb-64bbdbab5ca7d.jpg',
    },
    {
        id: 2,
        title: 'ตลาดน้ำ 4 ภาค',
        location: 'อ.เมืองชลบุรี จ.ชลบุรี',
        image: 'https://files.thailandtourismdirectory.go.th/assets/upload/2017/11/22/2017112213b2aa4b2e88f61887581b06d1292145151526.jpg',
    },
];
</script>
