<template>
    <div class="chat-app">
        <!-- Status Bar -->


        <!-- Header -->
        <!-- <div class="header">
            <div class="header-left">
                <Button icon="pi pi-arrow-left" class="back-btn" text @click="goBack" />
                <h1 class="header-title">แชท</h1>
            </div>
            <Button class="create-group-btn" @click="createGroup">
                <i class="pi pi-plus"></i>
                <span>สร้างกลุ่ม</span>
            </Button>
        </div> -->
        <!-- <div class="bg-primary-main text-white flex items-center justify-between px-4 py-3">
 
    <div class="flex items-center gap-2">
      <Button
        icon="pi pi-chevron-left"
        @click="goBack"
        text
        class="text-white p-0 m-0"
        style="font-size: 1.25rem"
      />
      <span class="text-base font-semibold">แชท</span>
    </div>

    <Button
      outlined
      class="text-white border-white text-sm rounded-full px-3 py-1 flex items-center gap-2"
      @click="createGroup"
    >
      <i class="pi pi-plus-circle text-base" />
      <span>สร้างกลุ่ม</span>
    </Button>
  </div> -->
        <LayoutsBaseHeader title="แชท" :showBack="true" :showMenu="true">
            <template #right>

                <button class="flex items-center gap-2 border border-white text-white  px-4  py-1 rounded-full hover:bg-white hover:text-primary-main transition
                    !font-thin">
                    <i class="pi pi-plus text-lg "></i>
                    <span>สร้างกลุ่ม</span>
                </button>
            </template>
        </LayoutsBaseHeader>

        <!-- Chat List -->
        <div class="chat-list">
            <div v-for="chat in chatRooms" :key="chat.id" class="chat-item" @click="openChat(chat)">
                <!-- Chat Content -->
                <div class="chat-content">
                    <!-- Avatar -->
                    <div class="avatar-container">
                        <img v-if="chat.avatar" :src="chat.avatar" :alt="chat.name" class="chat-avatar" />
                        <div v-else class="chat-avatar-placeholder">
                            <i :class="chat.isGroup ? 'pi pi-users' : 'pi pi-user'"></i>
                        </div>
                    </div>

                    <!-- Chat Info -->
                    <div class="chat-info">
                        <!-- <div class="chat-header">
                            <h3 class="chat-name flex items-center gap-1">
                                <span class="truncate">{{ chat.name }}</span>
                                <span v-if="chat.isGroup" class="flex-shrink-0 font-medium text-gray-900 text-base">({{
                                    chat.memberCount }})</span>
                            </h3>
                            <div class="flex flex-col items-end justify-center gap-1">
                                <span class="chat-time text-xs text-gray-400">{{ chat.time }}</span>
                                <Badge v-if="chat.unreadCount > 0" :value="chat.unreadCount" severity="danger"
                                    class="text-xs font-semibold" />
                            </div>
                        </div> -->
                        <div class="chat-header flex justify-between items-start gap-2">
  <!-- Left: Chat name -->
  <h3 class="chat-name flex items-center gap-1 flex-1 min-w-0">
    <span class="truncate">{{ chat.name }}</span>
    <span v-if="chat.isGroup" class="flex-shrink-0 font-medium text-gray-900 text-base">
      ({{ chat.memberCount }})
    </span>
  </h3>

  <!-- Right: Time + Badge -->
  <div class="flex flex-col items-end flex-shrink-0 text-nowrap">
    <span class="chat-time text-xs text-gray-400 whitespace-nowrap">{{ chat.time }}</span>
    <Badge
      v-if="chat.unreadCount > 0"
      :value="chat.unreadCount"
      severity="danger"
      class="text-xs font-semibold mt-1"
    />
  </div>
</div>
                        <p class="chat-message">{{ chat.lastMessage }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'

// Mock data
const chatRooms = ref([
    {
        id: 1,
        name: 'ตลาดน้ำ ตลาดวิถีชุมชน ตลาดวิถีชุมชน ตลาดวิถีชุมชน ...',
        memberCount: 15,
        lastMessage: 'ได้ครับ จะดำเนินการให้ครับ',
        time: '15 นาทีที่แล้ว',
        unreadCount: 2,
        avatar: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&h=150&fit=crop&crop=center',
        isGroup: true,
        memberCount: 15
    },
    {
        id: 2,
        name: 'ตลาดน้ำ 4 ภาค',
        lastMessage: 'รับทราบครับ จะจัดเปิดปิดให้ด้วยครับ',
        time: '15 นาทีที่แล้ว',
        unreadCount: 1,
        avatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop&crop=center',
        isGroup: true,
        memberCount: 8
    },
    {
        id: 3,
        name: 'เกาะยาม สัตหีบ',
        lastMessage: 'ได้ครับ',
        time: '15 นาทีที่แล้ว',
        unreadCount: 0,
        avatar: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=150&h=150&fit=crop&crop=center',
        isGroup: false
    },
    {
        id: 4,
        name: 'หาดจอมเทียน',
        lastMessage: 'ครับ',
        time: '15 นาทีที่แล้ว',
        unreadCount: 0,
        avatar: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=150&h=150&fit=crop&crop=center',
        isGroup: false
    }
])

// Methods
const goBack = () => {
    // Navigate back
    console.log('Go back')
}

const createGroup = () => {
    // Create new group
    console.log('Create group')
}

const openChat = (chat) => {
    // Open chat room
    console.log('Open chat:', chat.name)
}
</script>

<style scoped>
.chat-app {

    margin: 0 auto;
    padding: 0px;
    background-color: #ffffff;
    min-height: 100vh;
    /* font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif; */
}

/* Status Bar */
.status-bar {
    @apply bg-blue-800 text-white px-4 py-2 flex justify-between items-center text-sm font-medium;
}


.signal-icon::before {
    content: "📶";
}

.wifi-icon::before {
    content: "📶";
}

.battery-icon::before {
    content: "🔋";
}

/* Header */
.header {
    @apply bg-blue-800 text-white px-4 py-3 flex justify-between items-center;
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

.create-group-btn {
    @apply bg-blue-600 hover:bg-blue-700 border-0 px-3 py-1 text-sm rounded-full flex items-center space-x-1;
}

/* Chat List */
.chat-list {
    @apply bg-white;
}

.chat-item {
    @apply border-b border-gray-100 px-4 py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors;
}

.chat-content {
    @apply flex items-center space-x-3;
}

/* Avatar */
.avatar-container {
    @apply flex-shrink-0;
}

.chat-avatar {
    @apply w-12 h-12 rounded-full object-cover;
}

.chat-avatar-placeholder {
    @apply w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg;
}

/* Chat Info */
.chat-info {
    @apply flex-1 min-w-0;
}

.chat-header {
  @apply flex justify-between items-start gap-2;
}

.chat-name {
  @apply font-medium text-gray-900 text-base m-0 pr-2 flex-1 min-w-0 flex items-center gap-1;
}
.chat-time {
  @apply text-xs text-gray-400 flex-shrink-0;
}

.chat-message {
    @apply text-sm text-gray-600 m-0 truncate;
}

/* Unread Badge */
.unread-badge {
    @apply flex-shrink-0;
}

.unread-badge :deep(.van-badge) {
    background-color: #ef4444 !important;
}

.van-nav-bar {
    --van-nav-bar-background: #1c2b75;
    --van-nav-bar-text-color: white;
    --van-nav-bar-title-text-color: white;
}
</style>