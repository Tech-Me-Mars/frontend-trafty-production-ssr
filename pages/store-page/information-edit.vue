<template>
    <div class="min-h-screen bg-gray-50">

        <LayoutsBaseHeader title="รายการของฉัน" :showBack="true">
        </LayoutsBaseHeader>
        <section>
            <van-tabs v-model:active="activeTab">
                <van-tab title="แสดงอยู่">

                </van-tab>
                <van-tab title="ไม่แสดง">

</van-tab>
            </van-tabs>
            <div class="p-4 flex-col space-y-3">
                <div v-for="(item, index) in resBusinessAll" :key="index"
                    class="border rounded-lg shadow-md bg-white w-full max-w-md mx-auto">
                    <div class="p-3">
                        <!-- ชื่อธุรกิจ -->
                        <div class="flex justify-between items-center">
                            <h2 class="text-lg font-semibold text-gray-800">{{ item?.business_list_name }}</h2>
                            <p class="text-gray-800 ">฿{{ item?.business_list_price }}</p>
                        </div>
                        <!-- ปุ่มแอคชัน -->
                        <hr class="border-t mt-2 mb-4">
                        <div class="flex  gap-3">

                            <Button :loading="isloadingAxi" :label="t('ไม่แสดง')" severity="primary" variant="outlined"
                                class="w-full" :pt="{
                                    label: {
                                        class: 'text-primary-main'
                                    },
                                    root: {
                                        class: '!border-primary-main'
                                    },

                                }" />
                            <Button :loading="isloadingAxi" :label="t('แก้ไข')" severity="primary" variant="outlined"
                                class="w-full" @click="openEdit(item)" :pt="{
                                    label: { class: 'text-primary-main' },
                                    root: { class: '!border-primary-main' }
                                }" />
                            <Button :loading="isloadingAxi" @click="showConfirmDel(item)" icon="fa-regular fa-trash-can"
                                label="" severity="danger" variant="outlined" class="!w-[10rem]" />
                        </div>
                    </div>
                </div>
            </div>

            <van-action-sheet v-model:show="showEditSheet" :close-on-click-overlay="true" :round="true"
            safe-area-inset-bottom title="แก้ไขรายการ">
            <div class="px-4 pb-6 pt-2">
                <div class="mb-4">
                    <label class="block text-sm font-semibold text-gray-700 mb-1">ชื่อรายการ</label>
                    <InputText v-model="editForm.name" class="w-full" />
                </div>
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-gray-700 mb-1">ราคา</label>
                    <InputText v-model="editForm.price" class="w-full" />
                </div>
                <div class="flex justify-between gap-3">
                    <Button label="ยกเลิก" severity="secondary" outlined class="w-full"
                        @click="showEditSheet = false" />
                    <Button label="บันทึก" class="w-full bg-[#202c54] text-white" @click="submitEdit" />
                </div>
            </div>
        </van-action-sheet>
        </section>
    </div>
</template>

<script setup>
// definePageMeta({
//     middleware: ["auth"],
// });
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const isloadingAxi = useState("isloadingAxi");
const router = useRouter();
const route = useRoute();
const alertToast = ref({});
// import * as dataApi from "./api/data.js";


const resBusinessAll = ref([
    {id:1,business_list_name:"เสต๊ก",business_list_price:"300฿"},
])

const showEditSheet = ref(false)
const editForm = ref({
    id: null,
    name: '',
    price: ''
})

const openEdit = (item) => {
    editForm.value = {
        id: item.id,
        name: item.business_list_name,
        price: item.business_list_price
    }
    showEditSheet.value = true
}
const activeTab = ref(0);
</script>
<style>
.van-tabs__line {
  width: 120px !important;
  background: #281c74 !important;
}
.van-tab {
  --van-tab-active-text-color: #281c74 !important
}
</style>