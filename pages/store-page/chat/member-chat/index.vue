<template>
  <div class="chat-members">


    <!-- Header -->
        <LayoutsBaseHeader title="สมาชิก" :showBack="true" :showMenu="false">

        </LayoutsBaseHeader>

    <!-- Members Content -->
    <div class="members-content">
      <!-- Group Info -->
      <div class="group-info">
        <h2 class="group-title">สมาชิกทั้งหมด ({{ members.length }})</h2>
      </div>

      <!-- Members List -->
      <div class="members-list">
        <div 
          v-for="member in members" 
          :key="member.id"
          class="member-item"
          @click="viewMemberProfile(member)"
        >
          <div class="member-content">
            <!-- Avatar -->
            <div class="member-avatar-container">
              <img 
                :src="member.avatar" 
                :alt="member.name"
                class="member-avatar"
              />
              <div 
                v-if="member.isOnline" 
                class="online-indicator"
              ></div>
            </div>
            
            <!-- Member Info -->
            <div class="member-info">
              <h3 class="member-name">{{ member.name }}</h3>
              <p v-if="member.status" class="member-status">{{ member.status }}</p>
            </div>

            <!-- Admin Badge -->
            <div v-if="member.isAdmin" class="admin-badge">
              <i class="pi pi-crown"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'

// Members mock data
const members = ref([
  {
    id: 1,
    name: 'ตลาดน้ำ 4 ภาค',
    avatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop&crop=center',
    isOnline: true,
    isAdmin: true,
    status: 'ผู้ดูแลกลุ่ม'
  },
  {
    id: 2,
    name: 'ตลาดยากแข็ง',
    avatar: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&h=150&fit=crop&crop=center',
    isOnline: false,
    isAdmin: false,
    status: 'ออนไลน์ล่าสุด 2 ชั่วโมงที่แล้ว'
  },
  {
    id: 3,
    name: 'โฮโทคาวบี',
    avatar: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=150&h=150&fit=crop&crop=center',
    isOnline: true,
    isAdmin: false,
    status: 'ออนไลน์'
  },
  {
    id: 4,
    name: 'ตลาดเทพประสิทธิ์',
    avatar: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=150&h=150&fit=crop&crop=center',
    isOnline: false,
    isAdmin: false,
    status: 'ออนไลน์ล่าสุด 5 นาทีที่แล้ว'
  },
  {
    id: 5,
    name: 'Jomtien Beach Night Market',
    avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center',
    isOnline: true,
    isAdmin: false,
    status: 'ออนไลน์'
  },
  {
    id: 6,
    name: 'ตลาดท่าช้างหลีบ',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=center',
    isOnline: false,
    isAdmin: false,
    status: 'ออนไลน์ล่าสุด 1 ชั่วโมงที่แล้ว'
  },
  {
    id: 7,
    name: 'พนาหินผึ้งบาร์ดิด',
    avatar: 'https://images.unsplash.com/photo-1574870111867-089730e5a72b?w=150&h=150&fit=crop&crop=center',
    isOnline: true,
    isAdmin: false,
    status: 'ออนไลน์'
  },
  {
    id: 8,
    name: 'ตลาดประมงพื้นบ้านวังศิลา',
    avatar: 'https://images.unsplash.com/photo-1566134190394-54856a5e7ad4?w=150&h=150&fit=crop&crop=center',
    isOnline: false,
    isAdmin: false,
    status: 'ออนไลน์ล่าสุด 30 นาทีที่แล้ว'
  }
])

// Methods
const goBack = () => {
  console.log('Go back to chat')
}

const viewMemberProfile = (member) => {
  console.log('View profile:', member.name)
}
</script>

<style scoped>
.chat-members {
  margin: 0 auto;
  background-color: #f3f4f6;
  min-height: 100vh;
}

/* Status Bar */
.status-bar {
  @apply bg-blue-900 text-white px-4 py-2 flex justify-between items-center text-sm font-medium;
}

.status-icons {
  @apply flex items-center space-x-1;
}



/* Header */
.members-header {
  @apply bg-blue-900 text-white px-4 py-3;
  border-bottom: 3px solid #fbbf24;
}

.header-left {
  @apply flex items-center space-x-3;
}

.back-btn {
  @apply text-white p-0 min-w-0;
  background: transparent !important;
  border: none !important;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

.header-title {
  @apply text-lg font-medium m-0;
}

/* Members Content */
.members-content {
  @apply p-1;
}

/* Group Info */
.group-info {
  @apply mb-4;
}

.group-title {
  @apply text-base font-medium text-gray-600 m-0;
}

/* Members List */
.members-list {
  @apply space-y-0;
}

.member-item {
  @apply bg-white border-b border-gray-100 px-4 py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150;
}

.member-item:first-child {
  @apply rounded-t-lg;
}

.member-item:last-child {
  @apply rounded-b-lg border-b-0;
}

.member-content {
  @apply flex items-center space-x-3;
}

/* Member Avatar */
.member-avatar-container {
  @apply relative flex-shrink-0;
}

.member-avatar {
  @apply w-12 h-12 rounded-full object-cover;
}

.online-indicator {
  @apply absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full;
}

/* Member Info */
.member-info {
  @apply flex-1 min-w-0;
}

.member-name {
  @apply font-medium text-gray-900 text-base m-0 mb-1 truncate;
}

.member-status {
  @apply text-sm text-gray-500 m-0 truncate;
}

/* Admin Badge */
.admin-badge {
  @apply flex-shrink-0 bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full;
}

.admin-badge i {
  @apply text-sm;
}

/* Responsive Design */
@media (max-width: 375px) {
  .member-avatar {
    @apply w-10 h-10;
  }
  
  .member-name {
    @apply text-sm;
  }
  
  .member-status {
    @apply text-xs;
  }
}

/* Smooth Animations */
.member-item {
  transform: translateY(0);
  transition: all 0.2s ease-in-out;
}

.member-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.member-item:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

/* Loading Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.member-item {
  animation: fadeIn 0.3s ease-out;
}

.member-item:nth-child(1) { animation-delay: 0.05s; }
.member-item:nth-child(2) { animation-delay: 0.1s; }
.member-item:nth-child(3) { animation-delay: 0.15s; }
.member-item:nth-child(4) { animation-delay: 0.2s; }
.member-item:nth-child(5) { animation-delay: 0.25s; }
.member-item:nth-child(6) { animation-delay: 0.3s; }
.member-item:nth-child(7) { animation-delay: 0.35s; }
.member-item:nth-child(8) { animation-delay: 0.4s; }
</style>