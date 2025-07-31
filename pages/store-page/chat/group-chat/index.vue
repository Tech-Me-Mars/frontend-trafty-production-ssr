<template>
    <div class="chat-room">
    <LayoutsBaseHeader title="" :showBack="true">
      <template #left>
        <div class="flex items-center gap-3">
          <img :src="chatInfo.avatar" class="w-10 h-10 rounded-md object-cover" />
          <div class="flex flex-col leading-tight text-white">
            <span class="text-sm font-semibold truncate ">{{ chatInfo.name }}</span>
            <span class="text-xs opacity-80">{{ chatInfo.subtitle }}</span>
          </div>
        </div>
      </template>
    </LayoutsBaseHeader>

        <!-- Chat Messages -->
        <div class="chat-messages" ref="messagesContainer">
            <!-- Date Separator -->
            <div class="date-separator">
                <span class="date-text">วันนี้</span>
            </div>

            <!-- Messages -->
            <div v-for="message in messages" :key="message.id"
                :class="['message-container', message.isOwn ? 'own-message' : 'other-message']">
                <!-- Other user's avatar for group chat -->
                <div v-if="!message.isOwn && chatInfo.isGroup" class="message-avatar">
                    <img :src="message.avatar" :alt="message.sender" class="sender-avatar" />
                </div>

                <!-- Message bubble -->
                <div class="message-wrapper">
                    <div :class="['message-bubble', message.isOwn ? 'own-bubble' : 'other-bubble']">
                        <p class="message-text">{{ message.text }}</p>
                        <div class="message-footer">
                            <span class="message-time">{{ message.time }}</span>
                            <i v-if="message.isOwn"
                                :class="['message-status', getMessageStatusIcon(message.status)]"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Other user's name for group chat -->
            <div v-if="!messages[messages.length - 1]?.isOwn && chatInfo.isGroup" class="sender-name">
                {{ messages[messages.length - 1]?.sender }}
            </div>
        </div>

        <!-- Message Input -->
        <div class="message-input-container">
            <div class="input-wrapper">
                <InputText v-model="newMessage" placeholder="พิมพ์ข้อความ..." class="message-input"
                    @keyup.enter="sendMessage" />
                <Button icon="pi pi-send" class="send-btn" :disabled="!newMessage.trim()" @click="sendMessage" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

// Chat info
const chatInfo = ref({
  name: 'ตลาดน้ำ ตลาดวิถีชุมชน ถนนคนเดิน',
  subtitle: 'สมาชิก 15 คน',
  avatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop&crop=center',
  isGroup: true
})

// Messages mock data
const messages = ref([
    {
        id: 1,
        text: 'เมื่องจากแหล่งท่องเที่ยวของคนไปผ่าน เก็บกิจประเนินของ นต.กก ครุฑบาปริบูรณ์ และภาคเจ้าหน้าที่จะเข้าไปตรวจสอบอีกครั้ง ในภายหลัง',
        time: '14:30',
        isOwn: true,
        status: 'read', // sent, delivered, read
        sender: 'คุณ'
    },
    {
        id: 2,
        text: 'รับทราบครับ จะจัดเปิดปิดให้ด้วยครับ',
        time: '14:32',
        isOwn: false,
        sender: 'Admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=center'
    }
])

// New message input
const newMessage = ref('')
const messagesContainer = ref(null)

// Methods
const goBack = () => {
    console.log('Go back to chat list')
}

const sendMessage = () => {
    if (!newMessage.value.trim()) return

    const message = {
        id: Date.now(),
        text: newMessage.value,
        time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        status: 'sent',
        sender: 'คุณ'
    }

    messages.value.push(message)
    newMessage.value = ''

    // Scroll to bottom
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
    })
}

const getMessageStatusIcon = (status) => {
    switch (status) {
        case 'sent': return 'pi pi-check'
        case 'delivered': return 'pi pi-check-circle'
        case 'read': return 'pi pi-eye'
        default: return ''
    }
}

onMounted(() => {
    // Scroll to bottom on mount
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
    })
})
</script>

<style scoped>
.chat-room {
    /* margin: 0 auto;
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif; */
    @apply flex flex-col min-h-screen h-screen;

}

/* Status Bar */
.status-bar {
    @apply bg-blue-900 text-white px-4 py-2 flex justify-between items-center text-sm font-medium;
}

.status-icons {
    @apply flex items-center space-x-1;
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
.chat-header {
    @apply bg-blue-900 text-white px-4 py-3;
    border-bottom: 2px solid #fbbf24;
}

.header-left {
    @apply flex items-center space-x-3;
}

.back-btn {
    @apply text-white p-0 min-w-0 mr-2;
    background: transparent !important;
    border: none !important;
}

.back-btn:hover {
    background: rgba(255, 255, 255, 0.1) !important;
}

.header-info {
    @apply flex items-center space-x-3;
}

.header-avatar {
    @apply w-10 h-10 rounded-full object-cover;
}

.header-text {
    @apply flex flex-col;
}

.chat-title {
    @apply text-base font-medium m-0 leading-tight;
}

.chat-subtitle {
    @apply text-xs text-blue-200 m-0 leading-tight;
}

/* Messages Container */
.chat-messages {
    /* flex: 1; */
    @apply flex-1 overflow-y-auto px-4 py-4 space-y-4;
    background: linear-gradient(to bottom, #f9fafb, #f3f4f6);
}

/* Date Separator */
.date-separator {
    @apply flex justify-center mb-4;
}

.date-text {
    @apply bg-gray-300 text-gray-600 px-3 py-1 rounded-full text-xs font-medium;
}

/* Message Container */
.message-container {
    @apply flex items-end space-x-2 mb-3;
}

.own-message {
    @apply flex-row-reverse space-x-reverse;
}

.other-message {
    @apply flex-row;
}

/* Message Avatar */
.message-avatar {
    @apply flex-shrink-0 mb-1;
}

.sender-avatar {
    @apply w-8 h-8 rounded-full object-cover;
}

/* Message Wrapper */
.message-wrapper {
    @apply max-w-xs;
}

.own-message .message-wrapper {
    @apply ml-auto;
}

/* Message Bubble */
.message-bubble {
    @apply px-4 py-2 rounded-2xl shadow-sm;
}

.own-bubble {
    @apply bg-blue-800 text-white rounded-br-md;
}

.other-bubble {
    @apply bg-white text-gray-800 rounded-bl-md;
    border: 1px solid #e5e7eb;
}

.message-text {
    @apply text-sm leading-relaxed m-0 mb-1;
}

.message-footer {
    @apply flex items-center justify-between mt-1;
}

.message-time {
    @apply text-xs opacity-70;
}

.own-bubble .message-time {
    @apply text-blue-100;
}

.other-bubble .message-time {
    @apply text-gray-500;
}

.message-status {
    @apply text-xs ml-1;
}

.own-bubble .message-status {
    @apply text-blue-100;
}

/* Sender Name */
.sender-name {
    @apply text-xs text-gray-500 ml-10 mt-1;
}

/* Message Input */
.message-input-container {
    @apply bg-white border-t border-gray-200 p-4;
}

.input-wrapper {
    @apply flex items-center space-x-2;
}

.message-input {
    @apply flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.send-btn {
    @apply bg-blue-600 hover:bg-blue-700 border-0 p-2 rounded-full min-w-0 w-10 h-10 flex items-center justify-center;
}

.send-btn:disabled {
    @apply bg-gray-300 cursor-not-allowed;
}

.send-btn:disabled:hover {
    @apply bg-gray-300;
}

/* Scrollbar Styling */
.chat-messages::-webkit-scrollbar {
    width: 4px;
}

.chat-messages::-webkit-scrollbar-track {
    background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
}
</style>