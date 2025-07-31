<template>
        <template v-if="surveyDataMap">
          <Dynamic :survey-data-map="surveyDataMap" @submit="handleFormSubmit" :default-values="mapDefaultValueData" 
          :model-change="model_change" />
        </template>
</template>
<script setup>
import * as dataApi from "./api/data.js";
const surveyDataMap = ref()
const model_change = ref([
])
const mapDefaultValueData = ref({})
const loadData = async () => {
  try {
    const res = await dataApi.getSurveyById()
    const arr = res.data.data.question_groups || []

    // flatten questions - เอา choices ของ group มาไว้ระดับเดียวกัน
    const flattenQuestions = (questions = []) => {
      const out = []
      for (const q of questions) {
        if (q.question_type === "group" && Array.isArray(q.choices) && q.choices.length > 0) {
          // ดึง info group ออกมา (ไม่เอา choices)
          const { choices, ...groupInfo } = q
          out.push(groupInfo)
          // แตก choices ทุกอันตามหลัง
          out.push(...q.choices)
        } else {
          out.push(q)
        }
      }
      return out
    }

    // เปลี่ยน array group เป็น object โดยใช้ group_name เป็น key
    // และเปลี่ยน questions เป็น _question (flatten แล้ว)
    const flatObject = arr.reduce((acc, cur) => {
      acc[cur.group_name] = {
        ...cur,
        _question: flattenQuestions(cur.questions)
      }
      delete acc[cur.group_name].questions // ลบ field questions เดิมออก (ถ้าไม่ต้องการ)
      return acc
    }, {})

    // ผลลัพธ์ flatObject ตามที่ต้องการ
    console.log('flatObject', flatObject)
    surveyDataMap.value = flatObject
  } catch (error) {
    console.error(error)
  }
}

onMounted(()=>{
    loadData();
})
// 

const handleFormSubmit =async (allFormsData) => {
  try {
    console.log('ส่งทั้งหมด:', allFormsData)
    const mergedData = Object.values(allFormsData).reduce((acc, curr) => {
    return { ...acc, ...curr }
  }, {})
  console.log('mergedData:', mergedData)


  } catch (error) {
    console.error('Error saving survey data:', error)
    
  }
}
</script>