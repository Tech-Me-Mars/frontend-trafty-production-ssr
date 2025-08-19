<template>
    <div class="min-h-screen bg-zinc-100">
        <LayoutsBaseHeader :title="t('ดูรายละเอียดใบเตือน')" :showBack="true"
            :BackTo="`/vendor/warning-list?BusinessId=${route.query.BusinessId}`" />

        <section class="max-w-lg p-4 mx-auto">
            <div v-if="resList.length > 0" class="mb-2 card max-w-md px-4" v-for="(item, index) in resList"
                :key="index">
                <div class="flex items-start space-x-3 mb-2">
                    <i class="fa-solid fa-circle-xmark text-red-600 mt-1"></i>
                    <div>
                        <div>
                            <span>{{ getI18n(item?.questions_field_name_display, locale) }}</span>
                            <p> <span class="font-bold">{{ t('หมายเหตุ') }}:</span><span>{{
                                getI18n(item?.survey_audit_detail_note, locale) }}</span></p>
                        </div>
                        <div>
                            <span>{{ getI18n(item?.questions_field_name_display, locale) }}</span>
                            <p> <span class="font-bold">{{ t('ตอบกลับ') }}:</span><span>{{
                                getI18n(item?.respond_warning_detail_note, locale) }}</span></p>
                        </div>

                    </div>

                </div>

                <div class="flex gap-3 items-start">
                    <img v-if="item?.respond_warning_detail_img_url" :src="item?.respond_warning_detail_img_url"
                        class="rounded-md w-18 h-14 object-cover border border-zinc-200" />
                </div>
            </div>
            <SharedNoData v-else />
        </section>
    </div>
</template>

<script setup>
definePageMeta({ middleware: ["auth"] });
import { useFieldArray, useForm, Form } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import * as dataApi from "./api/data.js";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const route = useRoute();
const isloadingAxi = useState("isloadingAxi");

const resList = ref([])
const loadWarningById = async () => {
    try {
        const res = await dataApi.getSurveyWarningRespondBySurVeyWarningId(route.params.id);
        resList.value = res.data.data;
    } catch (error) {
        console.error(error);
    }
};
onMounted(() => {
    loadWarningById();
})
</script>