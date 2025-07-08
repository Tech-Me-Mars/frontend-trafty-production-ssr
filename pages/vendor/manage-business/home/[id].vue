<template>
    <div class="min-h-screen bg-zinc-50">
        <van-nav-bar :title="t('ธุรกิจในแหล่งท่องเที่ยว')">
            <template #left>
                <drawer-menu />
            </template>
            <template #right>
                <div class="flex items-center gap-2">
                    <!-- <change-lang /> -->
                    <!-- <i class="fa-solid fa-magnifying-glass" style="color: white;font-size: 22px;"></i> -->
                    <div class="border p-0.5 rounded-md w-7 flex justify-center items-center">
                        <i class="fa-regular fa-comment-dots" style="color: white;font-size: 22px;"></i>
                    </div>
                    <div class="border p-0.5 rounded-md w-7 flex justify-center items-center">
                        <van-badge :dot="resNotify.length>0?true: false">
                            <i @click="navigateTo(`/vendor/notifications/${route.params.id}`)" class="fa-regular fa-bell" style="color: white;font-size: 22px;"></i>
                        </van-badge>
                    </div>

                </div>

            </template>
        </van-nav-bar>

        <section class="">
            <!-- Header Section -->
            <div class="flex items-center w-full card mb-2">
                <!-- Image -->
                <!-- <img src="https://via.placeholder.com/50" alt="Business Image" class="w-12 h-12 rounded-full object-cover"> -->
                <!-- {{ resBusinessAll?.business_name?.image_profile }} -->
                <Image
                    :src="resBusinessAll?.business_name?.image_profile"
                    alt="Image" width="50" class="object-cover w-20 h-20 rounded-md shadow-md"
                    :pt="{ image: { class: 'object-cover w-20 h-20 rounded-md shadow-md' } }" preview />
                <!-- Info Section -->
                <div class="ml-4 flex-1">
                    <h2 class="text-lg font-bold">{{ resBusinessAll?.business_name?.shop_name  }}</h2>
                    <p class="text-sm text-gray-500">{{ resBusinessAll?.business_name?.business_type_name }}</p>

                    <span v-if="resBusinessAll?.business_name?.status_survey"
                        class="flex items-center justify-center px-2 py-1 text-xs font-medium text-white bg-orange-600 rounded">
                        <i class="fa-solid fa-circle-exclamation mr-1"></i>
                        {{ resBusinessAll?.business_name?.status_survey }}
                    </span>

                </div>

                <!-- Approval Status -->

            </div>

            <!-- Progress Section -->
            <div class="w-full card">
                <h2 class="text-lg font-bold">{{ t('ข้อมูลธุรกิจในแหล่งท่องเที่ยว') }}</h2>
                <div class="flex items-center mt-2 gap-4 cursor-pointer mb-5" v-if="resBusinessAll?.score_show == true">
                    <!-- Knob Component -->
                    <van-circle v-model:current-rate="currentRate" :rate="rate" :speed="100" :stroke-width="60"
                        color="#202c54" layer-color="#ebedf0" size="60px" :text="textRate"  />

                    <!-- Description -->
                    <div class="flex w-full justify-between">
                        <p class="">{{ t('มาตรฐานความปลอดภัย') }}</p>
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>

                </div>
    
                <div class="max-w-xl mx-auto">
                    <NuxtLink :to="`/vendor/manage-business/survay/form1/${route.params.id}`" v-if="isCheckAudit == false">
                        <Button :loading="isloadingAxi" :label="t('เริ่มประเมินมาตรฐานความปลอดภัย')" severity="primary" size="" rounded class="w-full"
                            variant="outlined" :pt="{
                                root: {
                                    class: '!border-primary-main'
                                },
                            }" />
                    </NuxtLink>
                </div>



            </div>

            <div class="card border-t grid grid-cols-3 gap-4 mb-3">
                <div class="bg-white text-center p-4 border-r-2">
                    <div>
                        <div class="text-xl font-bold">{{ resBusinessAll?.count_list }}</div>
                        <div class="text-gray-600 text-sm">{{ t('รายการทั้งหมด') }}</div>
                    </div>
                </div>
                <div class="bg-white text-center p-4 border-r-2">
                    <div class="cursor-pointer" @click="navigateTo(`/vendor/warning-list/${route.params.id}`)">
                        <div class="text-xl font-bold">{{ resBusinessAll?.count_warning }}</div>
                        <div class="text-gray-600 text-sm">{{ t('ใบเตือน') }}</div>
                    </div>
                </div>
                <div class="bg-white text-center p-4 ">
                    <div>
                        <div class="text-xl font-bold">{{ resBusinessAll?.count_comment }}</div>
                        <div class="text-gray-600 text-sm">{{ t('คอมเมนต์') }}</div>
                    </div>
                </div>
            </div>

            <div class="flex justify-between items-center px-4">
                <h2 class="text-lg font-bold">{{ t('รายการของฉัน') }}</h2>
                <a href="#" class="hover:underline cursor-pointer">{{ t('ดูทั้งหมด') }}
                    <i class="fa-solid fa-chevron-right" style="font-size: 14px;"></i></a>

            </div>
            <div class="p-4 flex-col space-y-3">
                <div v-for="(item, index) in resBusinessAll?.business_list" :key="index"
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

                            <Button :loading="isloadingAxi" :label="t('ไม่แสดง')" severity="primary" variant="outlined" class="w-full" :pt="{
                                label: {
                                    class: 'text-primary-main'
                                },
                                root: {
                                    class: '!border-primary-main'
                                },

                            }" />
<Button
  :loading="isloadingAxi"
  :label="t('แก้ไข')"
  severity="primary"
  variant="outlined"
  class="w-full"
  @click="openEdit(item)"
  :pt="{
    label: { class: 'text-primary-main' },
    root: { class: '!border-primary-main' }
  }"
/>
                            <Button :loading="isloadingAxi" @click="showConfirmDel(item)" icon="fa-regular fa-trash-can" label="" severity="danger" variant="outlined"
                                class="!w-[10rem]" />
                        </div>
                    </div>
                </div>
            </div>

        </section>
        <van-action-sheet
  v-model:show="showEditSheet"
  :close-on-click-overlay="true"
  :round="true"
  safe-area-inset-bottom
  title="แก้ไขรายการ"
>
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
      <Button
        label="ยกเลิก"
        severity="secondary"
        outlined
        class="w-full"
        @click="showEditSheet = false"
      />
      <Button
        label="บันทึก"
        class="w-full bg-[#202c54] text-white"
        @click="submitEdit"
      />
    </div>
  </div>
</van-action-sheet>
      <MyToast :data="alertToast" />
      <ConfirmDialog></ConfirmDialog>

    </div>
</template>
<style scoped>
.van-nav-bar {
    --van-nav-bar-background: #281c74;
    --van-nav-bar-text-color: white;
    --van-nav-bar-icon-color: white;
    --van-nav-bar-title-text-color: white;
    --van-nav-bar-height: 70px
}
</style>
<script setup>
definePageMeta({
  middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const isloadingAxi = useState("isloadingAxi");
const router = useRouter();
const route = useRoute();
const alertToast = ref({});
import * as dataApi from "./api/data.js";

const currentRate = ref(0);
const rate = ref(0)
const textRate = computed(() => currentRate.value.toFixed(0) + '%');

const resBusinessAll=ref()
const loadBusinessAll =async()=>{
    try {
        const res =await dataApi.getbusinessAll(route.params.id);
        resBusinessAll.value = res.data.data;
        currentRate.value =await res.data.data?.score_percent
        rate.value =await res.data.data?.score_percent
        console.log('currentRate',res.data.data?.score_percent)
    } catch (error) {
        console.error(error)
    }
}

const resNotify=ref([])
const loadNotify = async ()=>{
    try {
        const res = await dataApi.getNotify(route.params.id);
        resNotify.value =res.data.data;
    } catch (error) {
        console.error(error)
    }
}

const resComments=ref([])
const loadComments = async ()=>{
    try {
        const res = await dataApi.getComments(route.params.id);
        resComments.value =res.data.data;
    } catch (error) {
        console.error(error)
    }
}

const isCheckAudit=ref(true)
const loadCheckAudit = async ()=>{
    try {
        const res = await dataApi.getCheckIsSurvey(route.params.id);
        isCheckAudit.value =res.data.data;
    } catch (error) {
        console.error(error)
    }
}

onMounted(()=>{
    loadBusinessAll();
    loadNotify();
    // loadComments();
    loadCheckAudit();
})

// Function to remove an item
const removeItem = (index) => {
    items.value.splice(index, 1)
}
const confirm1 = useConfirm();
const itemForDelete=ref()
const showConfirmDel = (item) => {
    itemForDelete.value = item; // เก็บ item ที่ต้องการลบ
    confirm1.require({
        message: `${t('ยืนยันการลบ')}?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: t('ยกเลิก'),
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: t('ตกลง')
        },
        accept: async () => {
            await DeleteItems();
        },
        reject: () => {
            console.log('Action was rejected');
        }
    });
};

const DeleteItems = async () => {
    try {
        const res = await dataApi.deletebusinessItem(itemForDelete.value.id);
        alertToast.value = {
            title: t('สำเร็จ'),
            color: 'info',
            isError: false,
            msg: res.data.message,
        }
        loadBusinessAll();
    } catch (error) {
        alertToast.value = {
            title: t('ล้มเหลว'),
            isError: true,
            color: "error",
            msg: error.response?.data?.message || "Error occurred",
            dataError: error,
        };
        console.error('Error deleting item:', error);
    }
};

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

const submitEdit = async () => {
  try {
    const payload = {
      name: editForm.value.name,
      price: editForm.value.price
    }
    const res = await dataApi.updateBusinessItem(editForm.value.id, payload)
    alertToast.value = {
      title: t('สำเร็จ'),
      msg: res.data.message,
      color: 'info',
      isError: false
    }
    showEditSheet.value = false
    loadBusinessAll()
  } catch (error) {
    alertToast.value = {
      title: t('ล้มเหลว'),
      msg: error.response?.data?.message || 'Error occurred',
      color: 'error',
      isError: true
    }
    console.error(error)
  }
}
</script>