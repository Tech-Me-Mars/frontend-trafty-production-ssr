<template>
    <div class="bg-zinc-100 min-h-screen">
      <LayoutsBaseHeader :title="t('ธุรกิจของฉัน')" :showBack="true" backTo="/" />
  
      <section class="max-w-[430px] mx-auto">
        <div class="flex justify-between flex-wrap gap-2 bg-white px-4 py-3">
          <h1 class="text-xl font-semibold">
            {{ t('ธุรกิจของฉัน') }} ({{ resBusiness.length }})
          </h1>
          <Button
            :loading="isloadingAxi"
            :label="t('เพิ่มธุรกิจ')"
            severity="primary"
            type="button"
            rounded
            class="w-auto"
            outlined
            :pt="{ root: { class: '!border-primary-main' } }"
            @click="navigateTo('/vendor/register-business')"
          />
        </div>
  
        <div class="p-4">
          <!-- ============ SKELETON LOADING ============ -->
          <div v-if="loadingList" class="space-y-3 max-w-md mx-auto">
            <div v-for="n in 3" :key="n" class="border rounded-lg shadow-md bg-white w-full animate-pulse">
              <div class="p-4">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="h-4 bg-zinc-200 rounded w-48 mb-2"></div>
                    <div class="h-3 bg-zinc-200 rounded w-28"></div>
                  </div>
                  <div class="h-5 bg-zinc-200 rounded w-20"></div>
                </div>
                <div class="h-3 bg-zinc-200 rounded w-56 mt-4 mb-6"></div>
                <hr class="border-t mb-4 mx-5" />
                <div class="flex gap-3">
                  <div class="h-10 bg-zinc-200 rounded w-full"></div>
                  <div class="h-10 bg-zinc-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- ============ EMPTY STATE ============ -->
          <div
            v-else-if="resBusiness.length === 0"
            class="max-w-md mx-auto border rounded-lg shadow-md bg-white p-6 text-center"
          >
            <div class="text-4xl mb-2">🗂️</div>
            <p class="text-gray-600 mb-4">{{ t('ยังไม่มีรายการธุรกิจของคุณ') }}</p>
            <!-- <Button
              :loading="isloadingAxi"
              :label="t('เพิ่มธุรกิจแรกของฉัน')"
              severity="primary"
              class="w-full"
              @click="navigateTo('/vendor/register-business')"
              :pt="{ root: { class: '!bg-primary-main !border-primary-main' } }"
            /> -->
          </div>
  
          <!-- ============ LIST ============ -->
          <div v-else>
            <div
              class="border rounded-lg shadow-md bg-white w-full max-w-md mx-auto mb-2"
              v-for="(item, index) in resBusiness"
              :key="index"
            >
              <div class="p-4">
                <!-- ชื่อธุรกิจ -->
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h2 class="text-lg font-semibold text-gray-800 flex-1">
                      <span>{{ getI18n(item?.shop_name_i18n, lang) }}</span>
                      <span v-if="item?.notification_status == 1">
                        <i class="fa-solid fa-circle-exclamation" style="color: red;"></i>
                      </span>
                    </h2>
                  </div>
  
                  <div
                    v-if="item?.survey_status"
                    class="text-white rounded-full px-2 py-2 text-xs"
                    :style="{ backgroundColor: item.survey_status?.bg_color }"
                  >
                    {{ getI18n(item.survey_status.survey_success_note, lang) || '-' }}
                  </div>
                </div>
  
                <!-- ที่อยู่ธุรกิจ -->
                <p class="text-gray-500 mt-1 text-sm mb-6"></p>
  
                <!-- ปุ่มแอคชัน -->
                <hr class="border-t mb-4 mx-5" />
                <div class="flex gap-3">
                  <Button
                    :loading="isloadingAxi"
                    :label="t('แก้ไขข้อมูล')"
                    severity="primary"
                    variant="outlined"
                    class="w-full"
                    :pt="{
                      label: { class: 'text-primary-main' },
                      root: { class: '!border-primary-main' },
                    }"
                    @click="navigateTo(`/vendor/manage-business/edit/${item.id}`)"
                  />
                  <Button
                    :loading="isloadingAxi"
                    :label="t('รายละเอียด')"
                    severity="primary"
                    variant="outlined"
                    class="w-full"
                    :pt="{
                      label: { class: 'text-primary-main' },
                      root: { class: '!border-primary-main' },
                    }"
                    @click="navigateTo(`/vendor/manage-business/home/${item.id}`)"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- /LIST -->
        </div>
      </section>
    </div>
  </template>
  
  <style scoped>
  .van-nav-bar {
    --van-nav-bar-background: #281c74;
    --van-nav-bar-text-color: white;
    --van-nav-bar-icon-color: white;
    --van-nav-bar-title-text-color: white;
    --van-nav-bar-height: 70px;
  }
  </style>
  
  <script setup>
  definePageMeta({ middleware: ['auth'] })
  
  import { ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import * as dataApi from './api/data.js'
  
  const { t, locale } = useI18n()
  const langs = [
    { code: 'th', locale: 'th' },
    { code: 'en', locale: 'en' },
    { code: 'cn', locale: 'cn' },
  ]
  const lang = computed(() => {
    const found = langs.find((l) => l.locale === locale.value)
    return found ? found.code : 'th'
  })
  
  const isloadingAxi = useState('isloadingAxi') // คงไว้ตามเดิม
  const resBusiness = ref([])
  
  // ✅ state สำหรับ Skeleton/Empty (ไม่กระทบ logic เดิม)
  const loadingList = ref(true)
  
  const loadListData = async () => {
    loadingList.value = true
    try {
      const res = await dataApi.getMyBusiness()
      resBusiness.value = res.data.data
    } catch (error) {
      // เงียบตามเดิม
    } finally {
      loadingList.value = false
    }
  }
  
  onMounted(() => {
    loadListData()
  })
  
  // คงฟังก์ชันนี้ตามเดิม (ถ้ามีใช้)
  const getStatusText = (status) => {
    switch (status) {
      case 0:
      case 3:
        return t('รอตรวจสอบ')
      case 4:
        return t('มีใบเตือน')
      case 5:
        return t('ตอบกลับใบเตือนแล้ว')
      case 2:
        return t('อนุมัติแล้ว')
      default:
        return t('ไม่ทราบสถานะ')
    }
  }
  </script>
  