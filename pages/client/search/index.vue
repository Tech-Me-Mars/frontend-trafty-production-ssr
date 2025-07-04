<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as dataApi from './api/data.js';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const route = useRoute();
const router = useRouter();

const text_search = ref(route.query.find || ""); // ให้ text_search ตรงกับค่าพารามิเตอร์
const searchQuery = ref(route.query.find || "");
const results = ref([]);
const center_camera = ref({ lat: 13.736717, lon: 100.523186 })  // Default Bangkok

let map = null;
const selectedPlace = ref(null); // เก็บข้อมูลสถานที่ที่ถูกเลือก
const showModalDetailMap = ref(false)
const fetchResults = async () => {
    if (!searchQuery.value) return;

    try {
        console.log('searchQuery.value',searchQuery.value)
        const res = await dataApi.searchBusinessByname(searchQuery.value);
        results.value = await res.data.data.map_data;
        center_camera.value = await res.data.data?.center;
        setTimeout(() => {
        updateMarkers();
        }, 500);
        // อัปเดต markers ทุกครั้งที่มีผลลัพธ์ใหม่
        if (results.value.length == 0) {
            clearMarkers()
        }
    } catch (error) {
        clearMarkers()
        console.error("Error fetching search results:", error);
    }
};

const clearMarkers = () => {
    if (map) {
        map.Overlays.clear(); // ลบ Marker ทั้งหมดบนแผนที่
    }
};

// ฟังก์ชันสำหรับค้นหา
const search = () => {
    if (text_search.value.trim()) {
        router.push({ path: "/client/search", query: { find: text_search.value } });
    }
};

// โหลดข้อมูลเมื่อเปิดหน้า
// onMounted(fetchResults);

// ถ้าพารามิเตอร์ใน URL เปลี่ยน ให้ค้นหาใหม่
watch(() => route.query.find, (newFind) => {
    searchQuery.value = newFind;
    text_search.value = newFind; // อัปเดตช่องค้นหาให้ตรงกับ URL
    fetchResults();
});

// ################### RENDER MAP ##########################
const loadLongdoMap = () => {
    return new Promise((resolve, reject) => {
        if (window.longdo) {
            resolve(window.longdo);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://api.longdo.com/map3/?key=f38639d33e37f4e422cd8085d997d55f";
        script.async = true;
        script.onload = () => resolve(window.longdo);
        script.onerror = () => reject(new Error("Failed to load Longdo Map API"));
        document.head.appendChild(script);
    });
};

const initMap = async () => {
    try {
        const longdo = await loadLongdoMap();
        const mapContainer = document.getElementById("map");

        if (!mapContainer) {
            console.error("Element #map not found");
            return;
        }

        map = new longdo.Map({
            placeholder: mapContainer,
            zoom: 12,
            location: { lat: 13.736717, lon: 100.523186 }, // Default Bangkok
        });
        setTimeout(() => {
            fetchResults();
        }, 700);

    } catch (error) {
        console.error("Error loading Longdo Map:", error);
    }
};



const updateMarkers = () => {
    if (!map) return;

    map.Overlays.clear(); // ลบ markers เดิมก่อนเพิ่มใหม่
    console.log("results", results.value);

    results.value.forEach((item) => {
        if (item.latitude && item.longitude) {
            const marker = new longdo.Marker(
                { lat: item.latitude, lon: item.longitude },
                {
                    clickable:false,
                    all_detail: item,
                    // clickable: true,
                    title: item.shop_name,
                    // detail: `<strong>${item.shop_name}</strong><br>${item.shop_address}<br><img src="${item.image_cover}" width="100px"/>`,
                    visibleRange: { min: 5, max: 20 },
                    icon: {
                        url: "/image/marker-red.png", // ไอคอนที่กำหนดเอง
                        size: { width: 50, height: 45 }
                    }
                }
            );

            // เพิ่ม event คลิกหมุด
            // marker.on("click", () => {
            //     selectedPlace.value = item; // เก็บข้อมูลสถานที่ที่เลือก
            //     showModalDetailMap.value = true; // แสดง popup
            // });

            map.Overlays.add(marker);
        }
    });
    map.Event.bind(longdo.EventName.OverlayClick, function (overlay) {
        console.log(overlay)
        selectedPlace.value = overlay._geojson.properties.all_detail
        if (selectedPlace.value) {
            setTimeout(() => {
                showModalDetailMap.value = true; 
            }, 200);
        }

    });
    if (center_camera.value) {
        map.location(center_camera.value);
        // map.zoom(12); // กำหนดระดับซูมเป็น 12
    }
};

onMounted(() => {
    initMap();
});

const responsiveOptions = ref([
    {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
    }
]);
</script>
<template>
    <div class="bg-zinc-100 min-h-screen">
        <LayoutsBaseHeader :title="t('ค้นหาสถานที่')" :showBack="true" backTo="/"
        :showMenu="false"></LayoutsBaseHeader>


        <section class="p-4">
            <InputGroup>
                <InputText :placeholder="`${t('ชื่อสถานที่')}...`" v-model="text_search" @keyup.enter="search" />
                <Button :label="t('ค้นหา')" icon="pi pi-search" @click="search" />
            </InputGroup>

            <h2>{{ t('ผลการค้นหา') }}: "{{ searchQuery }}"</h2>

            <div v-if="results.length === 0">
                <p>{{ t('ไม่พบข้อมูล') }}</p>
            </div>
            <div>
                <div class="h-[30rem] mb-2">
                    <div id="map" class="map-container" style="width: 100%; height: 100%;"></div>
                </div>
                <van-popup v-model:show="showModalDetailMap" round position="bottom" :style="{ height: '70%' }">
                    <div v-if="selectedPlace" class=" bg-zinc-100">
                        <!-- Header Section -->
                        <div class="flex items-center space-x-4 bg-primary-main p-3">
                            <img v-if="selectedPlace.image_profile" :src="selectedPlace.image_profile"
                                alt="Profile Image"
                                class="w-20 h-20 rounded-full object-cover shadow-lg border border-gray-300" />
                            <div>
                                <h3 class="text-xl font-bold text-white">{{ selectedPlace.shop_name }}</h3>
                                <van-tag size="large" color="#ed7300">
                                    {{ selectedPlace.business_type_name }}
                                </van-tag>
                            </div>
                        </div>

                        <!-- Shop Details -->
                        <div class="">
                            <p class="text-gray-700 border-b-2 p-2">
                                <i class="fa-solid fa-map-marker-alt text-blue-500"></i>
                                <span class="ml-2 font-semibold">{{ selectedPlace.shop_address }}</span>
                            </p>
                            <p class="text-gray-700 border-b-2 p-2">
                                <i class="fa-solid fa-phone text-green-500"></i>
                                <span class="ml-2">{{ selectedPlace.shop_phone }}</span>
                            </p>
                            <p class="text-gray-700 border-b-2 p-2">
                                <i class="fa-solid fa-circle-info text-yellow-500"></i>
                                <span class="ml-2">{{ selectedPlace.shop_details }}</span>
                            </p>
                        </div>

                        <!-- Shop Days Section -->
                        <div class="border-b-2 p-2 flex">
                            <h4 class="text-md font-semibold text-gray-700 mr-2">{{ t('วันทำการ') }}:</h4>
                                <span v-for="(item, index) in selectedPlace?.shop_days" :key="index">
                            {{ item?.day_name }}<span v-if="index !== selectedPlace.shop_days.length - 1">,</span>
                        </span>
                          
                        </div>

                        <!-- Image Gallery -->
                        <div v-if="selectedPlace.business_images?.length" class=" border-b-2 p-2">
                            <h4 class="text-md font-semibold text-gray-700 mb-2">{{ t('ภาพร้านค้า') }}:</h4>
                            <div class="flex space-x-3 overflow-x-auto">
                                <img v-for="(image, index) in selectedPlace.business_images" :key="index"
                                    :src="image.business_img" alt="Business Image"
                                    class="w-24 h-24 object-cover rounded-lg shadow-md border border-gray-300" />
                            </div>
                        </div>

                        <!-- Social Media Links -->
                        <div v-if="selectedPlace.social_medias?.length" class=" border-b-2 p-2">
                            <!-- <h4 class="text-md font-semibold text-gray-700 mb-2">โซเชียลมีเดีย:</h4> -->
                            <div class="flex flex-wrap gap-3">
                                <a v-for="(social, index) in selectedPlace.social_medias" :key="index"
                                    :href="social.social_link" target="_blank"
                                    class="flex items-center px-3 py-2 text-sm font-medium rounded-lg shadow-md transition"
                                    :style="{ backgroundColor: social.bg_color }">

                                    <!-- ไอคอนสีขาว -->
                                    <i :class="social.icon" class="text-white text-xl mr-2"></i>

                                    <!-- แสดงชื่อ Social Media -->
                                    <span class="text-white font-semibold">{{ social?.social_name }}</span>

                                </a>
                            </div>
                        </div>

                        <div class="p-2 flex justify-center" >
                        <Button :label="t('ดูรายละเอียด')" size="small" @click="navigateTo(`/client/information/${selectedPlace.id}`)"  rounded />

                        </div>
                    </div>
                </van-popup>
            </div>
            <!-- <ul v-else>
            <li v-for="item in results" :key="item.id">
                {{ item.shop_name }}
            </li>
        </ul> -->
        </section>
    </div>
</template>
