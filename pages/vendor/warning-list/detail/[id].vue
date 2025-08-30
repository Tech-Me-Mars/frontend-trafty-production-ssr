<template>
  <ClientOnly>
  <div class="min-h-screen bg-zinc-100">
    <LayoutsBaseHeader
      :title="t('ดูรายละเอียดใบเตือน')"
      :showBack="true"
      :BackTo="`/vendor/warning-list?BusinessId=${route.query.BusinessId}`"
    />
   
    <section class="max-w-lg p-4 mx-auto">
      <!-- Skeleton Loading -->
      <div v-if="isLoading" class="space-y-3">
        <div v-for="n in 3" :key="'sk-'+n" class="mb-2 card max-w-md p-4 animate-pulse">
          <div class="flex items-start space-x-3 mb-2">
            <div class="w-5 h-5 rounded-full bg-zinc-200 mt-1"></div>
            <div class="flex-1">
              <div class="h-4 bg-zinc-200 rounded w-[90%] mb-2"></div>
              <div class="h-3 bg-zinc-200 rounded w-[70%] mb-3"></div>
              <div class="h-4 bg-zinc-200 rounded w-[85%] mb-2"></div>
              <div class="h-3 bg-zinc-200 rounded w-[60%]"></div>
            </div>
          </div>
          <div class="flex gap-3 items-start mt-2">
            <div class="rounded-md w-28 h-20 bg-zinc-200 border border-zinc-200"></div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <template v-else>
        <div
          v-if="resList.length > 0"
          class="mb-2 card max-w-md p-4"
          v-for="(item, index) in resList"
          :key="index"
        >
          <div class="flex items-start space-x-3 mb-2">
            <i class="fa-solid fa-circle-xmark text-red-600 mt-1"></i>
            <div>
              <div class="mb-2">
                <span>{{ getI18n(item?.questions_field_name_display, locale) }}</span>
                <p>
                  <span class="font-bold">{{ t('หมายเหตุ') }}:</span>
                  <span>{{ getI18n(item?.survey_audit_detail_note, locale) }}</span>
                </p>
              </div>
              <div>
                <span>{{ getI18n(item?.questions_field_name_display, locale) }}</span>
                <p>
                  <span class="font-bold">{{ t('ตอบกลับ') }}:</span>
                  <span>{{ getI18n(item?.respond_warning_detail_note, locale) }}</span>
                </p>
              </div>
            </div>
          </div>

          <div class="flex gap-3 items-start">
            <img
              v-if="item?.respond_warning_detail_img_url"
              :src="item?.respond_warning_detail_img_url"
              class="rounded-md w-28 h-20 object-cover border border-zinc-200"
              alt=""
            />
          </div>
        </div>

        <!-- Empty state -->
        <SharedNoData v-else />
      </template>
    </section>
  </div>
  </ClientOnly>
</template>

<script setup>
definePageMeta({ middleware: ["auth"] })
import * as dataApi from "./api/data.js"
import { useI18n } from "vue-i18n"

const { t, locale } = useI18n()
const route = useRoute()
const isloadingAxi = useState("isloadingAxi")

const isLoading = ref(true)
const resList = ref([])

const loadWarningById = async () => {
  try {
    isLoading.value = true
    const res = await dataApi.getSurveyWarningRespondBySurVeyWarningId(route.params.id)
    resList.value = res.data.data || []
  } catch (error) {
    console.error(error)
    resList.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(loadWarningById)
</script>
