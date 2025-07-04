<template>
  <Transition name="fade">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-gray-100"
    >
      <div
        class="text-center transform transition-all duration-300"
        :class="animationClass"
      >
        <!-- Icon Section -->
        <div class="flex justify-center mb-8">
          <div
            class="flex items-center justify-center w-20 h-20 rounded-full"
            :class="iconBgClass"
          >
            <van-icon
              :name="iconName"
              :color="iconColor"
              size="40"
            />
          </div>
        </div>

        <!-- Content Section -->
        <div class="text-center">
          <h3
            class="text-2xl font-semibold mb-4 text-gray-800"
          >
            {{ title }}
          </h3>
          <p v-if="detail" class="text-gray-600 text-base mb-8">
            {{ detail }}
          </p>
        </div>

        <!-- Progress Bar (if auto close and timeout is set) -->
        <div v-if="autoClose && timeout > 0" class="mb-8 max-w-xs mx-auto">
          <div class="w-full bg-gray-300 rounded-full h-1">
            <div
              class="h-1 rounded-full transition-all duration-100 ease-linear"
              :class="progressBarClass"
              :style="{ width: progressWidth + '%' }"
            ></div>
          </div>
          <p class="text-sm text-gray-500 text-center mt-3">
            {{ Math.ceil(remainingTime / 1000) }} วินาที
          </p>
        </div>

        <!-- Action Button (only show if not auto-closing or user wants to close manually) -->
        <div v-if="!autoClose || timeout === 0" class="text-center">
          <van-button
            type="primary"
            :color="buttonColor"
            class="px-8 py-3 text-base"
            @click="handleClose"
          >
            ตกลง
          </van-button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

// Props
const props = defineProps({
  state: {
    type: String,
    required: true,
    validator: (value) => ['success', 'warning', 'error'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  detail: {
    type: String,
    required: true
  },
  timeout: {
    type: Number,
    default: 0 // 0 means no auto close
  },
  redirectUrl: {
    type: String,
    default: null
  },
  visible: {
    type: Boolean,
    default: false
  },
  autoClose: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['close', 'update:visible'])

// Composables
const router = useRouter()

// Reactive data
const isVisible = ref(props.visible)
const remainingTime = ref(props.timeout)
const timer = ref(null)
const progressTimer = ref(null)
const animationClass = ref('scale-95 opacity-0')

// Computed properties
const iconName = computed(() => {
  switch (props.state) {
    case 'success':
      return 'success'
    case 'warning':
      return 'warning-o'
    case 'error':
      return 'cross'
    default:
      return 'success'
  }
})

const iconColor = computed(() => {
  return '#ffffff'
})

const iconBgClass = computed(() => {
  switch (props.state) {
    case 'success':
      return 'bg-green-500'
    case 'warning':
      return 'bg-yellow-500'
    case 'error':
      return 'bg-red-500'
    default:
      return 'bg-green-500'
  }
})

const titleColorClass = computed(() => {
  switch (props.state) {
    case 'success':
      return 'text-green-600'
    case 'warning':
      return 'text-yellow-600'
    case 'error':
      return 'text-red-600'
    default:
      return 'text-green-600'
  }
})

const buttonColor = computed(() => {
  switch (props.state) {
    case 'success':
      return '#10b981'
    case 'warning':
      return '#f59e0b'
    case 'error':
      return '#ef4444'
    default:
      return '#10b981'
  }
})

const progressBarClass = computed(() => {
  switch (props.state) {
    case 'success':
      return 'bg-green-500'
    case 'warning':
      return 'bg-yellow-500'
    case 'error':
      return 'bg-red-500'
    default:
      return 'bg-green-500'
  }
})

const progressWidth = computed(() => {
  if (props.timeout === 0 || !props.autoClose) return 0
  return ((props.timeout - remainingTime.value) / props.timeout) * 100
})

// Methods
const startTimer = () => {
  if (props.autoClose && props.timeout > 0) {
    remainingTime.value = props.timeout
    
    // Progress timer (updates every 100ms for smooth animation)
    progressTimer.value = setInterval(() => {
      remainingTime.value -= 100
      if (remainingTime.value <= 0) {
        handleTimeout()
      }
    }, 100)
  }
}

const clearTimers = () => {
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }
  if (progressTimer.value) {
    clearInterval(progressTimer.value)
    progressTimer.value = null
  }
}

const handleTimeout = () => {
  clearTimers()
  handleClose(true)
}

const handleClose = (isTimeout = false) => {
  clearTimers()
  animationClass.value = 'scale-95 opacity-0'
  
  setTimeout(() => {
    isVisible.value = false
    emit('update:visible', false)
    emit('close')
    
    // Only redirect if timeout occurred and redirectUrl is provided
    if (isTimeout && props.redirectUrl) {
      router.push(props.redirectUrl)
    }
  }, 200)
}

const show = () => {
  isVisible.value = true
  emit('update:visible', true)
  
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden'
  
  // Trigger animation
  setTimeout(() => {
    animationClass.value = 'scale-100 opacity-100'
  }, 50)
  
  startTimer()
}

const hideModal = () => {
  // Restore body scroll when modal is closed
  document.body.style.overflow = 'auto'
  handleClose()
}

// Watch for visibility changes
watch(() => props.visible, (newVal) => {
  if (newVal && !isVisible.value) {
    show()
  } else if (!newVal && isVisible.value) {
    hideModal()
  }
})

// Lifecycle
onMounted(() => {
  if (props.visible) {
    show()
  }
})

onUnmounted(() => {
  clearTimers()
  // Restore body scroll on component unmount
  document.body.style.overflow = 'auto'
})

// Override handleClose to include body scroll restoration
const originalHandleClose = handleClose
const handleCloseWithScroll = (isTimeout = false) => {
  document.body.style.overflow = 'auto'
  originalHandleClose(isTimeout)
}

// Expose methods for parent component
defineExpose({
  show,
  close: handleCloseWithScroll
})
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

/* Additional styles for full screen effect */
.fixed.inset-0 {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>