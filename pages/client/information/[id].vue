<template>
  <div class="bg-zinc-100 min-h-screen">
    <LayoutsBaseHeader :title="t('พรีวิว')" :showBack="true" :back-to="urlBackTo">
      <template #right>
        <div class="flex gap-2" v-if="route.query.state === 'preview'">
          <i class="fa-solid fa-xmark cursor-pointer" style="color: white; font-size: 22px;"
            @click="navigateTo(`/vendor/manage-business/home/${route.params.id}`)"></i>
        </div>
        <div class="flex gap-2" v-if="route.query.state == 'view'">
          <i @click="showShare = true" class="fa-solid fa-arrow-up-from-bracket"
            style="color: white;font-size: 22px;"></i>
        </div>
      </template>
    </LayoutsBaseHeader>

    <section class="max-w-[430px] mx-auto">
      <!-- ✅ Loading state -->
      <div v-if="isLoading" class="p-4 space-y-4">
        <div class="w-full h-48 bg-zinc-200 animate-pulse rounded-xl"></div>
        <div class="h-6 bg-zinc-200 rounded w-2/3 animate-pulse"></div>
        <div class="h-4 bg-zinc-200 rounded w-1/3 animate-pulse"></div>
        <div class="h-4 bg-zinc-200 rounded w-1/2 animate-pulse"></div>
        <div class="h-20 bg-zinc-200 rounded animate-pulse"></div>
      </div>

      <!-- ✅ Content -->
      <div v-else>
        <van-share-sheet v-model:show="showShare" :title="t('แชร์')"
          :description="`${t('แชร์')} '${resInfo?.shop_name}' ${t('ไปยังโซเชียลให้เพื่อนคุณรู้')}!`" :options="options"
          @select="onSelect">
          <template #title>
            <div class="flex items-center gap-2">
              <img :src="resInfo?.image_profile" alt="Logo" class="w-20 h-20 rounded-xl object-cover" />
              <span class="text-md font-bold text-gray-800">{{ getI18n(resInfo?.shop_name_i18n, locale) }}</span>
            </div>
          </template>
          <template #description>
            <p class="text-sm text-gray-500 border-b border-gray-300 pb-2">
              {{ t('แชร์') }} '{{ getI18n(resInfo?.shop_name_i18n, locale) }}' {{ t('ไปยังโซเชียลให้เพื่อนคุณรู้') }}!
            </p>
          </template>
        </van-share-sheet>

        <div class="relative">
          <img :src="useImage(resInfo?.ImageCoverURL)" alt="Food" class="w-full h-48 object-cover" />
        </div>

        <div class="p-4 bg-white mb-2">
          <!-- Title and Rating Section -->
          <div class="flex items-center justify-between mt-4 mb-2">
            <h1 class="text-xl font-semibold">{{ getI18n(resInfo?.shop_name_i18n, locale) }}</h1>
            <!-- <div class="flex items-center text-gray-700">
              <i class="fa-heart cursor-pointer text-gray-400 transition-all duration-300 transform" :class="{
                'fa-regular': !isLiked,
                'fa-solid text-rose-600 scale-110': isLiked,
              }" @click="toggleLike" style="font-size: 22px"></i>
            </div> -->
          </div>
          <div class="flex items-center text-orange-500 mb-2">
            <star-review class="mr-1" />
            <span class="text-sm font-semibold">{{ resInfo?.star }}</span>
          </div>
          <p class="text-sm text-gray-400 mb-2">
            {{ getI18n(resInfo?.business_type?.business_type_name_i18n, locale) }}
          </p>
          <p class="text-sm text-gray-700 mb-2">
            {{ getI18n(resInfo?.shop_address, locale) }}
            {{ getI18n(resInfo?.shop_subdistrict?.subdistrict_name_i18n, locale) }}
            {{ getI18n(resInfo?.shop_district?.district_name_i18n, locale) }}
            {{ getI18n(resInfo?.shop_province?.provinces_name_i18n, locale) }}
            {{ resInfo?.shop_subdistrict?.zip_code }}
          </p>

        </div>

        <div class="p-4 bg-white mb-2">

          <div class="mt-2 text-gray-800 space-y-2">
            <h2 class="font-semibold text-lg mb-2">{{ t('รายละเอียด') }}</h2>
            <p class="text-sm text-gray-600 mt-2">
              {{ getI18n(resInfo?.shop_details_i18n, locale) }}
            </p>
            <p class="flex items-start gap-2">
              <i class="pi pi-calendar text-yellow-500 text-lg mt-1" />
              <span>
                <strong class="text-black">{{ t('วันที่ทำการ') }} :</strong>
                <span class="text-primary-700">

                  <template v-if="openDays.length">
                    <span v-for="(day, i) in openDays" :key="i">
                      {{ day }}<span v-if="i < openDays.length - 1">, </span>
                    </span>
                  </template>
                  <template v-else>
                    {{ t('ไม่มีข้อมูลโซเชียลมีเดีย') }}
                  </template>
                </span>
              </span>
            </p>

            <p class="flex items-start gap-2">
              <i class="pi pi-clock text-blue-500 text-lg mt-1" />
              <span>
                <strong class="text-black">{{ t('เวลาเปิด - ปิด') }} :</strong>
                <span class="text-primary-700">{{ resInfo?.shop_time }}</span>
              </span>
            </p>

            <p class="flex items-start gap-2">
              <i class="pi pi-phone text-green-500 text-lg mt-1" />
              <span>
                <strong class="text-black">{{ t('เบอร์ติดต่อ') }} :</strong>
                <span class="text-primary-700">{{ resInfo?.shop_phone }}</span>
              </span>
            </p>
          </div>

        </div>
        <div class="px-4 pb-4 bg-white">
          <widgetSoCialBankEdit class="" :resInfo="resInfo" />

          <!-- <widgetBankEdit class="mt-5" :resInfo="resInfo" /> -->

        </div>

        <!-- <widgetSocial :resInfo="resInfo" /> -->

        <widgetItemsBusiness class="mt-2" :resInfo="resInfo?.business_list" />
        <widgetPolicy class="mt-2" />
        <ConfirmDialog />

      </div>
    </section>
  </div>
</template>

<script setup>
// หน้านีนี้มี3 state => preview,edit,view
import { ref, onMounted } from 'vue'
import * as dataApi from './api/data.js'
import widgetSocial from './widgets/widget-social.vue';
import widgetSoCialBankEdit from './widgets/social-bank-edit.vue';
import widgetItemsBusiness from './widgets/widget-items-business.vue';
import widgetPolicy from './widgets/widget-policy.vue';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n()
const route = useRoute();

// กรอง query: เอาเฉพาะคีย์ที่มีค่า

const cleanQuery = computed(() => {
  const out = {}
  Object.entries(route.query).forEach(([k, v]) => {
    if (v == null) return
    if (Array.isArray(v)) {
      if (v.length === 0) return
      out[k] = v
    } else {
      const sv = String(v)
      if (sv.trim() === '') return
      out[k] = v
    }
  })
  return out
})
// คำนวณปลายทางย้อนกลับ (ไม่มี side-effect)
const urlBackTo = computed(() => {
  const query = cleanQuery.value
  if (route.query.state === 'preview') {
    return { path: `/vendor/manage-business/home/${route.params.id}`, query }
  } else if (route.query.state === 'edit') {
    // เดิมเคยส่งแค่ ?isBusiness=... ตอนนี้ส่ง query ทั้งชุด
    return { path: `/inspector/management-place`, query }
  } else {
    return { path: `/`, query }
  }
})
const isLoading = ref(true) // ✅ state โหลด

const resInfo = ref();
const loadDataInfo = async () => {
  try {
    const res = await dataApi.getBusinessById(route.params.id);
    resInfo.value = res.data.data;
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false // ✅ ปิดโหลด
  }
}
const openDays = computed(() => {
  const i18n = resInfo.value?.business_open_date_i18n
  if (!i18n) return []
  const raw = i18n[locale.value] ?? i18n.th ?? '[]'
  try {
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
})
onMounted(() => loadDataInfo())

const isLiked = ref(false);
const toggleLike = () => {
  isLiked.value = !isLiked.value;
};
</script>
