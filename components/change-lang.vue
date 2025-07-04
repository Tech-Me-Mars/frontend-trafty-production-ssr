<template>
    <div>
      <!-- แสดงรูปธงชาติตามภาษาที่เลือก -->
      <img
        :src="currentLanguageFlag"
        alt="Flag"
        class="w-8 h-8 self-start cursor-pointer"
        style="border-radius: 2px;"
        @click="toggleDialog"
      />
  
      <!-- Dialog สำหรับเลือกภาษา -->
      <Dialog v-model:visible="visible" modal header="เลือกภาษา" :style="{ width: '25rem' }" dismissableMask >
        <div class="flex flex-col gap-4">
          <div
            v-for="localeOption in locales"
            :key="localeOption.code"
            class="flex items-center gap-3 cursor-pointer hover:bg-gray-200 p-2 rounded"
            @click="changeLanguage(localeOption.code)"
          >
            <img :src="localeOption.flag" class="w-6 h-4" alt="Flag" />
            <span>{{ localeOption.name }}</span>
          </div>
        </div>
      </Dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import { useI18n } from "vue-i18n";
  
  const { t, locales, locale, setLocale } = useI18n();
  
  // สถานะการเปิด/ปิด Dialog
  const visible = ref(false);
  
  // ฟังก์ชันสลับสถานะ Dialog
  const toggleDialog = () => {
    visible.value = !visible.value;
  };
  
  // คำนวณภาษาปัจจุบัน
  const language = computed({
    get: () => locale.value,
    set: (value) => {
      setLocale(value);
    },
  });
  
  // ดึง URL ของรูปธงชาติตามภาษาที่เลือก
  const currentLanguageFlag = computed(() => {
    const current = locales.value.find((item) => item.code === locale.value);
    return current?.flag || "/image/default-flag.png"; // ใช้ default flag หากไม่มี
  });
  
  // ฟังก์ชันเปลี่ยนภาษา
  const changeLanguage = (code) => {
    setLocale(code);
    visible.value = false; // ปิด Dialog หลังจากเลือกภาษา
  };
  </script>
  
  <style scoped>
  /* ปรับปรุงการจัดรูปแบบเพิ่มเติม */
  </style>
  