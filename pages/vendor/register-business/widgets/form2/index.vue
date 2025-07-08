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

const activeLangTab = ref("th");

const resBusinessModel = ref([])
const loadBusinessModel = async () => {
    try {
        const res = await dataApi.getBusinessModel();
        resBusinessModel.value = res.data.data;
    } catch (error) {
        console.error(error)
    }
}
onMounted(() => loadBusinessModel())
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
        selectedItem: zod.number({ required_error: requireValue, invalid_type_error: requireValue, }),
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



<template>
    <div class="bg-zinc-100 min-h-screen">
        <LayoutsBaseHeader :title="t('หน่วยงานแหล่งท่องเที่ยว')">
            <template #left>
                <ButtonIconBack @click="formStore.prevPage()" />
            </template>
        </LayoutsBaseHeader>

        <div>

            <Form @submit="handleNext">
                <van-tabs v-model:active="activeLangTab" type="line" sticky animated color="#202c54">
                    <!-- 🔵 ภาษาไทย -->
                    <van-tab title="ภาษาไทย" name="th" class="p-2">
                        <h2 class="text-center font-bold text-xl mb-8 pt-2">เลือกหน่วยงานของคุณ</h2>
                        <div class="flex flex-col gap-2 p-4 mb-[6rem]">
                            <div v-for="(item, index) in resBusinessModel" :key="index"
                                class="border border-blue-900 card rounded-md p-4 flex items-center space-x-3">
                                <RadioButton v-model="selectedItem" :inputId="'th_' + item.id" name="group-th"
                                    :value="item.id" class="" />

                                <label :for="'th_' + item.id" class="text-sm font-medium">{{ item.business_model_name
                                }}</label>
                            </div>
                        </div>
                        <p v-if="errors.selectedItem" class="text-red-500 text-sm text-center mb-4">
                            {{ errors.selectedItem }}
                        </p>
                    </van-tab>

                    <!-- 🔵 English -->
                    <van-tab title="English" name="en" class="p-2">
                        <h2 class="text-center font-bold text-xl mb-8 pt-2">Select Your Organization</h2>

                        <div class="flex flex-col gap-2 p-4 mb-[6rem]">
                            <div v-for="(item, index) in resBusinessModel" :key="index"
                                class="border border-blue-900 card rounded-md p-4 flex items-center space-x-3">
                                <RadioButton v-model="selectedItem" :inputId="'en_' + item.id" name="group-en"
                                    :value="item.id" class="" />

                                <label :for="'en_' + item.id" class="text-sm font-medium">{{ item.business_model_name
                                }}</label>
                            </div>
                        </div>
                        <p v-if="errors.selectedItem" class="text-red-500 text-sm text-center mb-4">
                            {{ errors.selectedItem }}
                        </p>
                    </van-tab>

                    <!-- 🔵 中文 -->
                    <van-tab title="中文" name="cn" class="p-2">
                        <h2 class="text-center font-bold text-xl mb-8 pt-2">选择您的单位</h2>

                        <div class="flex flex-col gap-2 p-4 mb-[6rem]">
                            <div v-for="(item, index) in resBusinessModel" :key="index"
                                class="border border-blue-900 card rounded-md p-4 flex items-center space-x-3">
                                <RadioButton v-model="selectedItem" :inputId="'en_' + item.id" name="group-en"
                                    :value="item.id" class="" />
                            
                                <label :for="'en_' + item.id" class="text-sm font-medium">{{ item.business_model_name
                                }}</label>
                            </div>
                        </div>
                        <p v-if="errors.selectedItem" class="text-red-500 text-sm text-center mb-4">
                            {{ errors.selectedItem }}
                        </p>
                    </van-tab>
                </van-tabs>

                <Button :loading="isloadingAxi" :label="t('ถัดไป')" severity="primary" type="submit" rounded
                    class="w-full mt-4" :pt="{ root: { class: '!border-primary-main' } }" @click="formStore.nextPage();" />
            </Form>


        </div>
    </div>
</template>