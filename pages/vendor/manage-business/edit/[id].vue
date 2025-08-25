<template>
    <div class="bg-zinc-100 min-h-screen">
        <LayoutsBaseHeader  :title="t('ข้อมูลธุรกิจในแหล่งท่องเที่ยว')" :showBack="true" backTo="/vendor/my-business">
            <template #left>
                <!-- <ButtonIconBack @click="formStore.prevPage()" /> -->
            </template>
        </LayoutsBaseHeader>
        <section class="max-w-[430px] mx-auto">
            <van-tabs v-model:active="activeTab" type="line" sticky animated color="#202c54" :line-width="100">
                <van-tab :title="t('ข้อมูลธุรกิจ')" :name="t('ข้อมูลธุรกิจ')">
                    <BusinessEdit class="pt-2" />
                </van-tab>
                <van-tab :title="t('ข้อมูลร้านค้า')" :name="t('ข้อมูลร้านค้า')">
                    <ShopEdit class="pt-2" />
                </van-tab>

            </van-tabs>
        <ConfirmDialog />

        </section>
    </div>
</template>

<script setup>
import ShopEdit from './widgets/shop-edit.vue'
import BusinessEdit from './widgets/business-edit.vue'
definePageMeta({
    middleware: ["auth"],
});
import { useConfirm } from 'primevue/useconfirm'
import { useI18n } from 'vue-i18n';
const { t, locale, setLocale } = useI18n();
const isloadingAxi = useState("isloadingAxi");
const router = useRouter();
const route = useRoute();

import * as dataApi from "./api/data.js";
const activeTab = ref(0);
</script>