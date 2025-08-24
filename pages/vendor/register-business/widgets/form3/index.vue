<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useForm, useField, Form } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as zod from 'zod';
import { useFormStore } from '@/store/businessStore.js';
import * as dataApi from "../../api/data.js";

const { t, locale, setLocale } = useI18n();
const router = useRouter();
const formStore = useFormStore();
const isloadingAxi = useState('isloadingAxi');


// Language configuration
const langs = [
  { code: 'th', label: 'ภาษาไทย', locale: 'th' },
  { code: 'en', label: 'English', locale: 'en' },
  { code: 'cn', label: '中文', locale: 'cn' }
];

const activeLangTab = ref(langs.findIndex(l => l.locale === locale.value) ?? 0);
onMounted(() => {
  setLocale('th')
  loadProvinces()

})
// เมื่อเปลี่ยนแท็บ
watch(activeLangTab, (newIdx) => {
  setLocale(langs[newIdx].locale);
});

// เมื่อเปลี่ยน locale
watch(locale, (newLocale) => {
  const idx = langs.findIndex(l => l.locale === newLocale);
  if (idx !== -1) activeLangTab.value = idx;
});

// Step indicator
const stepsBar = ref([
  { step: 1, active: false },
  { step: 2, active: false },
  { step: 3, active: true },
  { step: 4, active: false },
  { step: 5, active: false },
]);

const requireValue = t('กรุณาระบุข้อมูลให้ถูกต้อง');

// Validation schema - Mixed i18n and single fields
const validationSchema = toTypedSchema(
  zod.object({
    shop_province_id: zod.number({ required_error: t('กรุณาเลือกจังหวัด'), invalid_type_error: t('กรุณาเลือกจังหวัด'), }),
    shop_district_id: zod.number({ required_error: t('กรุณาเลือกอำเภอ'), invalid_type_error: t('กรุณาเลือกอำเภอ'), }),
    shop_subdistrict_id: zod.number({ required_error: t('กรุณาเลือกตำบล'), invalid_type_error: t('กรุณาเลือกตำบล'), }),

    business_name: zod.object({
      th: zod.string().nonempty(requireValue),
      en: zod.string().default(''), // ✅ มีค่า default
      cn: zod.string().default(''),
    }),
    business_person: zod.object({
      th: zod.string().nonempty(requireValue),
      en: zod.string().default(''),
      cn: zod.string().default(''),
    }),
    business_address: zod.object({
      th: zod.string().nonempty(requireValue),
      en: zod.string().default(''),
      cn: zod.string().default(''),
    }),
    business_contact: zod.string().nonempty(requireValue),
    business_email: zod.string().email(t('กรุณาระบุอีเมลที่ถูกต้อง')).nonempty(requireValue),
    listFiles: zod.array(zod.any()).default([]),
  })
)



const { handleSubmit, errors, handleReset } = useForm({ validationSchema })

// Multi-language fields
const { value: businessNameTh } = useField('business_name.th', undefined, { initialValue: '' });
const { value: businessNameEn } = useField('business_name.en', undefined, { initialValue: '' });
const { value: businessNameCn } = useField('business_name.cn', undefined, { initialValue: '' });

const { value: businessPersonTh } = useField('business_person.th', undefined, { initialValue: '' });
const { value: businessPersonEn } = useField('business_person.en', undefined, { initialValue: '' });
const { value: businessPersonCn } = useField('business_person.cn', undefined, { initialValue: '' });

const { value: businessAddressTh } = useField('business_address.th', undefined, { initialValue: '' });
const { value: businessAddressEn } = useField('business_address.en', undefined, { initialValue: '' });
const { value: businessAddressCn } = useField('business_address.cn', undefined, { initialValue: '' });

// Single fields
const { value: business_contact } = useField('business_contact', undefined, { initialValue: '' });
const { value: business_email } = useField('business_email', undefined, { initialValue: '' });
const { value: listFiles } = useField('listFiles', undefined, { initialValue: [] });

const { value: shop_province_id } = useField('shop_province_id');
const { value: shop_district_id } = useField('shop_district_id');
const { value: shop_subdistrict_id } = useField('shop_subdistrict_id');
const provinces = ref([])
const districts = ref([])
const subdistricts = ref([])
// โหลดจังหวัด อำเภอ ตำบล (ใช้ map เหมือนเดิม)

const districtLabelField = computed(() => {
  const lang = langs[activeLangTab.value]
  if (lang.code === 'cn') {
    const d = districts.value[0]
    if (d && !d.district_name_cn) {
      if (d.district_name_en) return 'district_name_en'
      return 'district_name_th'
    }
    return 'district_name_cn'
  }
  return `district_name_${lang.code}`
})

const subdistrictLabelField = computed(() => {
  const lang = langs[activeLangTab.value]
  if (lang.code === 'cn') {
    const s = subdistricts.value[0]
    if (s && !s.subdistrict_name_cn) {
      if (s.subdistrict_name_en) return 'subdistrict_name_en'
      return 'subdistrict_name_th'
    }
    return 'subdistrict_name_cn'
  }
  return `subdistrict_name_${lang.code}`
})

const provinceLabelField = computed(() => {
  const lang = langs[activeLangTab.value]
  if (lang.code === 'cn') {
    const s = provinces.value[0]
    if (s && !s.provinces_name_cn) {
      if (s.provinces_name_en) return 'provinces_name_en'
      return 'provinces_name_th'
    }
    return 'provinces_name_cn'
  }
  return `provinces_name_${lang.code}`
})

// โหลดจังหวัด
const loadProvinces = async () => {
  try {
    const res = await dataApi.getProvinces()
    provinces.value = res.data.data.map((item) => ({
      ...item,
      provinces_name_th: item?.provinces_name_i18n?.th || "",
      provinces_name_en: item?.provinces_name_i18n?.en || "",
      provinces_name_cn: item?.provinces_name_i18n?.cn || "",
    }))
  } catch (err) { console.log(err) }
}

// โหลดอำเภอ ตามจังหวัด
const loadDistricts = async (provinceId) => {
  if (!provinceId) return districts.value = []
  try {
    const res = await dataApi.getDistrictByProvinceId(provinceId)
    districts.value = res.data.data.map((item) => ({
      ...item,
      district_name_th: item?.district_name_i18n?.th || "",
      district_name_en: item?.district_name_i18n?.en || "",
      district_name_cn: item?.district_name_i18n?.cn || "",
    }))
  } catch (err) { console.log(err) }
}

// โหลดตำบล ตามอำเภอ
const loadSubdistricts = async (districtId) => {
  if (!districtId) return subdistricts.value = []
  try {
    const res = await dataApi.getSubDistrictByDistrictId(districtId)
    subdistricts.value = res.data.data.map((item) => ({
      ...item,
      subdistrict_name_th: item?.subdistrict_name_i18n?.th || "",
      subdistrict_name_en: item?.subdistrict_name_i18n?.en || "",
      subdistrict_name_th: item?.subdistrict_name_i18n?.th || ""

    }))
  } catch (err) { console.log(err) }
}

// watch เมื่อ select จังหวัดเปลี่ยน → โหลดอำเภอใหม่, reset ค่าด้านล่าง
watch(shop_province_id, val => {
  shop_district_id.value = null
  shop_subdistrict_id.value = null
  districts.value = []
  subdistricts.value = []
  if (val) loadDistricts(val)
})

// watch เมื่อ select อำเภอเปลี่ยน → โหลดตำบลใหม่, reset ค่าด้านล่าง
watch(shop_district_id, val => {
  shop_subdistrict_id.value = null
  subdistricts.value = []
  if (val) loadSubdistricts(val)
})

// Computed objects for easier template access
const business_name = ref({
  get th() { return businessNameTh.value },
  set th(v) { businessNameTh.value = v },
  get en() { return businessNameEn.value },
  set en(v) { businessNameEn.value = v },
  get cn() { return businessNameCn.value },
  set cn(v) { businessNameCn.value = v }
});

const business_person = ref({
  get th() { return businessPersonTh.value },
  set th(v) { businessPersonTh.value = v },
  get en() { return businessPersonEn.value },
  set en(v) { businessPersonEn.value = v },
  get cn() { return businessPersonCn.value },
  set cn(v) { businessPersonCn.value = v }
});

const business_address = ref({
  get th() { return businessAddressTh.value },
  set th(v) { businessAddressTh.value = v },
  get en() { return businessAddressEn.value },
  set en(v) { businessAddressEn.value = v },
  get cn() { return businessAddressCn.value },
  set cn(v) { businessAddressCn.value = v }
});

// Helper function to get field errors
const getFieldError = (fieldName, langCode = null) => {
  if (langCode) {
    return errors.value[`${fieldName}.${langCode}`] || null;
  }
  return errors.value[fieldName] || null;
};

const handleNext = handleSubmit((values) => {

  // return console.log(values)
  // formStore.setForm3(
  //   values.business_name,
  //   values.business_person,
  //   values.business_address,
  //   values.business_contact,
  //   values.business_email,
  //   values.listFiles
  // );
  // formStore.nextPage();
  // Transform flat validation values back to nested structure for store
  // const transformedData = {
  //   business_name: {
  //     th: values['business_name.th'],
  //     en: values['business_name.en'],
  //     cn: values['business_name.cn']
  //   },
  //   business_person: {
  //     th: values['business_person.th'],
  //     en: values['business_person.en'],
  //     cn: values['business_person.cn']
  //   },
  //   business_address: {
  //     th: values['business_address.th'],
  //     en: values['business_address.en'],
  //     cn: values['business_address.cn']
  //   },
  //   business_contact: values.business_contact,
  //   business_email: values.business_email,
  //   listFiles: values.listFiles
  // };

  formStore.setForm3(
    values.business_name,
    values.business_person,
    values.business_address,
    values.shop_province_id,
    values.shop_district_id,
    values.shop_subdistrict_id,


    values.business_contact,
    values.business_email,
    values.listFiles
  );
  formStore.nextPage();
});

const onFileSelect = (event) => {
  event.files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      listFiles.value.push({ src: e.target.result, file });
    };
    reader.readAsDataURL(file);
  });
};

const removeFile = (index) => {
  listFiles.value.splice(index, 1);
};
</script>

<template>
  <div class="bg-zinc-100 min-h-screen">
    <LayoutsBaseHeader :title="t('ข้อมูลธุรกิจ')">
      <template #left>
        <ButtonIconBack @click="formStore.prevPage()" />
      </template>
    </LayoutsBaseHeader>

    <div class="max-w-[430px] mx-auto">
      <Form @submit="handleNext">
        <van-tabs v-model:active="activeLangTab" type="line" sticky animated color="#202c54">
          <van-tab v-for="(lang, idx) in langs" :key="lang.code" :title="lang.label" :name="idx">
            <div class="p-3">
              <div class="card">
              <h3 class="text-lg font-semibold text-zinc-900 mb-4">{{ t('ข้อมูลหน่วยงาน') }}</h3>

                <!-- Business Name - Multi-language -->
                <div>
                  <label class="label-input">
                    {{ t('ชื่อธุรกิจ') }}
                  </label>
                  <InputText v-model="business_name[lang.code]" class="w-full custom-border"
                    :class="{ 'p-invalid': getFieldError('business_name', lang.code) }"
                    :placeholder="t('ชื่อธุรกิจ')" />
                  <p v-if="getFieldError('business_name', lang.code)" class="error-text">
                    {{ getFieldError('business_name', lang.code) }}
                  </p>
                </div>

                <!-- Responsible Person - Multi-language -->
                <div>
                  <label class="label-input">
                    {{ t('ผู้รับผิดชอบ') }}
                  </label>
                  <InputText v-model="business_person[lang.code]" class="w-full custom-border"
                    :class="{ 'p-invalid': getFieldError('business_person', lang.code) }"
                    :placeholder="t('ผู้รับผิดชอบ')" />
                  <p v-if="getFieldError('business_person', lang.code)" class="error-text">
                    {{ getFieldError('business_person', lang.code) }}
                  </p>
                </div>

                <!-- จังหวัด -->
                <div>
                  <label class="label-input">{{ t('จังหวัด') }}</label>
                  <Dropdown v-model="shop_province_id" :options="provinces" optionValue="id"
                    :optionLabel="provinceLabelField" :placeholder="t('เลือกจังหวัด')"
                    class="w-full h-full custom-border" :filter="true" :showClear="true"
                    :invalid="errors?.shop_province_id ? true : false" />
                  <p class="error-text" v-if="errors?.shop_province_id">{{
                    errors?.shop_province_id }}</p>

                </div>
                <!-- อำเภอ -->
                <div>
                  <label class="label-input">{{ t('อำเภอ') }}</label>
                  <Dropdown v-model="shop_district_id" :options="districts" optionValue="id"
                    :optionLabel="districtLabelField" :placeholder="t('เลือกอำเภอ')" class="w-full h-full custom-border"
                    :filter="true" :showClear="true" :invalid="errors?.shop_district_id ? true : false" />
                  <p class="error-text" v-if="errors?.shop_district_id">{{
                    errors?.shop_district_id }}</p>
                </div>
                <!-- ตำบล -->
                <div>
                  <label class="label-input">{{ t('ตำบล') }}</label>
                  <Dropdown v-model="shop_subdistrict_id" :options="subdistricts" optionValue="id"
                    :optionLabel="subdistrictLabelField" :placeholder="t('เลือกตำบล')"
                    class="w-full h-full custom-border" :filter="true" :showClear="true"
                    :invalid="errors?.shop_subdistrict_id ? true : false" />
                  <p class="error-text" v-if="errors?.shop_subdistrict_id">{{
                    errors?.shop_subdistrict_id }}</p>
                </div>

                <!-- Address - Multi-language -->
                <div>
                  <label class="label-input">
                    {{ t('ที่อยู่') }}
                  </label>
                  <InputText v-model="business_address[lang.code]" class="w-full custom-border"
                    :class="{ 'p-invalid': getFieldError('business_address', lang.code) }"
                    :placeholder="lang.code === 'th' ? t('ที่อยู่') : lang.code === 'en' ? 'Address' : '地址'" />
                  <p v-if="getFieldError('business_address', lang.code)" class="error-text">
                    {{ getFieldError('business_address', lang.code) }}
                  </p>
                </div>

                <!-- Contact - Single field (shown in all tabs but same value) -->
                <div>
                  <label class="label-input">
                    {{ t('ติดต่อ') }}
                  </label>
                  <InputText v-model="business_contact" class="w-full custom-border"
                    :class="{ 'p-invalid': getFieldError('business_contact') }" :placeholder="t('เบอร์โทรศัพท์')" />
                  <p v-if="getFieldError('business_contact') && activeLangTab === idx" class="error-text">
                    {{ getFieldError('business_contact') }}
                  </p>
                </div>

                <!-- Email - Single field (shown in all tabs but same value) -->
                <div>
                  <label class="label-input">
                    {{ t('อีเมล') }}
                  </label>
                  <InputText v-model="business_email" class="w-full custom-border"
                    :class="{ 'p-invalid': getFieldError('business_email') }" :placeholder="t('อีเมล')" />
                  <p v-if="getFieldError('business_email') && activeLangTab === idx" class="error-text">
                    {{ getFieldError('business_email') }}
                  </p>
                </div>

                <!-- Files - Single field (shown in all tabs but same value) -->
                <div>
                  <label class="label-input">
                    {{ t('เอกสารรับรองหน่วยงาน') }}
                  </label>
                  <div class="flex justify-start">
                    <FileUpload mode="basic" @select="onFileSelect" customUpload rounded auto
                    :chooseLabel="t('เอกสาร')" chooseIcon="pi pi-file" :multiple="true" class="upload-button" />
                  </div>

                  <ul class="mt-4 space-y-2" v-if="listFiles && listFiles.length > 0">
                    <li v-for="(file, index) in listFiles" :key="index"
                      class="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                      <div class="flex items-center space-x-3">
                        <img v-if="file.file.type.startsWith('image/')" :src="file.src"
                          class="w-8 h-8 object-cover rounded-md" />
                        <span class="text-sm text-gray-800">{{ file.file.name }}</span>
                      </div>
                      <button @click="removeFile(index)"><i class="fa-solid fa-xmark text-red-700"></i></button>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="mt-6 pb-10">
              <Button :label="t('ยืนยัน')" :loading="isloadingAxi" class="w-full" severity="primary" rounded
                :pt="{ root: { class: '!h-12 !rounded-full !text-base' } }" type="submit" />
            </div>

            </div>
          </van-tab>
        </van-tabs>


      </Form>
    </div>

  </div>
</template>
