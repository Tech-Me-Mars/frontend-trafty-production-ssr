<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useForm, useField, Form } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as zod from 'zod';
import { useFormStore } from '@/store/businessStore.js';

const { t } = useI18n();
const router = useRouter();
const formStore = useFormStore();
const isloadingAxi = useState('isloadingAxi');
const alertToast = ref({});
const activeLangTab = ref('th');

// Step indicator
const stepsBar = ref([
  { step: 1, active: false },
  { step: 2, active: false },
  { step: 3, active: true },
  { step: 4, active: false },
  { step: 5, active: false },
]);

const requireValue = t('กรุณาระบุข้อมูลให้ถูกต้อง');

// Validation schema
const schema = zod.object({
  business_name: zod.object({
    th: zod.string().nonempty(requireValue),
    en: zod.string().nonempty(requireValue),
    cn: zod.string().nonempty(requireValue),
  }),
  business_person: zod.object({
    th: zod.string().nonempty(requireValue),
    en: zod.string().nonempty(requireValue),
    cn: zod.string().nonempty(requireValue),
  }),
  business_address: zod.object({
    th: zod.string().nonempty(requireValue),
    en: zod.string().nonempty(requireValue),
    cn: zod.string().nonempty(requireValue),
  }),
  business_contact: zod.object({
    th: zod.string().nonempty(requireValue),
    en: zod.string().nonempty(requireValue),
    cn: zod.string().nonempty(requireValue),
  }),
  business_email: zod.object({
    th: zod
      .string()
      .email(t('กรุณาระบุอีเมลที่ถูกต้อง'))
      .nonempty(requireValue),
    en: zod
      .string()
      .email(t('กรุณาระบุอีเมลที่ถูกต้อง'))
      .nonempty(requireValue),
    cn: zod
      .string()
      .email(t('กรุณาระบุอีเมลที่ถูกต้อง'))
      .nonempty(requireValue),
  }),
  listFiles: zod.object({
    th: zod.array(zod.any()).optional(),
    en: zod.array(zod.any()).optional(),
    cn: zod.array(zod.any()).optional(),
  }),
});

const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(schema),
});

const { value: business_name } = useField('business_name');
const { value: business_person } = useField('business_person');
const { value: business_address } = useField('business_address');
const { value: business_contact } = useField('business_contact');
const { value: business_email } = useField('business_email');
const { value: listFiles } = useField('listFiles', null, { 
  initialValue: {
    th: [],
    en: [],
    cn: []
  }
});

const handleNext = handleSubmit(() => {
  formStore.setForm3(
    business_name.value,
    business_person.value,
    business_address.value,
    business_contact.value,
    business_email.value,
    listFiles.value
  );
  formStore.nextPage();
});

const onFileSelect = (event, lang) => {
  event.files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      listFiles.value[lang].push({ src: e.target.result, file });
    };
    reader.readAsDataURL(file);
  });
};

const removeFile = (index, lang) => {
  listFiles.value[lang].splice(index, 1);
};
</script>

<template>
  <div class="bg-zinc-100 min-h-screen">
        <LayoutsBaseHeader :title="t('ข้อมูลธุรกิจ')">
            <template #left>
                <ButtonIconBack @click="formStore.prevPage()" />
            </template>
        </LayoutsBaseHeader>

    <div >

      {{ business_name }}
      <Form @submit="handleNext">
        <van-tabs v-model:active="activeLangTab" type="line" sticky animated color="#202c54">
          <van-tab title="ภาษาไทย" name="th" class="p-2 pt-10">
            <div class="space-y-4 card">
              <div>
                <label class="label-input">{{ t('ชื่อธุรกิจ') }}</label>
                <InputText v-model="business_name.th" class="w-full custom-border" :placeholder="t('ชื่อธุรกิจ')" />
              </div>
              <div>
                <label class="label-input">{{ t('ผู้รับผิดชอบ') }}</label>
                <InputText v-model="business_person.th" class="w-full custom-border" :placeholder="t('ผู้รับผิดชอบ')" />
              </div>
              <div>
                <label class="label-input">{{ t('ที่อยู่') }}</label>
                <InputText v-model="business_address.th" class="w-full custom-border" :placeholder="t('ที่อยู่')" />
              </div>
              <div>
                <label class="label-input">{{ t('ติดต่อ') }}</label>
                <InputText v-model="business_contact.th" class="w-full custom-border" :placeholder="t('เบอร์โทรศัพท์')" />
              </div>
              <div>
                <label class="label-input">{{ t('อีเมล') }}</label>
                <InputText v-model="business_email.th" class="w-full custom-border" :placeholder="t('อีเมล')" />
              </div>
              <div>
                <label class="label-input">{{ t('เอกสารรับรอง') }}</label>
                <FileUpload mode="basic" @select="(event) => onFileSelect(event, 'th')" customUpload rounded auto :chooseLabel="t('เพิ่มไฟล์')"
                  chooseIcon="pi pi-upload" :multiple="true" class="p-button-outlined border-gray-00" />

                <ul class="mt-4 space-y-2" v-if="listFiles.th && listFiles.th.length > 0">
                  <li v-for="(file, index) in listFiles.th" :key="index" class="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                    <div class="flex items-center space-x-3">
                      <img v-if="file.file.type.startsWith('image/')" :src="file.src" class="w-8 h-8 object-cover rounded-md" />
                      <span class="text-sm text-gray-800">{{ file.file.name }}</span>
                    </div>
                    <button @click="removeFile(index, 'th')"><i class="fa-solid fa-xmark text-red-700"></i></button>
                  </li>
                </ul>
              </div>
            </div>
          </van-tab>

          <van-tab title="English" name="en" class="p-2 pt-10">
            <div class="space-y-4 card">
              <div>
                <label class="label-input">Business Name</label>
                <InputText v-model="business_name.en" class="w-full custom-border" placeholder="Business Name" />
              </div>
              <div>
                <label class="label-input">Responsible Person</label>
                <InputText v-model="business_person.en" class="w-full custom-border" placeholder="Responsible Person" />
              </div>
              <div>
                <label class="label-input">Address</label>
                <InputText v-model="business_address.en" class="w-full custom-border" placeholder="Address" />
              </div>
              <div>
                <label class="label-input">Contact</label>
                <InputText v-model="business_contact.en" class="w-full custom-border" placeholder="Phone Number" />
              </div>
              <div>
                <label class="label-input">Email</label>
                <InputText v-model="business_email.en" class="w-full custom-border" placeholder="Email" />
              </div>
              <div>
                <label class="label-input">Certification Documents</label>
                <FileUpload mode="basic" @select="(event) => onFileSelect(event, 'en')" customUpload rounded auto chooseLabel="Add Files"
                  chooseIcon="pi pi-upload" :multiple="true" class="p-button-outlined border-gray-00" />

                <ul class="mt-4 space-y-2" v-if="listFiles.en && listFiles.en.length > 0">
                  <li v-for="(file, index) in listFiles.en" :key="index" class="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                    <div class="flex items-center space-x-3">
                      <img v-if="file.file.type.startsWith('image/')" :src="file.src" class="w-8 h-8 object-cover rounded-md" />
                      <span class="text-sm text-gray-800">{{ file.file.name }}</span>
                    </div>
                    <button @click="removeFile(index, 'en')"><i class="fa-solid fa-xmark text-red-700"></i></button>
                  </li>
                </ul>
              </div>
            </div>
          </van-tab>

          <van-tab title="中文" name="cn" class="p-2 pt-10">
            <div class="space-y-4 card">
              <div>
                <label class="label-input">公司名称</label>
                <InputText v-model="business_name.cn" class="w-full custom-border" placeholder="公司名称" />
              </div>
              <div>
                <label class="label-input">负责人</label>
                <InputText v-model="business_person.cn" class="w-full custom-border" placeholder="负责人" />
              </div>
              <div>
                <label class="label-input">地址</label>
                <InputText v-model="business_address.cn" class="w-full custom-border" placeholder="地址" />
              </div>
              <div>
                <label class="label-input">联系方式</label>
                <InputText v-model="business_contact.cn" class="w-full custom-border" placeholder="电话号码" />
              </div>
              <div>
                <label class="label-input">邮箱</label>
                <InputText v-model="business_email.cn" class="w-full custom-border" placeholder="邮箱" />
              </div>
              <div>
                <label class="label-input">认证文件</label>
                <FileUpload mode="basic" @select="(event) => onFileSelect(event, 'cn')" customUpload rounded auto chooseLabel="添加文件"
                  chooseIcon="pi pi-upload" :multiple="true" class="p-button-outlined border-gray-00" />

                <ul class="mt-4 space-y-2" v-if="listFiles.cn && listFiles.cn.length > 0">
                  <li v-for="(file, index) in listFiles.cn" :key="index" class="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                    <div class="flex items-center space-x-3">
                      <img v-if="file.file.type.startsWith('image/')" :src="file.src" class="w-8 h-8 object-cover rounded-md" />
                      <span class="text-sm text-gray-800">{{ file.file.name }}</span>
                    </div>
                    <button @click="removeFile(index, 'cn')"><i class="fa-solid fa-xmark text-red-700"></i></button>
                  </li>
                </ul>
              </div>
            </div>
          </van-tab>
        </van-tabs>

       <div class="mx-auto w-full max-w-sm pb-10">
         <Button :loading="isloadingAxi" :label="t('ยืนยัน')" severity="primary" type="submit" rounded class="w-full mt-6"
          :pt="{ root: { class: '!border-primary-main' } }" @click="formStore.nextPage();" />
       </div>
      </Form>
    </div>

    <MyToast :data="alertToast" />
  </div>
</template>

<style scoped>
.van-nav-bar {
  --van-nav-bar-background: #281c74;
  --van-nav-bar-text-color: white;
  --van-nav-bar-icon-color: white;
  --van-nav-bar-title-text-color: white;
  --van-nav-bar-height: 70px;
}
</style>