<template>
    <div>
        <div class="relative flex flex-col items-center h-[20rem]">
            <div id="map" class="map-container w-full h-full rounded-lg overflow-hidden"></div>

            <!-- <button type="button"
                                class="absolute bottom-4 right-4 p-2 px-7 border border-black !text-xs bg-white"
                                @click="confirmLocation">
                                <i class="mdi mdi-map-marker-radius text-red-600"></i>ยืนยันตำแหน่ง
                            </button> -->
        </div>
    </div>
</template>

<script setup>
let map = null;
const initMap = () => {
  const mapContainer = document.getElementById('map')
  if (!mapContainer || !window.longdo) return

  map.value = new window.longdo.Map({
    placeholder: mapContainer,
    zoom: 12,
    location: { lat: 13.736717, lon: 100.523186 } // Bangkok
  })
}

onMounted(async () => {
  await useLongdoLoader()
  initMap()
})

</script>
<style>
.radio-green .ant-radio-inner {
    background-color: green !important;
    border-color: green !important;
}

.radio-yellow .ant-radio-inner {
    background-color: rgb(255, 174, 0) !important;
    border-color: rgb(255, 174, 0) !important;
}

.radio-default .ant-radio-inner {
    background-color: #d9d9d9;
    /* default color */
    border-color: #d9d9d9;
    /* default color */
}
</style>