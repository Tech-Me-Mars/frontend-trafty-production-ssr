<template>
    <div class="min-h-screen bg-zinc-50">
        <LayoutsBaseHeader title="แบบตรวจสอบด้านความปลอดภัย" :showBack="true">
        </LayoutsBaseHeader>

        <section class="p-4 pt-8">
            <div class="w-full mx-auto">

                <!-- หัวข้อ -->
                <h2 class="text-center text-2xl font-bold text-[#232323] mb-[4rem]">
                    ข้อเสนอแนะเพิ่มเติม (ถ้ามี)
                </h2>

                <!-- ภาพประกอบ -->
                <div class="flex justify-center mb-[4rem]">
                    <img src="/image/bg/send_message.png" alt="Send message"
                        class="w-[150px] h-[150px] object-contain" />
                </div>

                <!-- คำอธิบาย -->
                <div class="text-center text-[#35387a] text-sm mb-[2rem]">
                    หากเจ้าหน้าที่มีข้อเสนอแนะเพิ่มเติม<br>
                    กรุณาระบุในช่องข้อความด้านล่าง
                </div>

                <!-- Input -->
                <div class="w-full mb-[3rem]">
                    <Textarea v-model="message" class="w-full" autoResize rows="4" placeholder="พิมพ์ข้อความ..." />
                </div>

                <!-- Button -->
                <div class="mt-6 flex justify-center">
                    <Button rounded
                        class="w-full py-2 rounded-full bg-[#272e77] hover:bg-[#20245a] text-white text-base font-semibold shadow-md transition"
                        label="ส่งแบบประเมิน" @click="onSubmit" />
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref } from 'vue'
//   import { InputTextarea } from 'primevue/inputtextarea'
//   import { Button } from 'primevue/button'

const message = ref('')
const onSubmit = () => {
    // submit action
    alert(message.value || 'ไม่มีข้อความเพิ่มเติม')
}
</script>

<style scoped>
/* ปรับแต่งขอบ input ให้เหมือนในภาพ (PrimeVue InputTextarea) */
.p-inputtextarea {
    min-height: 100px !important;
    font-size: 1rem;
    background: transparent;
    border-radius: 12px;
    box-shadow: none;
}

.p-inputtextarea:focus {
    outline: none;
    border-color: #4254f2;
}

/* ซ่อน scrollbar เวลาใช้งานมือถือ */
.p-inputtextarea::-webkit-scrollbar {
    display: none;
}
</style>