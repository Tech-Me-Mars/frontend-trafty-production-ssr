<style scoped>
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
        <van-nav-bar :title="t('เขียนรีวิว')" left-arrow @click-left="navigateTo(`/client/ratings/${route.params.id}`)">
        </van-nav-bar>
        <Form @submit="handleNext">

            <div class="flex flex-col items-center bg-white pt-10 rounded-lg mx-auto">
                <!-- Stars Rating -->
                <h1 class="text-center font-semibold text-xl">
                    {{ t("ให้คะแนนท่องเที่ยวธุรกิจในแหล่งท่องเที่ยว") }}
                </h1>
                <div class="flex justify-center mb-4 gap-1 p-6" style="font-size: 30px;">
                    <i v-for="index in 5" :key="index" class="fa-solid fa-star cursor-pointer" :class="[
                        index <= getSelectedStar() ? 'text-orange-500' : 'text-gray-300'
                    ]" @click="setSelectionByStar(index)"></i>
                </div>

                <!-- Buttons -->
                <div class="grid grid-cols-2 gap-2 mb-6">
                    <button type="button" v-for="item in resTypeBusinessComment" :key="item.id" @click="setSelectionById(item.id)"
                        :class="[
                            'px-4 py-2 border rounded-full text-gray-700',
                            star_id === item.id ? 'bg-primary-main !text-white' : 'bg-gray-100'
                        ]">
                        {{ item.star_name }}
                    </button>
                </div>
                <p class="error-text" v-if="errors?.star_id">{{ t('กรุณาเลือกคะแนน') }}</p>

            </div>


            <!-- Comment Section -->
            <div class="p-4 w-full">
                <div class="card mb-12">
                    <div class="relative w-full">
                        <Textarea :placeholder="t('พิมพ์ข้อความตอบกลับ')" class="w-full border rounded-lg p-4  mb-2"
                            id="over_label" v-model="comment" rows="3" cols="30" style="resize: none"
                            :maxlength="100" />
                        <span class="absolute bottom-6 right-1 text-gray-400 text-sm">
                            {{ comment.length }}/100 {{ t('ตัวอักษร') }}
                        </span>
                    </div>
                    <p class="error-text" v-if="errors?.comment">{{ errors.comment }}</p>

                    <div class="flex flex-wrap gap-2 mb-3 relative">
                        <div v-for="(image, index) in img_list" :key="index" class="relative">
                            <!-- Image Display -->
                            <Image :src="image.src" alt="Image" width="50"
                                class="object-cover w-20 h-20 rounded-md shadow-md"
                                :pt="{ image: { class: 'object-cover w-20 h-20 rounded-md shadow-md' } }" preview />

                            <!-- Delete Icon (Overlay on Top-Right) -->
                            <i class="fa-solid fa-xmark absolute top-0 right-0 p-0.5 bg-white rounded-full shadow-md cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-red-300"
                                @click="removeImage(index)"></i>

                        </div>
                    </div>
                    <div>
                        <div class="flex">
                            <FileUpload accept="image/png, image/jpeg" mode="basic" @select="onFileSelect" customUpload
                                rounded auto severity="secondary"
                                class="rounded-full p-button-outlined border-indigo-900" style="color: rgb(49 46 129);"
                                outlined chooseLabel="เพิ่มรูปภาพ" chooseIcon="fa-regular fa-images" :multiple="true" />
                        </div>
                        <p class="error-text" v-if="errors?.img_list">{{ t('เลือกอย่างน้อย') }} 1 {{ t('ภาพ') }}</p>

                    </div>
                </div>
                <button-send type="submit"></button-send>
            </div>
        </Form>

        <ConfirmDialog group="headless">
            <template #container="{ message, acceptCallback, rejectCallback }">
                <div class="flex flex-col items-center p-8 bg-surface-0  rounded">
                    <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
                    <p class="mb-0">{{ message.message }}</p>
                    <div class="flex items-center gap-2 mt-6">
                        <Button :loading="isloadingAxi" :label="t('ยืนยัน')" @click="acceptCallback"></Button>
                        <Button :loading="isloadingAxi" :label="t('ยกเลิก')" outlined @click="rejectCallback"></Button>
                    </div>
                </div>
            </template>
        </ConfirmDialog>

        <MyToast :data="alertToast" />

    </div>



</template>

<script setup>
definePageMeta({
    middleware: ["auth"],
});
const isloadingAxi = useState("isloadingAxi");
const router = useRouter();
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const localPath = useLocalePath();
import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

import * as dataApi from './api/data.js'
const route = useRoute();
const alertToast = ref({});

const resTypeBusinessComment = ref([])
const loadTypeBusinessComment = async () => {
    try {
        const payload = {
            "business_id": parseInt(route.params.id)
        }
        const res = await dataApi.getTypeBusinessComment(payload);
        resTypeBusinessComment.value = res.data.data;
    } catch (error) {
        console.error(error)
    }
}


onMounted(() => {
    loadTypeBusinessComment();
})


import { ref } from 'vue';

// ฟังก์ชันเมื่อคลิกที่ดาว

const getSelectedStar = () => {
    const selectedItem = resTypeBusinessComment.value.find((item) => item.id === star_id.value);
    return selectedItem ? selectedItem.star : 0;
};
const setSelectionById = (id) => {
    star_id.value = id;
};
const setSelectionByStar = (star) => {
    const matchedItem = resTypeBusinessComment.value.find((item) => item.star === star);
    if (matchedItem) {
        star_id.value = matchedItem.id;
    }
};

const requireValue = t('ระบุข้อมูล');
// *************  VARIDATOR
const validationSchema = toTypedSchema(
    zod.object({

        star_id: zod.number({ required_error: requireValue, invalid_type_error: requireValue, }),
        // comment: zod.string().nonempty(requireValue).default(""),
        // business_list_price: zod.string().nonempty(requireValue).default(""),
        // img_list: zod.custom((value) => {
        //     if (value != null && (Array.isArray(value) ? value.length > 0 : true)) {
        //         return value;
        //     }
        // }),
        // image:[];
    })
);

const { handleSubmit, handleReset, errors } = useForm({
    validationSchema,
});

const { value: star_id } = useField('star_id')
const { value: comment } = useField('comment', null, {
    initialValue: ""
})
const { value: img_list } = useField('img_list', null, {
    initialValue: []
})
const confirm = useConfirm();
const handleNext = handleSubmit(async (values) => {
    confirm.require({
        group: 'headless',
        header: `${t('บันทึก')}?`,
        message: t('ยืนยันการเพิ่มคอมเม้นต์'),
        accept: () => {
            saveComment();
        },
        reject: () => {
            // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
});

const saveComment = async () => {
    try {
        const formData = new FormData();
        img_list.value.forEach((item) => {
            formData.append('files', item.file);
        });
        formData.append('business_id', parseInt(route.params.id));
        formData.append('comment', comment.value);
        formData.append('star_id', parseInt(star_id.value));
        formData.append('status', true);
        const res = await dataApi.saveComment(formData);
        alertToast.value = {
            title: t('สำเร็จ'),
            color: 'info',
            isError: false,
            msg: res.data.message,
        }

        // setTimeout(() => {
        navigateTo(`/client/ratings/${route.params.id}`)
        // navigateTo(`/vendor/warning-list/${route.params.id}/${route.params.subid}/success`)
        // }, 1500);

    } catch (error) {
        console.error(error)
        alertToast.value = {
            title: t('ล้มเหลว'),
            isError: true,
            color: "error",
            msg: error.response?.data?.message || "Error occurred",
            dataError: error,
        };
    }
}


function onFileSelect(event) {
    event.files.forEach(file => {
        const reader = new FileReader();
        // Convert file to data URL to display in UI
        reader.onload = (e) => {
            img_list.value.push({ src: e.target.result, file: file });  // Store both the image preview and the file
        };
        reader.readAsDataURL(file);  // Read the file as a data URL
    });
}

const removeImage = (index) => {
    img_list.value.splice(index, 1);  // Remove the image from the array
};
// ฟังก์ชันส่งรีวิว
const submitReview = async () => {
    try {
        const formData = new FormData();
        img_list.value.forEach((image) => {
            formData.append('img_list', image.file);
        });
        formData.forEach((value, key) => {
            console.log(key, value);
        });
    } catch (error) {
        console.error('Error uploading files:', error);
    }
};
</script>