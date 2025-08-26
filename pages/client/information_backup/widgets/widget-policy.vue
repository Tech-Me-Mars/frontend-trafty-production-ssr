<template>
    <div class=" bg-white">
        <div class="mx-auto  ">
            <div class="p-4 border-b flex justify-between">
                <h1 class="text-lg font-bold">{{ t('มาตรฐานความปลอดภัย') }}</h1>
                <NuxtLink :to="`/client/policy/${route.params.id}`" class="text-gray-500 text-sm">{{ t('ดูทั้งหมด') }} <i class="fa-solid fa-chevron-right"></i></NuxtLink>
            </div>

            <div class="p-4" v-if="resPolicy?.length>0">
                <h2 class="text-base font-semibold mb-2">
                    {{ resPolicy[0]?.topic_name }}
                </h2>
                <ul class="space-y-3">
                    <li class="flex items-start space-x-3" v-for="(item,index) in resPolicy[0]?.question" :key="index">
                        <i v-if="item.choice_text == 'มี'" class="fa-solid fa-circle-check text-blue-700 mt-1"></i>
                        <i v-else class="fa-solid fa-circle-xmark text-red-600 mt-1"></i>
                        <span>{{ item?.audit_questions_text }}</span>
                    </li>
                    
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import * as dataApi from '../api/data.js'

const route = useRoute();
const resPolicy=ref([])
const loadChoiceAudit=async ()=>{
    try {
        const res= await dataApi.getResultPoliceSurveyAudit(route.params.id);
        resPolicy.value =res.data.data;
    } catch (error) {
        
    }
}

onMounted(()=>{
    loadChoiceAudit();
})
</script>