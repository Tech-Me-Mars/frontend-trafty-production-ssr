<template>
    <div class="bg-zinc-100 h-screen">
      <LayoutsBaseHeader :title="t('ค้นหาสถานที่ใกล้คุณ')" :showBack="true" />
  
      <!-- เนื้อหาเลื่อนในพื้นที่จอ (กันทับ toolbar ด้วย padding-bottom แบบ dynamic) -->
      <main
        class="max-w-lg mx-auto h-[calc(100vh-56px)] overflow-y-auto"
        :style="{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 80px)' }"
      >
        <van-tabs v-model:active="activeTab" color="#202c54" animated swipeable>
          <!-- TAB 1: เลือกตำแหน่งจากแผนที่ -->
          <van-tab :title="t('เลือกจากแผนที่')">
            <div class="p-3">
              <client-only>
                <!-- แผนที่ (เตี้ยลงให้เห็นลิสต์ได้มากขึ้น) -->
                <div class="h-64 sm:h-80 bg-white rounded-xl border border-zinc-200 overflow-hidden">
                  <div id="map" class="w-full h-full"></div>
                </div>
  
                <!-- ปุ่มเครื่องมือ -->
                <div class="flex flex-wrap gap-2 mt-3">
                  <button type="button" class="px-3 h-10 rounded-lg border text-sm hover:bg-zinc-50"
                          @click="tryGetGeolocation">
                    <i class="fa-solid fa-location-crosshairs mr-2"></i>{{ t('ใช้ตำแหน่งของฉัน') }}
                  </button>
                  <button type="button" class="px-3 h-10 rounded-lg border text-sm hover:bg-zinc-50"
                          @click="addMarkerAtCenter">
                    <i class="fa-solid fa-location-dot mr-2"></i>{{ t('ปักหมุดตำแหน่งตรงกลาง') }}
                  </button>
                </div>
  
                <!-- lat/lon -->
                <p class="text-sm text-zinc-700 mt-2" v-if="latitude && longitude">
                  {{ t('ตำแหน่งที่เลือก') }}:
                  <b>{{ Number(latitude).toFixed(6) }}, {{ Number(longitude).toFixed(6) }}</b>
                  <span v-if="accuracy" class="text-zinc-500"> (±{{ Math.round(accuracy) }} ม.)</span>
                </p>
                <p class="text-red-600 mt-1" v-if="geoError">{{ geoError }}</p>
  
                <!-- สถานที่ใกล้คุณ -->
                <section class="mt-4">
                  <div class="flex items-center justify-between">
                    <h3 class="font-semibold">{{ t('สถานที่ใกล้คุณ') }}</h3>
                    <span v-if="nearbyResults.length" class="text-xs text-zinc-500">
                      {{ t('ทั้งหมด') }}: {{ nearbyResults.length }}
                    </span>
                  </div>
  
                  <div v-if="isNearbyLoading" class="grid gap-3 sm:grid-cols-2">
                    <div v-for="n in 6" :key="n" class="bg-white rounded-xl border p-3 animate-pulse">
                      <div class="h-24 bg-zinc-200 rounded mb-2"></div>
                      <div class="h-4 w-2/3 bg-zinc-200 rounded mb-1"></div>
                      <div class="h-3 w-1/2 bg-zinc-200 rounded"></div>
                    </div>
                  </div>
  
                  <div v-else-if="nearbyResults.length === 0" class="text-zinc-500">
                    {{ t('ยังไม่มีผลลัพธ์') }}
                  </div>
  
                  <div v-else class="mt-2">
                    <div class="grid gap-3 sm:grid-cols-2">
                      <button
                        v-for="(p, i) in nearbyResults"
                        :key="p.id || i"
                        type="button"
                        class="group text-left bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all p-3"
                      >
                        <img :src="p.image_profile_url || placeholderImg" :alt="getI18n(p.shop_name_i18n)"
                             class="w-full h-24 object-cover rounded-lg" />
                        <div class="mt-2">
                          <p class="font-semibold text-zinc-900 line-clamp-1">
                            {{ getI18n(p.shop_name_i18n) }}
                          </p>
                          <p class="text-xs text-zinc-500 line-clamp-1">
                            <i class="pi pi-map-marker mr-1"></i>{{ getI18n(p.shop_address_i18n) }}
                          </p>
                        </div>
                        <div class="mt-2 flex items-center text-amber-500">
                          <i class="fa-solid fa-star mr-1"></i>
                          <span class="text-sm font-medium">{{ p.star ?? 0 }}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </section>
              </client-only>
            </div>
          </van-tab>
  
          <!-- TAB 2: เลือกจังหวัด -->
          <van-tab :title="t('เลือกจังหวัด')">
            <div class="max-w-3xl mx-auto p-3">
              <!-- <div class="bg-white rounded-xl border border-zinc-200 p-3 sm:p-4">
                <label class="block text-sm text-zinc-700 mb-1">{{ t('จังหวัด') }}</label>
                <Dropdown
                  v-model="selectedProvinceId"
                  :options="provinceOptions"
                  optionLabel="label"
                  optionValue="id"
                  :filter="true"
                  :showClear="true"
                  filterPlaceholder="ค้นหา..."
                  :placeholder="t('เลือกจังหวัด')"
                  class="w-full"
                />
                <div class="mt-3">
                  <Button
                    :label="t('บันทึกการตั้งค่า')"
                    icon="fa-regular fa-floppy-disk"
                    severity="primary"
                    class="w-full"
                    :disabled="!selectedProvinceId || isProvinceLoading"
                    @click="saveProvinceAndShowMock"
                  />
                  <span v-if="isProvinceLoading" class="ml-3 text-sm text-zinc-500">{{ t('กำลังเตรียมข้อมูล...') }}</span>
                </div>
              </div> -->
  
              <section class="mt-5">
                <h3 class="font-semibold mb-2">{{ t('สถานที่ที่แนะนำ') }}</h3>
                <div v-if="provinceResults.length === 0" class="text-zinc-500">
                  {{ t('กรุณาเลือกจังหวัดก่อน') }}
                </div>
                <div v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div v-for="(p, i) in provinceResults" :key="p.id || i"
                       class="bg-white rounded-xl border border-zinc-200 p-3 shadow-sm">
                    <img :src="p.image" :alt="p.name" class="w-full h-28 object-cover rounded-lg" />
                    <p class="mt-2 font-semibold text-zinc-900 line-clamp-1">{{ p.name }}</p>
                    <p class="text-xs text-zinc-500 line-clamp-1">
                      <i class="pi pi-map-marker mr-1"></i>{{ p.address }}
                    </p>
                    <div class="mt-2 flex items-center text-amber-500">
                      <i class="fa-solid fa-star mr-1"></i><span class="text-sm font-medium">{{ p.rating }}</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </van-tab>
        </van-tabs>
      </main>
  
      <!-- 🔻 FIXED Bottom Toolbar (เฉพาะแท็บ 1) -->
      <div
        v-if="activeTab === 0"
        class="fixed bottom-0 left-0 right-0 z-30 border-t bg-white/95 backdrop-blur supports-backdrop-blur:bg-white/80"
        :style="{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }"
      >
        <div class="max-w-lg mx-auto px-3 py-2">
          <div class="flex items-center gap-2">
            <span class="text-sm text-zinc-600 shrink-0">{{ t('รัศมี') }}:</span>
            <InputGroup class="w-full sm:w-auto">
              <Dropdown
                v-model="radius_km"
                :options="radiusOptions"
                optionLabel="label"
                optionValue="value"
                class="w-full sm:w-40"
                :placeholder="t('เลือกรัศมี')"
              />
              <Button
                :label="t('บันทึกตำแหน่ง')"
                icon="fa-regular fa-floppy-disk"
                severity="primary"
                :disabled="!latitude || !longitude || isNearbyLoading"
                @click="saveLocationAndFetch"
              />
            </InputGroup>
            <span class="text-sm text-zinc-500 ml-auto" v-if="isNearbyLoading">
              {{ t('กำลังค้นหาสถานที่ใกล้คุณ...') }}
            </span>
          </div>
        </div>
      </div>

      <!-- 🔻 FIXED Bottom Toolbar (แท็บ 2) -->
      <div
        v-if="activeTab === 1"
        class="fixed bottom-0 left-0 right-0 z-30 border-t bg-white/95 backdrop-blur supports-backdrop-blur:bg-white/80"
        :style="{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }"
      >
      <!-- <InputGroup class="w-full sm:w-auto">
              <Dropdown
                v-model="radius_km"
                :options="radiusOptions"
                optionLabel="label"
                optionValue="value"
                class="w-full sm:w-40"
                :placeholder="t('เลือกรัศมี')"
              />
              <Button
                :label="t('บันทึกตำแหน่ง')"
                icon="fa-regular fa-floppy-disk"
                severity="primary"
                :disabled="!latitude || !longitude || isNearbyLoading"
                @click="saveLocationAndFetch"
              />
            </InputGroup> -->

        <div class="max-w-lg mx-auto px-3 py-2">
          <div class="flex items-center gap-2">
            <span class="text-sm text-zinc-600 shrink-0">{{ t('จังหวัด') }}:</span>


            <InputGroup class="w-full sm:w-auto ml-auto">
                            <Dropdown
                  v-model="selectedProvinceId"
                  :options="provinceOptions"
                  optionLabel="label"
                  optionValue="id"
                  :filter="true"
                  :showClear="true"
                  filterPlaceholder="ค้นหา..."
                  :placeholder="t('เลือกจังหวัด')"
                  class="w-full"
                />
              <Button
                :label="t('บันทึกการตั้งค่า')"
                icon="fa-regular fa-floppy-disk"
                severity="primary"
                :disabled="!selectedProvinceId || isProvinceLoading"
                @click="saveProvinceAndShowMock"
              />
            </InputGroup>

            <span class="text-sm text-zinc-500" v-if="isProvinceLoading">
              {{ t('กำลังเตรียมข้อมูล...') }}
            </span>
          </div>
        </div>
      </div>
    </div>
</template>
  
<script setup>
definePageMeta({ middleware: ['auth'] })

import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import * as dataApi from './api/data.js'
import { useEncryptedCookie } from '~/composables/useEncryptedCookie'
// import Dropdown from 'primevue/dropdown'
// import InputGroup from 'primevue/inputgroup'

const { t, locale } = useI18n()

/* ---------- Tabs ---------- */
const activeTab = ref(0)
watch(activeTab, (to) => {
  if (to === 0 && map) {
    nextTick(() => {
      try { map.resize() } catch {}
      if (latitude.value && longitude.value) {
        map.location({ lat: +latitude.value, lon: +longitude.value }, true)
      }
    })
  }
})

/* ---------- Helpers ---------- */
const getI18n = (val) => {
  if (!val) return ''
  try {
    const obj = typeof val === 'string' ? JSON.parse(val) : val
    return obj?.[locale.value] ?? obj?.th ?? Object.values(obj || {})[0] ?? ''
  } catch {
    return String(val)
  }
}
const placeholderImg = 'https://dummyimage.com/640x360/e5e7eb/9ca3af.jpg&text=+'

/* ---------- TAB 1: Map Pick ---------- */
const latitude = ref(null)
const longitude = ref(null)
const accuracy = ref(null)
const geoError = ref('')
const isNearbyLoading = ref(false)
const nearbyResults = ref([])

const radius_km = ref(2)
const radiusOptions = [
  { value: 1,  label: '1 กม.'  },
  { value: 2,  label: '2 กม.'  },
  { value: 5,  label: '5 กม.'  },
  { value: 10, label: '10 กม.' },
  { value: 15, label: '15 กม.' },
  { value: 30, label: '30 กม.' },
  { value: 50, label: '50 กม.' },
]

let map = null
let mapReady = false
let userMarker = null
let nearPlaceMarkers = []

const waitFor = (cond, { interval = 50, timeout = 8000 } = {}) =>
  new Promise((resolve, reject) => {
    const start = Date.now()
    ;(function tick() {
      if (cond()) return resolve()
      if (Date.now() - start > timeout) return reject(new Error('timeout'))
      setTimeout(tick, interval)
    })()
  })

const waitForMapDOM = () => waitFor(() => !!document.getElementById('map'))
const waitForLongdo = () => waitFor(() => !!(window.longdo && window.longdo.Map))
const waitForMapReady = () => waitFor(() => mapReady === true)

const useLongdoLoader = async () => {
  if (window.longdo?.Map) return
  await new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://api.longdo.com/map3/?key=f38639d33e37f4e422cd8085d997d55f'
    s.async = true
    s.onload = resolve
    s.onerror = () => reject(new Error('failed to load longdo'))
    document.head.appendChild(s)
  })
}

const initMap = async () => {
  await nextTick()
  await waitForMapDOM()
  await waitForLongdo()

  const mapDiv = document.getElementById('map')
  if (!mapDiv) throw new Error('#map not found')

  map = new window.longdo.Map({
    placeholder: mapDiv,
    zoom: 12,
    location: { lat: 13.736717, lon: 100.523186 }
  })

  await new Promise((resolve) => {
    if (map?.Event?.bind) {
      map.Event.bind('ready', () => { mapReady = true; resolve() })
    } else { mapReady = true; resolve() }
  })
}

const clearNearPlaceMarkers = () => {
  if (!map) return
  try { nearPlaceMarkers.forEach(m => map.Overlays.remove(m)) } catch {}
  nearPlaceMarkers = []
}

const setMarker = (lat, lon, title = t('ตำแหน่งที่เลือก')) => {
  if (!map) return
  if (userMarker) {
    try { map.Overlays.remove(userMarker) } catch {}
    userMarker = null
  }
  userMarker = new longdo.Marker(
    { lat, lon },
    { title, detail: `Lat: ${lat}, Lon: ${lon}`, icon: { url: '/image/marker-blue.png', size: { width: 40, height: 45 } } }
  )
  map.Overlays.add(userMarker)
  map.location({ lat, lon }, true)
  latitude.value = lat
  longitude.value = lon
}

const addMarkerAtCenter = () => {
  if (!map) return
  const c = map.location()
  setMarker(c.lat, c.lon, t('ตำแหน่งตรงกลาง'))
}

const getCurrentPositionAsync = (opts) => new Promise((res, rej) => {
  if (!('geolocation' in navigator)) return rej({ code: 0, message: 'no geolocation' })
  navigator.geolocation.getCurrentPosition(res, rej, opts)
})

const tryGetGeolocation = async () => {
  geoError.value = ''
  try {
    const pos = await getCurrentPositionAsync({ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 })
    const lat = pos.coords.latitude
    const lon = pos.coords.longitude
    accuracy.value = pos.coords.accuracy ?? null
    await waitForMapReady()
    setMarker(lat, lon, t('ตำแหน่งของฉัน'))
  } catch (err) {
    const code = err?.code
    if (code === 1) geoError.value = t('คุณปฏิเสธสิทธิ์ตำแหน่ง: ปักหมุดเองหรือค้นหาสถานที่ได้')
    else if (code === 2) geoError.value = t('ไม่สามารถระบุตำแหน่งได้')
    else if (code === 3) geoError.value = t('ขอตำแหน่งนานเกินไป กรุณาลองใหม่')
    else geoError.value = t('เกิดข้อผิดพลาดไม่ทราบสาเหตุ')
  }
}

const plotNearbyMarkers = (list = []) => {
  // if (!map || !window.longdo) return
  // clearNearPlaceMarkers()
  map.Overlays.clear(); // ลบ markers เดิมก่อนเพิ่มใหม่

  list.forEach((p) => {
    const lat = (p.latitude)
    const lon = (p.longitude)
    const marker = new longdo.Marker(
      { lat, lon },
      { title:"", detail: `Lat: ${lat}, Lon: ${lon}`, icon: { url: '/image/marker-blue.png', size: { width: 40, height: 45 } } }
    )
    map.Overlays.add(marker)
  })
}

const fetchNearby = async () => {
  if (!Number.isFinite(latitude.value) || !Number.isFinite(longitude.value)) return
  isNearbyLoading.value = true
  try {
    const payload = { latitude:  latitude.value, longitude: longitude.value }
    const res = await dataApi.getNearPlace(payload)
    const arr = Array.isArray(res?.data?.data) ? res.data.data : []

    nearbyResults.value = arr
    plotNearbyMarkers(arr)
  } catch (e) {
    console.error(e)
    nearbyResults.value = []
    clearNearPlaceMarkers()
  } finally {
    isNearbyLoading.value = false
  }
}

const saveLocationAndFetch = async () => {
  if (!latitude.value || !longitude.value) return
  await useEncryptedCookie('lat', latitude.value)
  await useEncryptedCookie('lon', longitude.value)
  await useEncryptedCookie('radius_location_id', radius_km.value)
  await fetchNearby()
}

/* ---------- TAB 2: Province ---------- */
const selectedProvinceId = ref(null)
const provinceResults = ref([])
const isProvinceLoading = ref(false)

const provinceOptions = ref([
  { id: 50, label: 'เชียงใหม่' },
  { id: 83, label: 'ภูเก็ต' }
])

const provinceLabel = computed(() => {
  const found = provinceOptions.value.find(p => p.id === selectedProvinceId.value)
  return found?.label || t('ยังไม่ได้เลือก')
})

const saveProvinceAndShowMock = async () => {
  isProvinceLoading.value = true
  try {
    await useEncryptedCookie('province_id_current_location_id', selectedProvinceId.value)
    provinceResults.value = await mockFetchProvincePlaces(selectedProvinceId.value)
  } catch (e) {
    console.error(e)
  } finally {
    isProvinceLoading.value = false
  }
}

function mockFetchProvincePlaces (provinceId) {
  const base = provinceId === 50
    ? [
        { id: 'cm-01', name: 'ดอยสุเทพ', address: 'อ.เมือง เชียงใหม่', rating: 4.7, image: 'https://www.silpa-mag.com/wp-content/uploads/2024/03/Cover-14.jpg' },
        { id: 'cm-02', name: 'ถนนนิมมาน', address: 'อ.เมือง เชียงใหม่', rating: 4.4, image: 'https://www.interhome.co.th/administrator/resources/images/news/news_523_1.jpeg' },
        { id: 'cm-03', name: 'ดอยอินทนนท์', address: 'จอมทอง เชียงใหม่', rating: 4.9, image: 'https://thesunsight.com/wp-content/uploads/2020/01/DIntha-02-copy.jpg' },
        { id: 'cm-04', name: 'วัดเจดีย์หลวง', address: 'อ.เมือง เชียงใหม่', rating: 4.6, image: 'https://thesunsight.com/wp-content/uploads/2020/01/WATJDL-02-copy.jpg' },
      ]
    : [
        { id: 'pk-01', name: 'แหลมพรหมเทพ', address: 'ราไวย์ ภูเก็ต', rating: 4.7, image: 'https://media.lul.la/wp-content/uploads/2023/06/21095711/laem-phrom-thep-03.jpg' },
        { id: 'pk-02', name: 'หาดป่าตอง',   address: 'กะทู้ ภูเก็ต',   rating: 4.3, image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/11/63/50/patong.jpg?w=900&h=500&s=1' },
        { id: 'pk-03', name: 'เมืองเก่าภูเก็ต', address: 'อ.เมือง ภูเก็ต', rating: 4.6, image: 'https://www.pullmanphuketpanwa.com/wp-content/uploads/sites/51/2022/07/Phuket-Tour-Company-01-1024x683.jpg' },
        { id: 'pk-04', name: 'เกาะไม้ท่อน',   address: 'ภูเก็ต',       rating: 4.8, image: 'https://palanla.com/ckeditor/upload/files/id37/domestic_location/Mai%20Thon%20Island/001.jpg' },
      ]
  return Promise.resolve(base)
}

onMounted(async () => {
  await useLongdoLoader()
  await initMap()
})
</script>
  
<style scoped>
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>
