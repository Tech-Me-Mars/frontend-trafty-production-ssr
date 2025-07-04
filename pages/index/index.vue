<template>
  <!-- <van-nav-bar title="Smart Travel Safety">
    <template #left>
      <img src="/image/logo_erp.png" style="width: 50px;" alt="">
      <drawer-menu />
    </template>
    <template #right>
      <div class="flex items-center gap-2">
        <change-lang-mock />
        <i class="fa-regular fa-circle-user" style="color: white;font-size: 22px;"></i>
      </div>
    </template>
  </van-nav-bar> -->
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
    <!-- <Select v-model="addressLocation" :options="listDropDownAddress" optionLabel="name" optionValue="id" class="w-full">
      <template #dropdownicon>
        <i class="fa-solid fa-location-dot" style="color: #281c74;"></i>
      </template>
    </Select> -->
    <InputGroup>
    <InputText 
      :placeholder="`${t('ชื่อสถานที่')}...`" 
      v-model="text_search" 
      @keyup.enter="search" 
    />
    <Button :label="t('ค้นหา')" icon="pi pi-search" @click="search" />
  </InputGroup>
    <!-- <InputText type="text" v-model="addressLocation" class="w-full">
      <template #dropdownicon>
        <i class="fa-solid fa-location-dot" style="color: #281c74;"></i>
      </template>
      </InputText> -->
    <!-- Image Section -->
    <!-- <div class="mt-4">
      <img src="/image/bg/food-4k.jpg" alt="อาหาร"
        class="rounded-lg shadow-md w-full h-48 md:h-60 lg:h-80 object-cover" />
    </div> -->
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

    <!-- Categories Section -->

    <widgetBusinessType />

    <div class="p-4 mb-4">
      <!-- Section 1: Recommended Places -->

      <widgetRecommentPlace />

      <!-- Section 2: Trending Places -->
      <widgetHotPlace />
      <!-- <div class="mt-8">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-lg font-bold">กำลังเป็นที่นิยม</h2>
          <a href="#" class="hover:underline cursor-pointer">ดูทั้งหมด <i
              class="fa-solid fa-arrow-right rounded-sm text-gray-700"
              style="background-color: #ddd6fe; font-size: 14px;"></i></a>

        </div>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(place, index) in trendingPlaces" :key="index" class="relative h-52">
            <NuxtLink to="/client/information">
              <img :src="place.image" :alt="place.title" class="w-full h-full object-cover rounded-lg" />
            </NuxtLink>
            <div
              class="absolute bottom-0 left-0 bg-gradient-to-t from-black via-transparent to-transparent p-2 rounded-lg w-full">
              <h3 class="text-white text-sm font-bold">{{ place.title }}</h3>
              <p class="text-white text-xs">{{ place.location }}</p>
            </div>
          </div>
        </div>
      </div> -->

    </div>

    <!-- <div class="p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold">สถานที่ใกล้ฉัน</h2>
        <a href="#" class="hover:underline cursor-pointer">ดูทั้งหมด <i
            class="fa-solid fa-arrow-right rounded-sm text-gray-700"
            style="background-color: #ddd6fe; font-size: 14px;"></i></a>

      </div>
      <div class="space-y-4">
        <div v-for="(place, index) in nearbyPlaces" :key="index"
          class="flex items-center space-x-4 border-b pb-4 cursor-pointer">
          <img :src="place.image" :alt="place.name" class="w-16 h-16 object-cover rounded-md" />
          <div class="flex-1">
            <h3 class="text-sm font-bold">{{ place.name }}</h3>
            <p class="text-xs text-gray-500">{{ place.address }}</p>
          </div>
          <div class="flex items-center text-orange-500">
            <i class="fa-solid fa-star mr-1"></i>
            <span class="text-sm font-semibold">{{ place.rating }}</span>
          </div>
        </div>
      </div>
    </div> -->
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
  { src: '/image/bg/food-2.jpg', alt: 'อาหารทะเล' },
  { src: '/image/bg/food-3.jpg', alt: 'ของหวาน' },
  { src: '/image/bg/food-4.jpg', alt: 'เครื่องดื่ม' }
]
const categories = [
  {
    label: "ร้านอาหาร",
    icon: "pi pi-utensils",
    bgColor: "bg-yellow-400",
    image: "https://cdn-icons-png.flaticon.com/512/2819/2819194.png"
  },
  {
    label: "ร้านค้า",
    icon: "pi pi-utensils",
    bgColor: "bg-teal-400",
    image: "https://cdn-icons-png.flaticon.com/512/6203/6203085.png"
  },
  {
    label: "คาเฟ่",
    icon: "pi pi-coffee",
    bgColor: "bg-rose-400",
    image: "https://cdn3d.iconscout.com/3d/premium/thumb/coffee-cup-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--takeaway-disposable-objects-pack-tools-equipment-illustrations-3337261@0.png?f=webp"
  },
  {
    label: "ท่องเที่ยว",
    icon: "pi pi-map",
    bgColor: "bg-orange-400",
    image: "https://cdn-icons-png.flaticon.com/512/1642/1642807.png"
  },
  {
    label: "จิวเวลรี่",
    icon: "pi pi-star",
    bgColor: "bg-blue-500",
    image: "https://cdn-icons-png.flaticon.com/512/8859/8859601.png"
  },
  {
    label: "ร้านอาหาร",
    icon: "pi pi-utensils",
    bgColor: "bg-yellow-400",
    image: "https://cdn-icons-png.flaticon.com/512/2819/2819194.png"
  },
  {
    label: "ร้านค้า",
    icon: "pi pi-utensils",
    bgColor: "bg-teal-400",
    image: "https://cdn-icons-png.flaticon.com/512/6203/6203085.png"
  },
  {
    label: "คาเฟ่",
    icon: "pi pi-coffee",
    bgColor: "bg-rose-400",
    image: "https://cdn3d.iconscout.com/3d/premium/thumb/coffee-cup-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--takeaway-disposable-objects-pack-tools-equipment-illustrations-3337261@0.png?f=webp"
  },
  {
    label: "ท่องเที่ยว",
    icon: "pi pi-map",
    bgColor: "bg-orange-400",
    image: "https://cdn-icons-png.flaticon.com/512/1642/1642807.png"
  },
  {
    label: "จิวเวลรี่",
    icon: "pi pi-star",
    bgColor: "bg-blue-500",
    image: "https://cdn-icons-png.flaticon.com/512/8859/8859601.png"
  },
];

const recommendedPlaces = [
  {
    image: "https://travel.mthai.com/app/uploads/2019/03/48368554_684170075313219_6160628551679737856_n.jpg",
    title: "แกรนด์ แคนยอน คีรี",
    location: "อ.เมืองชลบุรี จ.ชลบุรี",
  },
  {
    image: "https://api.tourismthailand.org/upload/live/content_article/29080-24172.png",
    title: "ตลาดโบราณชากแง้ว",
    location: "อ.บางละมุง จ.ชลบุรี",
  },
  {
    image: "https://travel.mthai.com/app/uploads/2019/03/48368554_684170075313219_6160628551679737856_n.jpg",
    title: "แกรนด์ แคนยอน คีรี",
    location: "อ.เมืองชลบุรี จ.ชลบุรี",
  },
  {
    image: "https://api.tourismthailand.org/upload/live/content_article/29080-24172.png",
    title: "ตลาดโบราณชากแง้ว",
    location: "อ.บางละมุง จ.ชลบุรี",
  },
  // เพิ่มสถานที่แนะนำเพิ่มเติม
];

const trendingPlaces = [
  {
    image: "https://www.bloggang.com/data/n/nernnam/picture/1480837971.jpg",
    title: "น้ำตกชันตาเถร",
    location: "อ.ศรีราชา จ.ชลบุรี",
  },
  {
    image: "https://static.thairath.co.th/media/dFQROr7oWzulq5Fa5LRBlm8zivkk8WX5d3JBd5OLUjZ504KDFjtjfAOvVeFz2Nnam1e.jpg",
    title: "โอ้กะจู๋",
    location: "อ.เมืองชลบุรี จ.ชลบุรี",
  },
  {
    image: "https://www.bangphrachon-sao.go.th/upload/travel_post/file-travel250220_6_459911.jpg",
    title: "อ่างเก็บน้ำบางพระ",
    location: "อ.เมืองชลบุรี จ.ชลบุรี",
  },
  {
    image: "https://cbtthailand.dasta.or.th/upload-file-api/Resources/RelateAttraction/Images/RAT200332/1.jpeg",
    title: "เกาะขาม สัตหีบ",
    location: "อ.เมืองชลบุรี จ.ชลบุรี",
  },
];

const breakpoints = {
  640: { slidesPerView: 2 },
  768: { slidesPerView: 3 },
  1024: { slidesPerView: 4 },
};


const nearbyPlaces = [
  {
    image: "https://static.amarintv.com/media/PJVlR0ljpN9mLUt8KWOVooKd6lxwQFnqMeFyc4WN8PICU4A0N1cammldjgVYS0GgPL.jpg",
    name: "โอ้กะจู๋",
    address: "ต.แสนสุข อ.เมืองชลบุรี จ.ชลบุรี",
    rating: 4.5,
  },
  {
    image: "https://mpics.mgronline.com/pics/Images/563000005860001.JPEG",
    name: "หาดบางแสน",
    address: "ต.แสนสุข อ.เมืองชลบุรี จ.ชลบุรี",
    rating: 3.8,
  },
  {
    image: "https://img.salehere.co.th/p/1200x0/2022/02/05/83qfmkpcoaul.jpg",
    name: "ตลาดน้ำสามวัง",
    address: "ต.นาวังหิน อ.พนัสนิคม จ.ชลบุรี",
    rating: 3.8,
  },
  {
    image: "https://f.tpkcdn.com/images-720/b68ddb658208380a5fe539e9edd4a1fd.jpg",
    name: "ศูนย์ศึกษาธรรมชาติ และอนุรักษ์...",
    address: "ต.นาวังหิน อ.พนัสนิคม จ.ชลบุรี",
    rating: 3.8,
  },
];
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