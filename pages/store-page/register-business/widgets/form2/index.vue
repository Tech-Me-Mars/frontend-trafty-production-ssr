<script setup>
definePageMeta({
  middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const isloadingAxi = useState("isloadingAxi");
import { ref } from "vue";
import { useRouter } from "vue-router";
// import { Form, useForm } from "vee-validate";
// import * as yup from "yup";
import { useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import * as dataApi from "../../api/data.js";

const router = useRouter();
const alertToast = ref({});

const resBusinessModel =ref([])
const loadBusinessModel = async()=>{
    try{
        const res =await dataApi.getBusinessModel();
        resBusinessModel.value = res.data.data;
    }catch(error){
        console.error(error)
    }
}
onMounted(()=>loadBusinessModel())
const stepsBar = ref([
    { step: 1, active: false },
    { step: 2, active: true },
    { step: 3, active: false },
    { step: 4, active: false },
    { step: 5, active: false },
])


const requireValue = t('เลือกรูปแบบธุรกิจในแหล่งท่องเที่ยว');
// *************  VARIDATOR
const validationSchema = toTypedSchema(
    zod.object({
        selectedItem: zod.number({ required_error: requireValue,invalid_type_error: requireValue, }),
    })
);
const { handleSubmit, handleReset, errors } = useForm({
    validationSchema,
});

const { value: selectedItem } = useField('selectedItem', null, {
    initialValue: null
})
import { useFormStore } from "@/store/businessStore.js";
const formStore = useFormStore(); // ใช้ Pinia Store
const handleNext = handleSubmit(() => {
//   const selectedBusiness = resBusinessModel.value.find(
//     (item) => item.id == selectedItem.value
//   );
//   if (selectedBusiness) {
//     localStorage.setItem("business_model_id", selectedBusiness.id);
//     localStorage.setItem("business_model_name", selectedBusiness.business_model_name);
//     router.push("/vendor/register-business/form3");
//   }
const selectedBusiness = resBusinessModel.value.find(
    (item) => item.id == selectedItem.value
  );
  
  if (selectedBusiness) {
    // เก็บค่าลง Pinia แทน LocalStorage
    formStore.setForm2(selectedBusiness.id, selectedBusiness.business_model_name, selectedBusiness.is_corporation);
    
    // เปลี่ยนหน้าไป form3
    formStore.nextPage();
  }
});
</script>
<style >
.van-nav-bar {
    --van-nav-bar-background: #281c74;
    --van-nav-bar-text-color: white;
    --van-nav-bar-icon-color: white;
    --van-nav-bar-title-text-color: white;
    --van-nav-bar-height: 70px
}
</style>
<template>
    <div class="bg-zinc-100 min-h-screen">
        <LayoutsBaseHeader :title="t('หน่วยงานแหล่งท่องเที่ยว')">
            <template #left>
                <ButtonIconBack @click="formStore.prevPage()" />
            </template>
        </LayoutsBaseHeader>

        
        <div class="p-4 ">
            
            <h2 class="text-center font-bold text-lg mb-8">
                {{ t('เลือกรูปแบบธุรกิจในแหล่งท่องเที่ยว') }}
            </h2>

            <!-- {{  selectedOption }} -->
            <Form @submit="handleNext">
            <div class="flex flex-col gap-2 p-4 mb-[17rem]">
                <!-- กล่องตัวเลือก 1 -->
                <div v-for="(item,index) in resBusinessModel" :key="index" class="border border-blue-900 card rounded-md p-4 flex items-center space-x-3">
                    <RadioButton v-model="selectedItem" :inputId="String(item.id)" name="group" :value="item.id" class="" />
                    <label :for="String(item.id)" class="text-sm font-medium">{{ item.business_model_name }}</label>
                </div>
                <!-- <div class="border border-blue-900 card rounded-md p-4 flex items-center space-x-3">
                    <RadioButton v-model="selectedOption" inputId="option2" name="group" value="บุคคล" class="" />
                    <label for="option2" class="text-sm font-medium">บุคคล</label>
                </div> -->
            </div>

            <p v-if="errors.selectedItem" class="text-red-500 text-xl mb-4 text-center">
            {{ errors.selectedItem }}
          </p>
            
            <Button :loading="isloadingAxi" :label="t('ถัดไป')" severity="primary" type="submit" rounded class="w-full" :pt="{
                root: {
                    class: '!border-primary-main'
                },
            }" @click="formStore.nextPage();" />
            </Form>
            
        </div>

        <MyToast :data="alertToast" />
    </div>
</template>