<template>
  <transition name="fade">
    <div v-if="isloadingAxi" class="fixed inset-0 z-50 flex items-center justify-center block-ui-overlay">
      <div class="loading-content  text-center">
        <div class="mb-4">
          <!-- <div class="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full spinner-custom"></div> -->
           <van-loading type="spinner" color="#202c54" />
        </div>
        <!-- <p class="text-gray-700 font-medium">กำลังโหลด...</p>
        <p class="text-gray-500 text-sm mt-2">โปรดรอสักครู่</p> -->
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
  const isloadingAxi = useState('isloadingAxi')

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.block-ui-overlay {
  backdrop-filter: blur(2px);
  background: rgba(255, 255, 255, 0.8);
}
.loading-content {
  animation: fadeInUp 0.4s ease-out;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.spinner-custom {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
