<template>
  <LayoutsBaseHeader title="" :showBack="false" :showIconWeb="false" :showMenu="true">
    <template #left>
      <img src="/image/logo_erp.png" style="width: 50px;" alt="">
      <h1 class="text-base font-semibold truncate" >Smart Travel Safety</h1>
    </template>
    <template #right>
      <div class="flex items-center gap-2">
        <change-lang-mock />
        <i class="fa-regular fa-circle-user" style="color: white;font-size: 22px;"></i>
      </div>
    </template>
</LayoutsBaseHeader>

  <div class="p-4">
    <InputGroup>
    <InputText 
      :placeholder="`${t('ชื่อสถานที่')}...`" 
      v-model="text_search" 
      @keyup.enter="search" 
    />
    <Button :label="t('ค้นหา')" icon="pi pi-search" @click="search" />
  </InputGroup>

    <div class="mt-4">
    <Swiper
      :modules="[Autoplay, Navigation, Pagination]"
      :loop="true"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      :pagination="{ clickable: true, dynamicBullets: true }"
      :navigation="false"
      class="rounded-lg shadow-md overflow-hidden"
    >
      <SwiperSlide v-for="(img, i) in images" :key="i">
        <img
          :src="img.src"
          :alt="img.alt"
          class="w-full h-48 md:h-60 lg:h-80 object-cover"
        />
      </SwiperSlide>
    </Swiper>
  </div>


    <widgetBusinessType />

    <div class="p-4 mb-4">
      <widgetRecommentPlace />
      <widgetHotPlace />

    </div>

    <widgetNearPlace/>


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
import widgetBusinessType from './widgets/widget-business-type.vue';
import widgetRecommentPlace from './widgets/widget-recommend-place.vue';
import widgetHotPlace from './widgets/widget-hot-place.vue';
import widgetNearPlace from './widgets/widget-near-place.vue';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useI18n } from 'vue-i18n';
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
const { t } = useI18n();
const images = [
  { src: '/image/bg/food-4k.jpg', alt: 'อาหารไทย' },
  { src: '/image/bg/food-4k.jpg', alt: 'อาหารไทย' },
  { src: '/image/bg/food-4k.jpg', alt: 'อาหารไทย' },
]
import { useRouter } from "vue-router";
const text_search = ref("");
const router = useRouter();

const search = () => {
  if (text_search.value.trim()) {
    router.push(`/client/search?find=${text_search.value}`);
  }
};

// Drawer visibility state
const drawervisible = useState('drawervisible');
</script>

<style>
.swiper-pagination-bullet {
  background-color: white;
  border: 2px solid #d1d5db; /* สีเทา */
  opacity: 1;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 0 4px;
}

.swiper-pagination-bullet-active {
  background-color: #1d4ed8; /* เปลี่ยนเป็นสี active ที่ต้องการ เช่น สีฟ้าน้ำเงิน */
  border-color: #1d4ed8;     /* เปลี่ยนสีขอบตอน active */
}
.menu-item i {
  color: #281c74;
}

.menu-item:hover i {
  color: #7d6be3;
}

/**** Add custom TailwindCSS styles here if needed ****/
</style>