<style scoped></style>
<template>
  <div class="bg-zinc-100 min-h-screen w-full">
    <LayoutsBaseHeader
      title="มาตรฐานความปลอดภัย"
      :showBack="true"
      :backTo="`/inspector/check/business-tourlist?isBusiness=${route.query.isBusiness}`"
    />

    <div class="max-w-[430px] mx-auto">
      <div class="p-4">
        <div class="mx-auto bg-white rounded-lg shadow-md px-4 py-2">
          <!-- Header card -->
          <div class="border-b flex justify-between">
            <div class="flex justify-between flex-wrap w-full py-3">
              <h2 class="font-bold">{{ t('สถานะการแสดง') }}</h2>
              <ConfirmSwitch
                v-model="isOpen"
                :message-on="`${t('คุณต้องการเปิดรีวิวนี้ให้ผู้อื่นเห็นหรือไม่?')}`"
                :message-off="`${t('คุณต้องการปิดรีวิวนี้ใช่หรือไม่?')}`"
                @update:modelValue="toggleReviewVisibility"
              />
            </div>
          </div>

          <!-- Skeleton -->
          <div v-if="isLoading" class="p-4">
            <div class="h-4 w-40 bg-zinc-200 rounded mb-4 animate-pulse"></div>
            <ul class="space-y-3">
              <li v-for="n in 6" :key="n" class="flex items-start space-x-3">
                <div class="w-5 h-5 rounded-full bg-zinc-200 animate-pulse mt-0.5"></div>
                <div class="flex-1">
                  <div class="h-4 bg-zinc-200 rounded w-[90%] mb-2 animate-pulse"></div>
                  <div class="h-3 bg-zinc-200 rounded w-[70%] animate-pulse"></div>
                </div>
              </li>
            </ul>
          </div>

          <!-- Content -->
          <div v-else class="p-4">
            <!-- List -->
            <ul v-if="resPolicy.length" class="space-y-5">
              <li
                v-for="(item, index) in resPolicy"
                :key="index"
                class="flex items-start space-x-3"
              >
                <i
                  v-if="item?.FieldValue == '1'"
                  class="fa-solid fa-circle-check text-blue-700 mt-1"
                ></i>
                <i
                  v-else
                  class="fa-solid fa-circle-xmark text-red-600 mt-1"
                ></i>

                <div class="flex-1">
                  <span class="block">
                    {{ getI18n(item?.questions_field_name_display) }}
                  </span>
                </div>
              </li>
            </ul>

            <!-- Empty state -->
            <div v-else class="text-sm text-zinc-500 py-2">
              {{ t('ยังไม่มีรายการ') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: ['auth'] })

import * as dataApi from './api/data.js'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const isloadingAxi = useState('isloadingAxi')
const route = useRoute()
const router = useRouter()

// states
const isLoading = ref(true)
const resPolicy = ref([])
const isOpen = ref(true)



const loadPolicy = async () => {
  try {
    isLoading.value = true
    const res = await dataApi.getSurveyAuditAllByBusinessId(route.params.id)
    resPolicy.value = (res?.data?.data || []).slice().sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
  } catch (error) {
    console.error(error)
    resPolicy.value = []
  } finally {
    isLoading.value = false
  }
}

const toggleReviewVisibility = async (nextValue) => {
  try {
    await dataApi.updateSurveyStatusShow({ status_show: nextValue })
    isOpen.value = nextValue
  } catch (error) {
    isOpen.value = !nextValue
    console.error(error)
    // ใส่ toast ได้หากต้องการแจ้งผู้ใช้
  }
}

onMounted(() => {
  loadPolicy()
})
</script>
