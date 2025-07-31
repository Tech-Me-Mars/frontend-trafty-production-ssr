<template>
  <div class="min-h-screen bg-gray-50">

            <LayoutsBaseHeader title="ตรวจสอบคอมเม้นต์" :showBack="true">
        </LayoutsBaseHeader>
        
    <!-- Single Review Card -->
    <div class="p-4">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <!-- Toggle Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-100">
          <span class="text-gray-700 font-medium">สถานะการแสดงผล</span>
          <!-- <van-switch v-model="review.isVisible" size="24" active-color="#20bc04" /> -->
            <ConfirmSwitch
    v-model="review.isVisible"
    message-on="คุณต้องการเปิดรีวิวนี้ให้ผู้อื่นเห็นหรือไม่?"
    message-off="คุณต้องการปิดรีวิวนี้ใช่หรือไม่?"
  />
        </div>

        <!-- Place Information Section -->
        <div class="p-4 border-b border-gray-100">
          <div class="flex items-center space-x-3">
            <!-- Place Image -->
            <img 
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=60&h=60&fit=crop"
              alt="สถานที่"
              class="w-12 h-12 rounded-lg object-cover"
            />
            <div class="flex-1">
              <h3 class="font-medium text-gray-800 text-base mb-1">
                ลูกยาแห่งยาอันโด่งดังของ
              </h3>
              <p class="text-xs text-gray-500 leading-relaxed">
                ตำบล แฟ่งพระ อำเภอแม่แตง เชียงใหม่...
              </p>
            </div>
          </div>
        </div>

        <!-- Review Content -->
        <div class="p-4">
          <div class="flex items-start space-x-3">
            <!-- User Avatar -->
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Anne-Marie-4250_%28cropped%29.jpg/960px-Anne-Marie-4250_%28cropped%29.jpg"
              alt="ผู้รีวิว" 
              class="w-10 h-10 rounded-full object-cover"
            />
            <div class="flex-1">
              <!-- User Info -->
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-gray-800">Marie</span>
                <span class="text-xs text-gray-400">29-07-2023</span>
              </div>

              <!-- Star Rating -->
              <div class="flex items-center mb-3">
                <div class="flex items-center">
                  <van-icon 
                    v-for="i in 5" 
                    :key="i"
                    name="star" 
                    :color="i <= review.rating ? '#f07404' : '#e5e7eb'"
                    size="16"
                    class="mr-1"
                  />
                </div>
                <span class="ml-2 text-sm bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                  การบริการ
                </span>
              </div>

              <!-- Review Text -->
              <p class="text-gray-700 text-sm leading-relaxed">
                ห้องน้ำไม่สะอาดและไม่มีอุปกรณ์<br>
                ต่อการจ่อยจับถักและกิจกรรมก็อาจารย์พอใจ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Example of Multiple Reviews -->
    <div class="px-4 pb-4">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <!-- Toggle Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-100">
          <span class="text-gray-700 font-medium">สถานะการแสดงผล</span>
          <van-switch v-model="review2.isVisible" size="24" active-color="#20bc04" />
        </div>

        <!-- Place Information Section -->
        <div class="p-4 border-b border-gray-100">
          <div class="flex items-center space-x-3">
            <!-- Place Image -->
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=60&h=60&fit=crop"
              alt="สถานที่"
              class="w-12 h-12 rounded-lg object-cover"
            />
            <div class="flex-1">
              <h3 class="font-medium text-gray-800 text-base mb-1">
                ร้านอาหารริมน้ำ
              </h3>
              <p class="text-xs text-gray-500 leading-relaxed">
                ตำบล ท่าขาม อำเภอสามพราน นครปฐม...
              </p>
            </div>
          </div>
        </div>

        <!-- Review Content -->
        <div class="p-4">
          <div class="flex items-start space-x-3">
            <!-- User Avatar -->
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              alt="ผู้รีวิว" 
              class="w-10 h-10 rounded-full object-cover"
            />
            <div class="flex-1">
              <!-- User Info -->
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-gray-800">John</span>
                <span class="text-xs text-gray-400">15-08-2023</span>
              </div>

              <!-- Star Rating -->
              <div class="flex items-center mb-3">
                <div class="flex items-center">
                  <van-icon 
                    v-for="i in 5" 
                    :key="i"
                    name="star" 
                    :color="i <= review2.rating ? '#f07404' : '#e5e7eb'"
                    size="16"
                    class="mr-1"
                  />
                </div>
                                <span class="ml-2 text-sm bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                  การบริการ
                </span>
              </div>

              <!-- Review Text -->
              <p class="text-gray-700 text-sm leading-relaxed">
                รสชาติดีมาก บรรยากาศสวย<br>
                พนักงานบริการดี แต่ราคาค่อนข้างแพง
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Review data
const review = ref({
  isVisible: true,
  rating: 1,
  author: 'Marie',
  date: '29-07-2023',
  category: 'การบริการ',
  content: 'ห้องน้ำไม่สะอาดและไม่มีอุปกรณ์ต่อการจ่อยจับถักและกิจกรรมก็อาจารย์พอใจ',
  place: {
    name: 'ลูกยาแห่งยาอันโด่งดังของ',
    location: 'ตำบล แฟ่งพระ อำเภอแม่แตง เชียงใหม่...',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=60&h=60&fit=crop'
  }
})

const review2 = ref({
  isVisible: true,
  rating: 4,
  author: 'John',
  date: '15-08-2023',
  category: 'อาหาร',
  content: 'รสชาติดีมาก บรรยากาศสวยพนักงานบริการดี แต่ราคาค่อนข้างแพง',
  place: {
    name: 'ร้านอาหารริมน้ำ',
    location: 'ตำบล ท่าขาม อำเภอสามพราน นครปฐม...',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=60&h=60&fit=crop'
  }
})

// Methods
const toggleReviewVisibility = (reviewObj) => {
  reviewObj.isVisible = !reviewObj.isVisible
}
</script>

<style scoped>
/* Custom styles */
.van-switch {
  @apply transform scale-90;
}

/* Ensure proper text wrapping */
p {
  word-break: break-word;
  overflow-wrap: break-word;
}

/* Star rating custom styling */
.van-icon {
  @apply transition-colors duration-200;
}

/* Card hover effects */
.bg-white {
  @apply transition-shadow duration-200;
}

.bg-white:hover {
  @apply shadow-md;
}

/* Category badge styling */
.rounded-full {
  @apply font-medium;
}
</style>