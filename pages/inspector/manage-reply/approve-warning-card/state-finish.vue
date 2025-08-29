<template>
    <div class="bg-zinc-100 min-h-screen flex flex-col items-center">
        <!-- เนื้อหากึ่งกลางจอ -->
        <div class="flex-1 flex flex-col items-center justify-center px-6 py-10 max-w-md w-full">
            <!-- ไอคอนผลลัพธ์ -->
            <!-- <div class="flex items-center justify-center w-16 h-16 rounded-full mx-auto shadow-sm"
                :class="isSuccess ? 'bg-green-600' : 'bg-rose-600'">
                <i :class="isSuccess ? 'fa-solid fa-check' : 'fa-solid fa-xmark'" class="text-white text-3xl" />
            </div> -->

            <!-- หัวข้อ -->
            <h1 class="text-2xl font-semibold mt-6 text-center">
                {{ t('อนุมัติใบเตือนสำเร็จ') }}

            </h1>

            <!-- วงกลมเปอร์เซ็นต์ -->
            <div class="mt-6 relative inline-flex items-center justify-center">
                <svg :width="size" :height="size" class="-rotate-90">
                    <!-- track -->
                    <circle :cx="center" :cy="center" :r="radius" class="stroke-zinc-200" :stroke-width="stroke"
                        fill="transparent" />
                    <!-- progress -->
                    <circle :cx="center" :cy="center" :r="radius"
                        :class="isSuccess ? 'stroke-green-500' : 'stroke-rose-500'" :stroke-width="stroke"
                        stroke-linecap="round" fill="transparent" :stroke-dasharray="circumference"
                        :stroke-dashoffset="dashOffset" />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center">
                        <div class="text-2xl font-bold">{{ percent }}%</div>
                    </div>
                </div>
            </div>

            <!-- ผลลัพธ์ผ่าน/ไม่ผ่าน -->
            <div class="mt-4 text-center">
                <p v-if="IsPass" class="text-xl font-semibold" :class="'text-green-600'">
                    {{ isPass ? t('ผ่านเกณฑ์') : t('ไม่ผ่านเกณฑ์') }}
                </p>
                <p v-else class="text-xl font-semibold" :class="'text-rose-600'">
                    {{ isPass ? t('ผ่านเกณฑ์') : t('ไม่ผ่านเกณฑ์') }}
                </p>

                <!-- คำอธิบาย -->
                <p class="text-zinc-600 mt-2 leading-relaxed">
                    <template >
                        <!-- {{ t('ผ่านการรับรองและอนุมัติตามมาตรฐานความปลอดภัยแล้ว') }} -->
                        {{ isPass ? t('ผ่านการรับรองและอนุมัติตามมาตรฐานความปลอดภัยแล้ว') :
                            t('ไม่ผ่านการรับรองและอนุมัติตามมาตรฐานความปลอดภัย') }}
                    </template>
                    <!-- <template v-else>
                        {{ detailDisplay || t('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง') }}
                    </template> -->
                </p>
            </div>
        </div>

        <!-- ปุ่มล่าง -->
        <div class="w-full max-w-md px-6 pb-8">
            <Button :loading="isloadingAxi" :label="t('กลับสู่หน้าหลัก')" class="w-full" severity="secondary" outlined
                rounded :pt="{
                    label: {
                        class: 'text-primary-main'
                    },
                    root: {
                        class: '!border-primary-main'
                    },

                }" @click="navigateTo(`/inspector/manage-reply`)" />
        </div>
    </div>
</template>

<script setup>
definePageMeta({ middleware: ['auth'] })

import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const route = useRoute()
const isloadingAxi = useState('isloadingAxi')

/* ---------- อ่านค่า route.query แบบยืดหยุ่น ---------- */
const q = route.query || {}

const toBool = (v) => {
    if (typeof v === 'boolean') return v
    if (v == null) return false
    const s = String(v).toLowerCase()
    return s === 'true' || s === '1' || s === 'yes'
}
// const toNum = (v, d = 0) => {
//     const n = Number(v)
//     return Number.isFinite(n) ? n : d
// }
const toNum = (v, d = 0) => {
    if (v == null) return d
    // ดึงเฉพาะตัวเลข ทศนิยม และเครื่องหมายลบ (ลอก % และตัวอักษรอื่นออก)
    const cleaned = String(v).replace(/[^\d.-]/g, '')
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : d
}

const state = (q.state || 'success').toString().toLowerCase() // 'success' | 'error'
const isSuccess = state === 'success'
const isPass = toBool(q.IsPass) // ใช้ตัดสินข้อความ "ผ่าน/ไม่ผ่าน"

const percent = computed(() => {
    // หาก IsPass = false ให้ใช้ ScorePercentFailed, ถ้า true ใช้ ScorePercent
    const raw = isPass ? (q.ScorePercent ?? q.score_percent) : (q.ScorePercentFailed ?? q.score_percent_failed)
    return Math.max(0, Math.min(100, Math.round(toNum(raw, 0))))
})

const titleDisplay = computed(() => q.title || (isSuccess ? t('อนุมัติใบเตือนสำเร็จ') : t('เกิดข้อผิดพลาด')))
const detailDisplay = computed(() => q.detail || '')

/* ---------- SVG circle metrics ---------- */
const size = 160          // px
const stroke = 12         // px
const center = size / 2
const radius = center - stroke / 2
const circumference = 2 * Math.PI * radius
const dashOffset = computed(() => circumference - (percent.value / 100) * circumference)
</script>

<style scoped>
/* ไม่มีสไตล์พิเศษเพิ่มเติม */
</style>