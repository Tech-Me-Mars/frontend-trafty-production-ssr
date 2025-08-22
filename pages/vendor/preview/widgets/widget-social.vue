<template>
  <!-- {{ resInfo }} -->
  <div class="flex items-center gap-4 mt-4">
    <div v-for="(info, index) in resInfo" :key="info.id">
      <!-- แสดงลิงก์ของโซเชียล -->
      <a 
        :href="info.social_link" 
        target="_blank" 
        rel="noopener noreferrer"
        class="flex items-center justify-center w-7 h-7 rounded-full"
        :style="{ backgroundColor: info.bg_color }"
      >
        <i :class="info?.social_type?.icon" class="text-white text-xl"></i>
      </a>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const props = defineProps({
    resInfo: {
        type: Array,
        default: () => ([]), // Default to an empty object if no prop is passed
    },
});
</script>