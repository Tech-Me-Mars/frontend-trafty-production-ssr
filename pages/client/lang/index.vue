<template>
    <div class="bg-zinc-100 min-h-screen">
        <van-nav-bar title="ภาษา" left-arrow @click-left="router.go(-1)">
        </van-nav-bar>

        <ul class="bg-white ">
            <li v-for="localeOption in locales" :key="localeOption.code" 
                class="flex items-center justify-between p-4 cursor-pointer" @click="changeLanguage(localeOption.code)">
                <div class="flex items-center gap-4">
                    <img :src="localeOption.flag" alt="Flag" class="w-6 h-6 rounded" />
                    <span class="text-gray-800 font-medium">{{ localeOption.name }}</span>
                </div>
                <div>
                    <i v-if="language === localeOption.code"
                        class="fa-solid fa-check text-white bg-indigo-800 p-1 rounded-full"></i>
                </div>
            </li>
        </ul>

    </div>
</template>

<script setup>
  import { ref, computed } from "vue";
  import { useI18n } from "vue-i18n";
  
  const { t, locales, locale, setLocale } = useI18n();

const router = useRouter();
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
  };
</script>

<style scoped>
.van-nav-bar {
    --van-nav-bar-background: #281c74;
    --van-nav-bar-text-color: white;
    --van-nav-bar-icon-color: white;
    --van-nav-bar-title-text-color: white;
    --van-nav-bar-height: 70px;
}
</style>
