<template>
  <div class="bg-zinc-100 min-h-screen">
    <LayoutsBaseHeader :title="t('ข้อมูลธุรกิจ')">
            <template #left>
                <ButtonIconBack @click="formStore.prevPage()" />
            </template>
        </LayoutsBaseHeader>

    <div class="p-4">
      <van-tabs v-model:active="activeLang" animated swipeable color="#281c74">
        <van-tab :title="t('ภาษาไทย')">
          <AgencyForm lang="th" />
        </van-tab>
        <van-tab :title="t('ภาษาอังกฤษ')">
          <AgencyForm lang="en" />
        </van-tab>
        <van-tab :title="t('ภาษาจีน')">
          <AgencyForm lang="zh" />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: ['auth'] })
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AgencyForm from './components/AgencyForm.vue'
import { useFormStore } from '@/store/businessStore.js'

const { t } = useI18n()
const formStore = useFormStore()
const activeLang = ref(0) // 0 = ไทย, 1 = อังกฤษ, 2 = จีน
</script>
