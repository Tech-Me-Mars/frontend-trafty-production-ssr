<script setup>
// definePageMeta({ middleware: ['auth'] })

import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
const { t, locale, setLocale } = useI18n()

// ---- State หลัก ----
const latitude = ref(null)
const longitude = ref(null)
const accuracy = ref(null)
const geoError = ref('')

const radius_km = ref(2)              // รัศมีค้นหา (กม.)
// --- helpers: waiters ---
const waitFor = (cond, { interval = 50, timeout = 8000 } = {}) =>
    new Promise((resolve, reject) => {
        const start = Date.now()
        const tick = () => {
            if (cond()) return resolve()
            if (Date.now() - start > timeout) return reject(new Error('waitFor timeout'))
            setTimeout(tick, interval)
        }
        tick()
    })
const waitForMapDOM = () => waitFor(() => !!document.getElementById('map'))
const waitForLongdo = () => waitFor(() => !!(window.longdo && window.longdo.Map))
const waitForMapReady = () => waitFor(() => mapReady === true)
// ---- Longdo Map ----
let map = null
let mapReady = false
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
            map.Event.bind('ready', () => {
                mapReady = true
                resolve()
            })
        } else {
            // เผื่อไม่มี Event API
            mapReady = true
            resolve()
        }
    })
}

const clearMarkers = () => { if (map) map.Overlays.clear() }
import { useEncryptedCookie, useDecryptedCookie, useClearEncryptedCookie } from '~/composables/useEncryptedCookie'

const setMarker = async (lat, lon, title = t('ตำแหน่งที่เลือก')) => {
    if (!map) return
    clearMarkers()
    const marker = new longdo.Marker(
        { lat, lon },
        { title, detail: `Lat: ${lat}, Lon: ${lon}`, icon: { url: '/image/marker-blue.png', size: { width: 40, height: 45 } } }
    )
    map.Overlays.add(marker)
    map.location({ lat, lon }, true)
    latitude.value = lat
    longitude.value = lon
    await useEncryptedCookie('latitude', lat)
    await useEncryptedCookie('longitude', lon)
}

// ปักหมุดที่จุดกึ่งกลางแผนที่ (ปุ่ม)
const addMarkerAtCenter = () => {
    if (!map) return
    const center = map.location()
    setMarker(center.lat, center.lon, t('ตำแหน่งตรงกลาง'))
}

// --- เปลี่ยน geolocation ให้เป็น Promise ---
const getCurrentPositionAsync = (options) =>
    new Promise((resolve, reject) => {
        if (!('geolocation' in navigator)) return reject({ code: 0, message: 'no geolocation' })
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })

// --- Geolocation (await ได้จริง + รอ map พร้อมก่อนค่อย setMarker) ---
const tryGetGeolocation = async () => {
    geoError.value = ''
    try {
        const pos = await getCurrentPositionAsync({ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 })
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        accuracy.value = pos.coords.accuracy ?? null

        await waitForMapReady()        // <- สำคัญ: รอ map พร้อมจริง
        setMarker(lat, lon, t('ตำแหน่งของฉัน'))
    } catch (err) {
        const code = err?.code
        if (code === 1) geoError.value = t('คุณปฏิเสธสิทธิ์ตำแหน่ง: ปักหมุดเองหรือค้นหาสถานที่ได้')
        else if (code === 2) geoError.value = t('ไม่สามารถระบุตำแหน่งได้')
        else if (code === 3) geoError.value = t('ขอตำแหน่งนานเกินไป กรุณาลองใหม่')
        else geoError.value = t('เกิดข้อผิดพลาดไม่ทราบสาเหตุ')
    }
}
// ---- ค้นหาสถานที่ใกล้ฉัน (เรียก API ฝั่งคุณ) ----
// *เปลี่ยน $fetch เป็น AxiosService.request ได้ทันที*



// debounce เพื่อกันยิงถี่
const debounce = (fn, delay = 450) => {
    let t
    return (...args) => {
        if (t) clearTimeout(t)
        t = setTimeout(() => fn(...args), delay)
    }
}


// ---- AutoComplete (Longdo Search) ----
const textSearchMap = ref(null)
const resLocation = ref([])

const onLocationSearchSelect = (opt) => {
    if (opt && opt.lat && opt.lon) {
        setMarker(opt.lat, opt.lon, opt.name || t('ตำแหน่งที่เลือก'))
    }
}

// เผื่อบางเวอร์ชันของ PrimeVue ใช้ v-model อย่างเดียว
// watch(textSearchMap, (val) => {
//     if (val && typeof val === 'object' && val.lat && val.lon) {
//         setMarker(val.lat, val.lon, val.name || t('ตำแหน่งที่เลือก'))
//     }
// })

const search = (event) => {
    setTimeout(() => {
        if (!event.query?.trim()?.length) {
            resLocation.value = []
            return
        }
        if (event.query.length >= 4) {
            fetch(`https://search.longdo.com/mapsearch/json/search?keyword=${encodeURIComponent(event.query)}&limit=20&key=cffdefc2f61c2b38e32abe2c7b7e19cd`)
                .then(r => r.json())
                .then(result => {
                    resLocation.value = (result?.data || []).map(item => ({
                        name: item.name,
                        address: item.address || t('ไม่มีที่อยู่'),
                        lat: item.lat,
                        lon: item.lon,
                        id: item.id
                    }))
                })
                .catch(console.error)
        }
    }, 250)
}

onMounted(async () => {
    await useLongdoLoader()   // ของคุณ
    await initMap()           // รอจน #map + longdo + ready ครบ
    await tryGetGeolocation() // ตอนนี้ await ทำงานจริง และ map พร้อมแล้ว
})

// util
const formatDist = (m) => {
    if (m == null) return '-'
    const km = m / 1000
    return km >= 1 ? `${km.toFixed(2)} กม.` : `${Math.round(m)} ม.`
}
const openExternal = (url) => { try { window.open(url, '_blank') } catch { } }
</script>

<template>
    <div class="bg-zinc-100 min-h-screen">
        <LayoutsBaseHeader :title="t('ข้อมูลธุรกิจในแหล่งท่องเที่ยว')">
            <template #left>
                <ButtonIconBack />
            </template>
        </LayoutsBaseHeader>

        <div class="p-4 max-w-6xl mx-auto">
            <client-only>
                <label class="block font-medium mb-1">{{ t('พิกัดสถานที่ท่องเที่ยวหรือธุรกิจ') }}</label>

                <div class="grid gap-3 md:grid-cols-3 mb-3">
                    <AutoComplete v-model="textSearchMap" forceSelection optionLabel="name"
                        :placeholder="`${t('ค้นหาสถานที่ใกล้เคียง')}...`" :suggestions="resLocation" @complete="search"
                        @item-select="({ value }) => onLocationSearchSelect(value)" class="md:col-span-2"
                        inputClass="custom-border w-full">
                        <template #option="slotProps">
                            <div class="flex flex-col p-2 border-b border-gray-200 w-full">
                                <span class="font-medium text-primary-main">{{ slotProps.option?.name }}</span>
                                <span class="text-sm text-gray-500">{{ slotProps.option?.address }}</span>
                            </div>
                        </template>
                    </AutoComplete>

                    <div>
                        <label class="block text-sm text-zinc-700 mb-1">{{ t('รัศมี (กม.)') }}</label>
                        <select v-model.number="radius_km" class="w-full rounded-lg border-zinc-300 p-2">
                            <option :value="1">1 {{ t('กม') }}.</option>
                            <option :value="2">2 {{ t('กม') }}.</option>
                            <option :value="5">5 {{ t('กม') }}.</option>
                            <option :value="10">10 {{ t('กม') }}.</option>
                        </select>
                    </div>
                </div>

                <div class="flex gap-2 mb-2">
                    <Button icon="fa-solid fa-location-crosshairs" size="small" outlined @click="tryGetGeolocation"
                        :label="t('ใช้ตำแหน่งของฉัน')" />
                    <Button icon="fa-solid fa-location-dot" size="small" outlined @click="addMarkerAtCenter"
                        :label="t('ปักหมุดตำแหน่งตรงกลาง')" />
                </div>

                <p class="text-sm text-zinc-700 mb-2" v-if="latitude && longitude">
                    {{ t('ตำแหน่งปัจจุบัน') }}:{{ latitude }} || {{ longitude }}
                    <!-- <b>{{ Number(latitude).toFixed(6) }}, {{ Number(longitude).toFixed(6) }}</b>
                    <span v-if="accuracy" class="text-zinc-500"> (±{{ Math.round(accuracy) }} ม.)</span> -->
                </p>
                <p class="text-red-600 mb-2" v-if="geoError">{{ geoError }}</p>

                <div class="h-[30rem] mb-4">
                    <div id="map" class="map-container w-full h-full rounded-lg overflow-hidden"></div>
                </div>

                <!-- รายการสถานที่ใกล้ฉัน -->

            </client-only>
        </div>
    </div>
</template>
