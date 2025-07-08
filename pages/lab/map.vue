<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const runtimeConfig = useRuntimeConfig()
console.log('runtimeConfig', runtimeConfig)
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
        // const res = await dataApi.searchBusinessByname(searchQuery.value);
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

onMounted(async () => {
  const res = await fetch('/api/load-longdo') // 🔒 จะได้ script ที่ฝัง key มาแล้ว
  const scriptCode = await res.text()

  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.text = scriptCode
  document.head.appendChild(script)

  // รอจน window.longdo โหลดเสร็จ
  const waitForLongdo = () => new Promise(resolve => {
    const check = () => {
      if (window.longdo) resolve()
      else setTimeout(check, 100)
    }
    check()
  })

  await waitForLongdo()
  initMap()
})

const initMap = () => {
  const mapContainer = document.getElementById('map')
  if (!mapContainer || !window.longdo) return

  map.value = new window.longdo.Map({
    placeholder: mapContainer,
    zoom: 12,
    location: { lat: 13.736717, lon: 100.523186 } // Bangkok
  })
}



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
</script>
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
    <div >dd
  <div id="map" class="map-container" style="width: 40rem; height: 40rem;"></div>
    </div>
</template>
