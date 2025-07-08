<script setup>
definePageMeta({
    middleware: ["auth"],
});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const isloadingAxi = useState("isloadingAxi");
const router = useRouter();
const alertToast = ref({});

import { useFieldArray, useForm, Form, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import * as dataApi from "../../api/data.js";
const stepsBar = ref([
    { step: 1, active: false },
    { step: 2, active: false },
    { step: 3, active: false },
    { step: 4, active: true },
    { step: 5, active: false },
]);



const days = [
    { label: t('จันทร์'), value: t('จันทร์') },
    { label: t('อังคาร'), value: t('อังคาร') },
    { label: t('พุธ'), value: t('พุธ') },
    { label: t('พฤหัสบดี'), value: t('พฤหัสบดี') },
    { label: t('ศุกร์'), value: t('ศุกร์') },
    { label: t('เสาร์'), value: t('เสาร์') },
    { label: t('อาทิตย์'), value: t('อาทิตย์') },
];

const resSociaMedia = ref([])
const loadSocialMedia = async () => {
    try {
        const res = await dataApi.getSocialMedia();
        resSociaMedia.value = res.data.data;
        console.log(resSociaMedia.value)
    } catch (error) {
        console.error(error)
    }
}
const getIcon = (socialMediaName) => {
    const found = resSociaMedia.value.find(
        (item) => item.social_media_name == socialMediaName
    );
    return found ? found.icon : "";
};
onMounted(() => loadSocialMedia());
const requireValue = t('กรุณาระบุข้อมูลให้ถูกต้อง');
const requireText = t('ระบุข้อมูล');
// *************  VARIDATOR
const validationSchema = toTypedSchema(
    zod.object({
        // shop_name: zod.string().nonempty(requireValue).default(""),
        shop_address: zod.string().nonempty(requireValue).default(""),
        // shop_days: zod.string().nonempty(requireValue).default(""),
        shop_days: zod.array(zod.string()).min(1, t('กรุณาเลือกวันที่ทำการ')).default([]),
        shop_time_s: zod.date({
                    required_error: requireValue,
                    invalid_type_error: requireValue,
                }),
        shop_time_e: zod.date({
                    required_error: requireValue,
                    invalid_type_error: requireValue,
                }),

        // shop_time: zod.string().nonempty(requireValue).default(""),
        shop_phone: zod.string().nonempty(requireValue).default(""),
        social_media: zod.array(
            zod.object({
                social_name: zod.string().nonempty(requireText).default(""),
                social_link: zod.string()
                    .url(t('กรุณาระบุลิงก์ที่ถูกต้อง')) // ตรวจสอบว่าเป็นลิงก์ที่ถูกต้อง
                    .nonempty(t('กรุณาระบุข้อมูลลิงก์')) // ตรวจสอบว่าไม่เป็นค่าว่าง
                    .default(""),

            })
        ),
        image_cover: zod
            .union([
                zod.object({ src: zod.string() }), // Case where an object with `src` is provided
                zod.instanceof(File),           // Case where the raw File is directly passed
            ])
            .refine(
                (value) =>
                    !(value instanceof File) || value.size > 0, // Ensure the file is not empty
                { message: requireValue }
            ),
        image_profile: zod
            .union([
                zod.object({ src: zod.string() }), // Case where an object with `src` is provided
                zod.instanceof(File),           // Case where the raw File is directly passed
            ])
            .refine(
                (value) =>
                    !(value instanceof File) || value.size > 0, // Ensure the file is not empty
                { message: requireValue }
            ),

        business_img: zod.custom((value) => {
            if (value != null && (Array.isArray(value) ? value.length > 0 : true)) {
                return value;
            }
        }),
    })
);
const { handleSubmit, handleReset, errors } = useForm({
    initialValues: {
        social_media: [
            {
                social_name: "",
                social_link: ""

            },
        ],
    },
    validationSchema,
});

const { value: image_profile } = useField('image_profile')
const { value: image_cover } = useField('image_cover')
const { value: shop_name } = useField('shop_name')
const { value: shop_address } = useField('shop_address')
const { value: shop_days } = useField('shop_days', null, {
    initialValue: []
})
const { value: shop_time_s } = useField('shop_time_s')
const { value: shop_time_e } = useField('shop_time_e')

const { value: shop_time } = useField('shop_time')
const { value: shop_phone } = useField('shop_phone')
const { value: shop_details } = useField('shop_details')
const { value: latitude } = useField('latitude')
const { value: longitude } = useField('longitude')

const { value: business_img } = useField('business_img', null, {
    initialValue: []
})


// const { push, fields, remove } = useFieldArray("social_media");
const { remove: remove1, push: push1, fields: fields1 } = useFieldArray("social_media");

// const { value: business_name } = useField('business_name', null, {
//     initialValue: null
// })
import { format } from 'date-fns';
import { useFormStore } from "@/store/businessStore.js";
const formStore = useFormStore(); // ใช้ Pinia Store
const handleNext = handleSubmit(() => {
    
    const time_start = format(shop_time_s.value, "HH:mm");
    const time_end = format(shop_time_e.value, "HH:mm");
    shop_time.value = `${time_start}-${time_end}`
    const sortedShopDays = shop_days.value.sort((a, b) => {
        const order = days.map((day) => day.value);
        return order.indexOf(a) - order.indexOf(b);
    });

    const business_img_array = business_img.value.map((item) => item);

    const social_media_array = fields1.value.map((field) => ({
        social_name: field.value.social_name || null,
        social_link: field.value.social_link || null,
    }));

    // เก็บข้อมูลลง Pinia แทน LocalStorage
    formStore.setForm4(
        shop_name.value,
        shop_address.value,
        sortedShopDays,
        shop_time.value,
        shop_phone.value,
        shop_details.value,
        image_cover.value,
        image_profile.value,
        business_img_array,
        social_media_array,
        latitude.value,
        longitude.value
    );

    // เปลี่ยนหน้าไป form5
    formStore.nextPage();
});


// function onFileSelect(event) {
//     event.files.forEach(file => {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//             business_img.value.push({ src: e.target.result, file: file });  // Store both the image preview and the file
//         };
//         reader.readAsDataURL(file);  // Read the file as a data URL
//     });
// }
function onFileSelect(event) {
    event.files.forEach(file => {
        if (business_img.value.length >= 3) return; // จำกัดจำนวนไฟล์ที่ 5

        const reader = new FileReader();
        reader.onload = (e) => {
            if (business_img.value.length < 3) { // ตรวจสอบอีกครั้งก่อน push
                business_img.value.push({ src: e.target.result, file: file });
            }
        };
        reader.readAsDataURL(file);
    });
}

const removeImage = (index) => {
    business_img.value.splice(index, 1);  // Remove the image from the array
};
const fileInput = ref(null);
const triggerFileInput = () => {
    fileInput.value.choose();
};

// Reference to the hidden file input
const fileInputBgCover = ref(null);

// Handle file selection
const onFileSelectBgCover = (event) => {
    const file = event.target.files[0]; // Get the first selected file
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Set the image source for preview and keep the file for upload
            image_cover.value = { src: e.target.result, file: file };
            console.log('image_cover', image_cover.value)
        };
        reader.readAsDataURL(file); // Read the file as a data URL
    }
};

// Remove the selected image
const removeImageBgCover = () => {
    image_cover.value = null; // Clear the image preview and file data
};

// Trigger the hidden file input
const triggerFileInputBgCover = () => {
    fileInputBgCover.value.click(); // Programmatically click the file input
};


// ###################### profile ##############

// Reference to the hidden file input
const fileInputBgProfile = ref(null);

// Handle file selection
const onFileSelectBgProfile = (event) => {
    const file = event.target.files[0]; // Get the first selected file
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Set the image source for preview and keep the file for upload
            image_profile.value = { src: e.target.result, file: file };
            console.log('image_profile', image_profile.value)
        };
        reader.readAsDataURL(file); // Read the file as a data URL
    }
};

// Remove the selected image
const removeImageBgProfile = () => {
    image_profile.value = null; // Clear the image preview and file data
};

// Trigger the hidden file input
const triggerFileInputProfile = () => {
    fileInputBgProfile.value.click(); // Programmatically click the file input
};


//  MAP SECTIONS 

let map = null;

const loadLongdoMap = () => {
    return new Promise((resolve, reject) => {
        if (window.longdo) {
            resolve(window.longdo);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://api.longdo.com/map3/?key=f38639d33e37f4e422cd8085d997d55f";
        script.async = true;
        script.onload = () => resolve(window.longdo);
        script.onerror = () => reject(new Error("Failed to load Longdo Map API"));
        document.head.appendChild(script);
    });
};

// สร้างแผนที่
const initMap = async () => {
    try {
        const longdo = await loadLongdoMap();

        const mapContainer = document.getElementById("map");
        if (!mapContainer) {
            console.error("Element #map not found");
            return;
        }

        map = new longdo.Map({
            placeholder: mapContainer,
            zoom: 12,
            location: { lat: 13.736717, lon: 100.523186 },
        });
    } catch (error) {
        console.error("Error loading Longdo Map:", error);
    }
};

// ลบ Marker ทั้งหมด
const clearMarkers = () => {
    if (map) {
        map.Overlays.clear(); // ลบ Marker ทั้งหมดบนแผนที่
    }
};

// เพิ่ม Marker ตำแหน่งตรงกลางจอ
const addMarkerAtCenter = () => {
    if (!map) return;

    // ลบ Marker ทั้งหมดก่อน
    clearMarkers();

    // รับค่าพิกัดตรงกลางของแผนที่
    const center = map.location();

    // สร้าง Marker ใหม่
    const marker = new longdo.Marker(
        { lat: center.lat, lon: center.lon },
        {
            title: t('ตำแหน่งตรงกลาง'),
            detail: `Lat: ${center.lat}, Lon: ${center.lon}`,
            icon: {
                url: "/image/marker-blue.png", // ไอคอนที่กำหนดเอง
                //   offset: { x: 12, y: 45 },  // จุดอ้างอิงของไอคอน
                size: { width: 40, height: 45 }
            },
        });

    // เพิ่ม Marker ลงแผนที่
    map.Overlays.add(marker);

    // อัปเดตค่าพิกัดที่เลือก
    latitude.value = center.lat;
    longitude.value = center.lon;
};

const textSearchMap = ref();
const resLocation = ref([]);
const onLocationSearchSelect = (e) => {
    try {
        
        if (!e) {
            return
        }
        if (e.lat && e.lon) {
            clearMarkers();
            latitude.value = e.lat;
            longitude.value = e.lon;
            focusOnLocation(e.lat, e.lon);
        }
    } catch (error) {
        console.error("Error in selection:", error);
    }
};
// ✅ โฟกัสแผนที่ไปยังพิกัดที่เลือก
const focusOnLocation = async(lat, lon) => {
    if (!map) return;
    await clearMarkers
    const marker = new longdo.Marker(
        { lat, lon },
        {
            title: t('ตำแหน่งที่เลือก'),
            detail: `Lat: ${lat}, Lon: ${lon}`,
            icon: {
                url: "/image/marker-blue.png", // ไอคอนที่กำหนดเอง
                //   offset: { x: 12, y: 45 },  // จุดอ้างอิงของไอคอน
                size: { width: 40, height: 45 }
            },
        }
    );
    map.Overlays.add(marker);
    map.location({ lat, lon }, true);
};

// ✅ ฟังก์ชันค้นหาสถานที่จาก API
const search = async (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            resLocation.value = [];
        } else {
            if (event.query?.length >= 4) {
                const requestOptions = {
                    method: "GET",
                    redirect: "follow"
                };
                fetch(`https://search.longdo.com/mapsearch/json/search?keyword=${event.query}&limit=20&key=cffdefc2f61c2b38e32abe2c7b7e19cd`, requestOptions)
                    .then((response) => response.json())
                    .then((result) => {
                        console.log("Search results:", result);
                        resLocation.value = result.data.map(item => ({
                            name: item.name,
                            address: item.address || t('ไม่มีที่อยู่'),
                            lat: item.lat,
                            lon: item.lon,
                            id: item.id
                        }));
                    })
                    .catch((error) => console.error(error));
            }
        }
    }, 250);
};
// โหลดแผนที่เมื่อ DOM พร้อม
onMounted(() => {
    initMap();
});
</script>
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
        <van-nav-bar :title="t('ข้อมูลธุรกิจในแหล่งท่องเที่ยว')" left-arrow @click-left="formStore.prevPage()">
        </van-nav-bar>

        <div class="p-4 ">
            <div class="flex space-x-5 items-center justify-center mb-8">
                <div v-for="(item, index) in stepsBar" :key="index"
                    :class="item.active ? 'w-8 h-2 bg-blue-900' : 'w-8 h-2 bg-gray-200'"></div>
            </div>
            <Form @submit="handleNext">
                <div class="card pt-5 mb-10">
                    <h2 class="font-bold text-lg ">
                        {{ t('ธุรกิจใจแหล่งท่องเที่ยว') }}
                    </h2>
                    <!-- <p class="text-primary-main mb-3">ร้านอาหาร</p> -->
                    <!-- <van-uploader :after-read="afterRead" /> -->
                    <div class="space-y-4 mb-5">
                        <div>
                            <p class="text-gray-500 text-sm">{{ t('อัพโหลดรูปภาพโปรไฟล์') }}</p>
                            <div class="flex flex-wrap gap-2 mb-3 relative">
                                <!-- Display the image preview if available -->
                                <div class="relative" v-if="image_profile?.src">
                                    <!-- <img :src="image_cover.src" alt="Preview"
                                        class="object-cover w-12 h-12 rounded-md" /> -->
                                    <Image :src="image_profile.src" alt="Image" width="50" class="object-cover "
                                        :pt="{ image: { class: 'object-cover w-12 h-12 rounded-md ' } }" preview />
                                    <i class="fa-solid fa-xmark absolute top-0 right-0 p-0.5 text-white rounded-full cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-red-300"
                                        @click="removeImageBgProfile"></i>
                                </div>

                                <!-- Upload Button -->
                                <div class="flex" v-else>
                                    <label
                                        class="w-12 h-12 border-2 border-dotted border-blue-900 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-600"
                                        @click="triggerFileInputProfile">
                                        <i
                                            class="pi pi-plus text-2xl text-gray-600 hover:scale-110 transition-transform"></i>
                                    </label>
                                    <!-- Hidden File Input -->
                                    <input ref="fileInputBgProfile" id="upload-image" type="file" accept="image/*"
                                        @change="onFileSelectBgProfile" class="hidden" />
                                </div>


                            </div>
                            <p class="error-text" v-if="errors?.image_profile">{{ t('กรุณาเลือกอย่างน้อย') }} 1 {{ t('ภาพ') }}</p>
                        </div>


                        <div>
                            <p class="text-gray-500 text-sm">{{ t('อัพโหลดรูปภาพหน้าปก') }}</p>
                            <div class="flex flex-wrap gap-2 mb-3 relative">
                                <!-- Display the image preview if available -->
                                <div class="relative" v-if="image_cover?.src">
                                    <!-- <img :src="image_cover.src" alt="Preview"
                                        class="object-cover w-12 h-12 rounded-md" /> -->
                                    <Image :src="image_cover.src" alt="Image" width="50" class="object-cover "
                                        :pt="{ image: { class: 'object-cover w-12 h-12 rounded-md ' } }" preview />
                                    <i class="fa-solid fa-xmark absolute top-0 right-0 p-0.5 text-white rounded-full cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-red-300"
                                        @click="removeImageBgCover"></i>
                                </div>

                                <!-- Upload Button -->
                                <div class="flex" v-else>
                                    <label
                                        class="w-12 h-12 border-2 border-dotted border-blue-900 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-600"
                                        @click="triggerFileInputBgCover">
                                        <i
                                            class="pi pi-plus text-2xl text-gray-600 hover:scale-110 transition-transform"></i>
                                    </label>
                                    <!-- Hidden File Input -->
                                    <input ref="fileInputBgCover" id="upload-image" type="file" accept="image/*"
                                        @change="onFileSelectBgCover" class="hidden" />
                                </div>


                            </div>
                            <p class="error-text" v-if="errors?.image_cover">{{ t('กรุณาเลือกอย่างน้อย') }} 1 {{ t('ภาพ') }}</p>
                        </div>

                        <p class="text-gray-500 text-sm">{{ t('อัพโหลดรูปภาพ') }} ({{ t('ไม่เกิน') }} 3 {{ t('รูป') }})</p>
                        <div class="flex flex-wrap gap-2 mb-3 relative">
                            <div v-for="(image, index) in business_img" :key="index" class="relative">
                                <!-- Image Display -->
                                <Image :src="image.src" alt="Image" width="50" class="object-cover "
                                    :pt="{ image: { class: 'object-cover w-12 h-12 rounded-md ' } }" preview />

                                <!-- Delete Icon (Overlay on Top-Right) -->
                                <i class="fa-solid fa-xmark absolute top-0 right-0 p-0.5 text-white  rounded-full cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-red-300"
                                    @click="removeImage(index)"></i>

                            </div>
                            <div class="flex">
                                <label
                                    class="w-12 h-12 border-2 border-dotted border-blue-900 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-600"
                                    @click="triggerFileInput">
                                    <i
                                        class="pi pi-plus text-2xl text-gray-600 hover:scale-110 transition-transform"></i>
                                </label>
                                <FileUpload ref="fileInput" id="upload-image" mode="basic" accept="image/*"
                                    @select="onFileSelect" customUpload :auto="true" class="!hidden" multiple  />
                            </div>
                        </div>
                        <p class="error-text" v-if="errors?.business_img">{{ t('กรุณาเลือกอย่างน้อย') }} 1 {{ 'ภาพ' }}</p>

                        <div>
                            <client-only>
                                <label class="label-input block">{{ t('พิกัดสถานที่ท่องเที่ยวหรือธุรกิจ') }}</label>
                                <AutoComplete v-model="textSearchMap" forceSelection optionLabel="name"
                                    :placeholder="`${t('ค้นหาสถานที่ใกล้เคียง')}...`" :suggestions="resLocation" @complete="search"
                                    @value-change="onLocationSearchSelect" dropdownicon="fa-regular fa-trash-can"
                                    class="mb-2" inputClass="custom-border w-full">

                                    <template #option="slotProps" class="w-full">
                                        <div class="flex flex-col p-2 border-b border-gray-200">
                                            <span class="font-medium text-lg text-primary-main">{{
                                                slotProps.option?.name }}</span>
                                            <span class="text-sm text-gray-500">{{ slotProps.option?.address }}</span>
                                        </div>
                                    </template>
                                </AutoComplete>
                                <div class="h-[30rem] mb-2">
                                    <div id="map" class="map-container" style="width: 100%; height: 100%;"></div>
                                </div>
                                <p class="error-text" v-if="errors?.longitude">{{ t('กรุณาปักหมุดสถานที่ท่องเที่ยวหรือธุรกิจ') }}
                                </p>

                            </client-only>

                            <Button icon="fa-solid fa-location-dot" size="small" outlined @click="addMarkerAtCenter"
                                severity="primary" :label="t('ปักหมุดตำแหน่งธุรกิจหรือสถานที่ท่องเที่ยว')" />
                        </div>


                        <div>
                            <label class="label-input">{{ t('ละติจูด') }}</label>
                            <InputText v-model="latitude" placeholder="" readonly class="w-full custom-border" />
                        </div>
                        <div>
                            <label class="label-input">{{ t('ลองจิจูด') }}</label>
                            <InputText v-model="longitude" placeholder="" readonly class="w-full custom-border" />
                        </div>
                        <!-- ชื่อบริษัท -->
                        <div>
                            <label class="label-input">{{ t('ชื่อธุรกิจในแหล่งท่องเที่ยว') }}</label>
                            <InputText v-model="shop_name" :placeholder="t('ชื่อธุรกิจในแหล่งท่องเที่ยว')"
                                class="w-full custom-border" :invalid="errors?.shop_name ? true : false" />
                            <p class="error-text" v-if="errors?.shop_name">{{ errors?.shop_name }}</p>

                        </div>
                        <!-- ชื่อบริษัท -->
                        <div>
                            <label class="label-input">{{ t('ที่อยู่ธุรกิจในแหล่งท่องเที่ยว') }}</label>
                            <InputText v-model="shop_address" :placeholder="t('ที่อยู่ธุรกิจ')"
                                :invalid="errors?.shop_address ? true : false" class="w-full custom-border" />
                            <p class="error-text" v-if="errors?.shop_address">{{ errors?.shop_address }}</p>

                        </div>
                        <div>
                            <label class="label-input">{{ t('วันที่ทำการ') }}</label>
                            <!-- <InputText v-model="shop_days" placeholder="วันที่ทำการ" class="w-full custom-border"
                                :invalid="errors?.shop_days ? true : false" /> -->
                                <div class="mt-2">
            <div class="grid grid-cols-3 gap-x-6 gap-y-3 lg:w-fit w-full">
                <div v-for="day in days" :key="day.value" class="flex items-center space-x-2">
                    <Checkbox v-model="shop_days" :inputId="day.value" :value="day.value"
                         size="small" :invalid="errors?.shop_days ? true : false" />
                    <label :for="day.value" class="text-gray-700 cursor-pointer">{{ day.label }}</label>
                </div>
            </div>
        </div>
                            <p class="error-text" v-if="errors?.shop_days">{{ errors?.shop_days }}</p>

                        </div>
                        <div>
                            <label class="label-input block">{{ t('เวลาทำการ') }}</label>
                            <DatePicker id="datepicker-timeonly" v-model="shop_time_s" timeOnly inputClass="custom-border" style="width: 6rem;"
                            :invalid="errors?.shop_time_s ? true : false" :placeholder="t('ชั่วโมง:นาที')" />
                        
                            <label class="label-input">{{ t('ถึง') }}</label>
                            <DatePicker id="datepicker-timeonly" v-model="shop_time_e" timeOnly class="custom-border" inputClass="custom-border" style="width: 6rem;"
                            :invalid="errors?.shop_time_e ? true : false" :placeholder="t('ชั่วโมง:นาที')"/>
                          
                            <p class="error-text" v-if="errors?.shop_time_s || errors?.shop_time_e ">{{ t('กรุณาเลือกเวลาทำการ') }}</p>

                        </div>
                        <!-- ติดต่อ -->
                        <div>
                            <label class="label-input">{{ t('เบอร์ติดต่อ') }}</label>
                            <InputText v-model="shop_phone" v-keyfilter.int :placeholder="t('เบอร์โทรศัพท์')"
                                class="w-full custom-border" :invalid="errors?.shop_phone ? true : false" />
                            <p class="error-text" v-if="errors?.shop_phone">{{ errors?.shop_phone }}</p>
                        </div>
                        <!-- ติดต่อ -->
                        <div>
                            <label class="label-input">{{ t('รายละเอียดธุรกิจในแหล่งท่องเที่ยว') }}</label>
                            <InputText v-model="shop_details" placeholder="" class="w-full custom-border"
                                :invalid="errors?.shop_details ? true : false" />
                            <p class="error-text" v-if="errors?.shop_details">{{ errors?.shop_details }}</p>

                        </div>

                    </div>
                    <hr class="border-b-2 mb-3" />

                    <h2 class="font-bold text-lg mb-3">
                        {{ t('ธุรกิจใจแหล่งท่องเที่ยว') }}
                    </h2>

                    <Button :loading="isloadingAxi" type="button" :label="t('เพิ่มรายการโซเชียล')" @click="push1({
                        social_name: undefined,
                        social_link: undefined,
                    })" />
                    <div id="table-socia-media" v-if="fields1?.length>0">
                        <table>
                            <thead>
                                <tr>
                                    <th style="width: 8rem;">{{ t('ประเภทโซเชียล') }}</th>
                                    <th>{{ t('ลิ้งค์') }}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(field, index) in fields1" :key="field.key">
                                    <!-- Column: Social Media Type -->
                                    <td style="width: 8rem;" class="align-top ">
                                        <div class="space-y-0">
                                            <Select v-model="field.value.social_name" :options="resSociaMedia" style=""
                                                optionLabel="social_media_name" optionValue="social_media_name"
                                                class="w-full h-full custom-border" :placeholder="`${t('ประเภทโซเชียล')}...`">
                                                <template #value="slotProps">
                                                    <div class="flex items-center space-x-2">
                                                        <i :class="getIcon(slotProps.value)" class="text-lg"></i>
                                                        <span>
                                                            {{ slotProps.value || `${t('ประเภทโซเชียล')}...` }}
                                                        </span>
                                                    </div>
                                                </template>
                                                <template #option="slotProps">
                                                    <div class="flex items-center space-x-2">
                                                        <i :class="slotProps.option.icon" class="text-lg"></i>
                                                        <span>{{ slotProps.option.social_media_name }}</span>
                                                    </div>
                                                </template>
                                            </Select>
                                            <p v-if="errors?.[`social_media[${index}].social_name`]"
                                                class="text-red-500 text-sm mt-1">
                                                {{ errors[`social_media[${index}].social_name`] }}
                                            </p>
                                        </div>
                                    </td>

                                    <!-- Column: Social Link -->
                                    <td class="align-top ">
                                        <div class="space-y-0">
                                            <InputText v-model="field.value.social_link" class="w-full custom-border"
                                                :placeholder="`${t('ลิ้งโซเชียล')}...`" />
                                            <p v-if="errors?.[`social_media[${index}].social_link`]"
                                                class="text-red-500 text-sm">
                                                {{ errors[`social_media[${index}].social_link`] }}
                                            </p>
                                        </div>
                                    </td>

                                    <!-- Column: Actions -->
                                    <td class="align-top">
                                        <Button :loading="isloadingAxi" icon="pi pi-times" severity="danger"
                                            size="small" @click="remove1(index)" rounded aria-label="Cancel" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>

                <Button :loading="isloadingAxi" :label="t('ถัดไป')" severity="primary" type="submit" rounded class="w-full"
                    :pt="{
                        root: {
                            class: '!border-primary-main'
                        },
                    }" />
            </Form>

        </div>
        <MyToast :data="alertToast" />

    </div>
</template>