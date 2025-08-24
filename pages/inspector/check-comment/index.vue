<template>
  <div class="min-h-screen bg-zinc-100">
    <LayoutsBaseHeader :title="t('ตรวจสอบคอมเม้นต์')" :showBack="true" back-to="/inspector/home" />
    <section class="max-w-[430px] mx-auto">

      <!-- Filter bar -->
      <section class="">
        <div class="bg-white px-3 py-5 flex items-center justify-between">
          <h2 class="text-md font-semibold">
            {{ t('คอมเมนต์ทั้งหมด') }} ({{ comments.length }})
          </h2>
          <Dropdown v-model="selectedStar" :options="starOptions" optionLabel="label" optionValue="value"
            :placeholder="t('เลือกคะแนน')" class="w-48" :loading="isLoading" @change="loadComments" />
        </div>
      </section>

      <!-- Skeleton while loading -->
      <div v-if="isLoading" class="p-4 space-y-4">
        <div v-for="i in 3" :key="i" class="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
          <div class="flex items-center justify-between p-4 border-b border-gray-100">
            <span class="text-gray-700 font-medium">{{ t('สถานะการแสดงผล') }}</span>
            <Skeleton width="3.25rem" height="1.6rem" borderRadius="9999px" />
          </div>
          <div class="p-4 border-b border-gray-100">
            <div class="flex items-center space-x-3">
              <Skeleton shape="circle" size="3rem" />
              <div class="flex-1">
                <Skeleton width="60%" height="1rem" />
                <Skeleton class="mt-2" width="40%" height="0.85rem" />
              </div>
            </div>
          </div>
          <div class="p-4">
            <div class="flex items-start space-x-3">
              <Skeleton shape="circle" size="2.5rem" />
              <div class="flex-1">
                <Skeleton width="30%" height="0.9rem" />
                <Skeleton class="mt-2" width="45%" height="0.9rem" />
                <Skeleton class="mt-4" width="95%" height="0.9rem" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="!comments.length" class="p-4">
        <div class="bg-white rounded-sm border border-gray-200 p-6 text-center text-gray-500">
          {{ t('ยังไม่มีคอมเมนต์ตามเงื่อนไข') }}
        </div>
      </div>

      <!-- Comments list -->
      <div v-else class="p-4 space-y-4">
        <div v-for="item in comments" :key="item.id"
          class="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
          <!-- Header: สถานะการแสดงผล -->
          <div class="flex items-center justify-between px-4 py-3">
            <span class="text-gray-800 font-semibold text-[15px]">
              {{ t('สถานะการแสดงผล') }}
            </span>
            <div class="">
              <ConfirmSwitch v-model="isOpen" :message-on="t('คุณต้องการเปิดรีวิวนี้ให้ผู้อื่นเห็นหรือไม่?')"
                :message-off="t('คุณต้องการปิดรีวิวนี้ใช่หรือไม่?')" :disabled="isSaving"
                @update:modelValue="toggleReviewVisibility" />
              <!-- <ConfirmSwitch v-model="item.isVisible" :message-on="`${t('คุณต้องการเปิดรีวิวนี้ให้ผู้อื่นเห็นหรือไม่?')}`"
                            :message-off="`${t('คุณต้องการปิดรีวิวนี้ใช่หรือไม่?')}`"
                            /> -->
            </div>
          </div>

          <!-- Place -->
          <div class="px-4 py-3 border-t border-gray-100 border-b">
            <div class="flex items-center gap-3">
              <img :src="useImage(item.place.image)" alt="สถานที่"
                class="w-12 h-12 rounded-sm object-cover flex-shrink-0" />
              <div class="min-w-0">
                <h3 class="font-semibold text-gray-900 text-base leading-5 mb-1">
                  {{ item.place.name }}
                </h3>
                <p class="text-xs text-gray-500 leading-5 truncate" :title="item.place.location">
                  {{ item.place.location }}
                </p>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="px-4 pt-3 pb-4">
            <div class="flex items-start gap-3">
              <img :src="item.authorAvatar" alt="ผู้รีวิว" class="w-10 h-10 rounded-full object-cover mt-[2px]" />
              <div class="flex-1 min-w-0">
                <!-- Row: ชื่อ + ดาว + วันที่ -->
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="font-medium text-gray-800"> {{ item.author }} </span>
                    <div class="flex items-center gap-0.5 -mt-[1px]">
                      <van-icon v-for="i in 5" :key="i" name="star" :color="i <= item.rating ? '#f07404' : '#e5e7eb'"
                        size="14" />
                    </div>
                  </div>
                  <span class="text-xs text-gray-400 flex-shrink-0">{{ item.date }}</span>
                </div>

                <!-- Badge หมวด -->
                <span class="inline-block text-[13px] bg-orange-100 text-orange-600 px-3 py-[4px] rounded-full mb-3">
                  {{ item.category }}
                </span>

                <!-- รีวิว -->
                <p class="text-gray-700 text-sm leading-6">
                  {{ item.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <NotifyMessage v-model:show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
      :life="toast.life" />
    <NotificationPopup v-model:visible="notification.visible" :state="notification.state" :title="notification.title"
      :detail="notification.detail" :timeout="notification.timeout" :redirect-url="notification.redirectUrl"
      :auto-close="notification.autoClose" @close="onNotificationClose" />

  </div>
</template>

<script setup>
// basic
definePageMeta({ middleware: ['auth'] })
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
// import Dropdown from 'primevue/dropdown'
import Skeleton from 'primevue/skeleton'
import * as dataApi from './api/data.js'

const { t, locale } = useI18n()
const toast = ref({ show: false, type: null, title: null, message: null, life: null })
const notification = reactive({ visible: false, state: 'success', title: '', detail: '', timeout: 0, redirectUrl: null, autoClose: true })

// ===== Helpers =====
const lang = computed(() => String(locale.value || 'th'))
const parseMaybeJSON = (v) => {
  if (!v) return null
  if (typeof v === 'object') return v
  try { return JSON.parse(v) } catch { return v }
}

const fmtDate = (iso) => {
  try {
    const d = new Date(iso)
    const dd = `${d.getDate()}`.padStart(2, '0')
    const mm = `${d.getMonth() + 1}`.padStart(2, '0')
    const yy = d.getFullYear()
    return `${dd}-${mm}-${yy}`
  } catch { return '' }
}

// ===== State =====
const starOptions = [
  { value: 1, label: 'คะแนน 1 ดาว' },
  { value: 2, label: 'คะแนน 2 ดาว' },
  { value: 3, label: 'คะแนน 3 ดาว' },
  { value: 4, label: 'คะแนน 4 ดาว' },
  { value: 5, label: 'คะแนน 5 ดาว' },
]
const selectedStar = ref(1)            // 0 = ทั้งหมด
const isLoading = ref(false)
const comments = ref([])

/** map API -> UI */
const mapItem = (raw) => {
  const biz = raw.business || {};
  const avatar = 'https://i.pravatar.cc/80?img=5';

  return {
    id: raw.id,
    isVisible: Boolean(raw.status),
    rating: Number(raw.star ?? biz.star ?? 0),
    author: 'ผู้ใช้ไม่ระบุ',
    authorAvatar: avatar,
    date: fmtDate(raw.created_at),
    category: getI18n(raw.star_name_i18n) || t('การบริการ'),
    content: getI18n(raw.comment_i18n) || '',
    place: {
      name: getI18n(raw.shop_name_i18n) || '-',
      location: buildLocation(biz), // << รวม addr + ตำบล + อำเภอ + จังหวัด
      image: biz.ImageCoverURL || biz.image_cover || 'https://picsum.photos/120/120?blur=2'
    }
  };
};
const buildLocation = (biz) => {
  const addr = getI18n(biz?.shop_address_i18n) || getI18n(biz?.business_address_i18n) || '';

  const subdistrict =
    getI18n(biz?.shop_subdistrict?.subdistrict_name_i18n) ||
    getI18n(biz?.business_subdistrict?.subdistrict_name_i18n) || '';

  const district =
    getI18n(biz?.shop_district?.district_name_i18n) ||
    getI18n(biz?.business_district?.district_name_i18n) || '';

  const province =
    getI18n(biz?.shop_province?.provinces_name_i18n) ||
    getI18n(biz?.business_province?.provinces_name_i18n) || '';

  // แบบไม่ใส่คำนำหน้า
  return [addr, subdistrict, district, province].filter(Boolean).join(' ');

  // ถ้าต้องการคำนำหน้า (ต./อ./จ.) ให้ใช้บรรทัดด้านล่างแทน:
  // const withLabel = [
  //   addr,
  //   subdistrict && `ต.${subdistrict}`,
  //   district && `อ.${district}`,
  //   province && `จ.${province}`,
  // ].filter(Boolean).join(' ');
  // return withLabel;
};

// ===== API actions =====
const loadComments = async () => {
  try {
    isLoading.value = true
    const res = await dataApi.getCommentByStar(selectedStar.value || 0)
    const rows = Array.isArray(res?.data?.data) ? res.data.data : []
    comments.value = rows.map(mapItem)
  } catch (error) {
    console.error(error)
    toast.value = {
      show: true,
      type: 'danger',
      title: t('ผิดพลาด'),
      message: error?.response?.data?.message || t('เกิดข้อผิดพลาด'),
      life: 4000
    }
  } finally {
    isLoading.value = false
  }
}

const isOpen = ref(false)     // ค่าเริ่มต้นมาจาก item.isVisible
const isSaving = ref(false)
const commentId = ref()  // ไอดีคอมเมนต์ของการ์ดนี้
const toggleReviewVisibility = async (newVal) => {
  if (isSaving.value) return
  isSaving.value = true
  const prev = !newVal              // ของเดิมก่อน toggle

  try {
    await updateCommentVisibility(commentId.value, { status: newVal })
    // ถ้าต้อง sync กับโครงสร้าง item ด้วย
    // item.isVisible = newVal
  } catch (err) {
    isOpen.value = prev             // rollback UI
    // แจ้งเตือน
    toast.value = {
      show: true, type: 'danger', title: t('ผิดพลาด'),
      message: t('อัปเดตสถานะแสดงผลไม่สำเร็จ'), life: 4000
    }
  } finally {
    isSaving.value = false
  }
}

// init & reactive reload
onMounted(loadComments)
watch(selectedStar, () => loadComments())
</script>


<style scoped>
/* Custom styles */
.van-switch {
  @apply transform scale-90;
}

/* Ensure proper text wrapping */
p {
  word-break: break-word;
  overflow-wrap: break-word;
}

/* Star rating custom styling */
.van-icon {
  @apply transition-colors duration-200;
}

/* Card hover effects */
.bg-white {
  @apply transition-shadow duration-200;
}

.bg-white:hover {
  @apply shadow-md;
}

/* Category badge styling */
.rounded-full {
  @apply font-medium;
}
</style>