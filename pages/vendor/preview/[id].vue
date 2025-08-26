<template>
  <div class="bg-zinc-100 min-h-screen">
    <LayoutsBaseHeader :title="t('พรีวิว')" :showBack="true"
      :back-to="`/vendor/manage-business/home/${route.params.id}`">
      <template #right>
        <div class="flex gap-2">
          <i class="fa-solid fa-xmark cursor-pointer" style="color: white; font-size: 22px;"
            @click="navigateTo(`/vendor/manage-business/home/${route.params.id}`)"></i>
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

        <div class="p-4 bg-white">
          <!-- Title and Rating Section -->
          <div class="flex items-center justify-between mt-4">
            <h1 class="text-xl font-semibold">{{ getI18n(resInfo?.shop_name_i18n, locale) }}</h1>
            <!-- <div class="flex items-center text-gray-700">
              <i class="fa-heart cursor-pointer text-gray-400 transition-all duration-300 transform" :class="{
                'fa-regular': !isLiked,
                'fa-solid text-rose-600 scale-110': isLiked,
              }" @click="toggleLike" style="font-size: 22px"></i>
            </div> -->
          </div>
          <div class="flex items-center text-orange-500">
            <star-review class="mr-1" />
            <span class="text-sm font-semibold">{{ resInfo?.star }}</span>
          </div>
          <p class="text-sm text-gray-400">
            {{ getI18n(resInfo?.business_type?.business_type_name_i18n, locale) }}
          </p>
          <p class="text-sm text-gray-700">
            {{ getI18n(resInfo?.shop_address, locale) }}
            {{ getI18n(resInfo?.shop_subdistrict?.subdistrict_name_i18n, locale) }}
            {{ getI18n(resInfo?.shop_district?.district_name_i18n, locale) }}
            {{ getI18n(resInfo?.shop_province?.provinces_name_i18n, locale) }}
            {{ resInfo?.shop_subdistrict?.zip_code }}
          </p>

          <div class="mt-2 text-sm text-gray-800 space-y-2">
            <h2 class="text-gray-800 font-semibold">{{ t('รายละเอียด') }}</h2>
            <p class="text-sm text-gray-600 mt-2">
              {{ getI18n(resInfo?.shop_details_i18n, locale) }}
            </p>
            <!-- ... (เนื้อหาที่คุณมีอยู่แล้ว) ... -->
          </div>
          <widgetSocial :resInfo="resInfo?.business_social_media" />
        </div>
        <widgetItemsBusiness class="mt-2" :resInfo="resInfo?.business_list" />
        <widgetPolicy class="mt-2" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as dataApi from './api/data.js'
import widgetSocial from './widgets/widget-social.vue';
import widgetItemsBusiness from './widgets/widget-items-business.vue';
import widgetPolicy from './widgets/widget-policy.vue';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n()
const route = useRoute();

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
onMounted(() => loadDataInfo())

const isLiked = ref(false);
const toggleLike = () => {
  isLiked.value = !isLiked.value;
};
</script>
