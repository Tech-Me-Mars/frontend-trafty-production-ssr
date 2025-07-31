<style>
.radio-inline-group {
  width: 100%;
  white-space: normal;
  /* ✅ ให้ content พับบรรทัดได้ */
}

td.radio-table-cell {
  min-width: 12rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.max-w-input-text {
  max-width: 18rem;
  width: 100%;
}

.option-wrap {
  min-width: 120px;
  flex-shrink: 0;
  align-items: center;
  white-space: nowrap;
}

.radio-row {
  gap: 24px;
}

.custom-table {
  border: 2px solid black;
  border-collapse: collapse;
}

.min-h-td {
  /* min-height: 10rem!important; */
  height: 3rem;
  /* vertical-align: middle; */
}

.custom-table {
  border: 2px solid black;
  border-collapse: collapse;
}

/* สำหรับ label (ชิดซ้าย + vertical center) */
.cell-label {
  /* vertical-align: middle !important; */
  /* text-align: left !important; */
  padding-left: 12px;
  /* เพิ่มความห่างซ้ายได้ตามต้องการ */
}

/* สำหรับ input อื่น ๆ (center กลางทุกทิศ) */
.cell-center {
  vertical-align: middle !important;
  text-align: center !important;
}

/* มีเส้น */
.custom-table {
  border: 2px solid black;
  border-collapse: collapse;
}

.custom-table td {
  border: 1px solid black;
}

/* ไม่มีเส้น */
.no-border {
  border: none;
  border-collapse: collapse;
}

.no-border td {
  border: none;
}

.label-dynamic {
  display: block;
  margin-bottom: 0.25rem;
  /* mb-1 เท่ากับ 4px */
  font-size: 0.875rem;
  /* text-sm เท่ากับ 14px */
  font-weight: 500;
  /* font-medium */
  color: #374151;
  /* text-gray-700 */
}
</style>
<template>
  <!-- <pre>{{ surveyDataMap }}</pre> -->
  <form @submit.prevent="submitAllForms" class="space-y-4">
    <template v-for="(formData, formKey) in surveyDataMap" :key="formKey">
      <!-- {{ formData }} -->
      <div class="bg-white rounded-lg shadow p-4 mb-4">
        <div class="text-base font-semibold mb-2">{{ formData.group_name_display }}</div>
        <div class="grid grid-cols-1 ">
          <template v-for="question in (formData._question)" :key="question.id">

            <!-- Input field ปกติ -->
            <div v-if="question.question_type !== 'table'">
              <div :class="[
                'p-1 m-0',
                `col-span-${question.col_span || 12}`,
                `md:col-span-${question.col_span_md || question.col_span || 12}`,
                `lg:col-span-${question.col_span_lg || question.col_span_md || question.col_span || 12}`
              ]">
                <!-- Input text -->
                <div v-if="question.question_type === 'input_text' && question.question_other != 2" class="mb-4">
                  <label v-if="question.field_name_display" class="block text-sm font-medium text-gray-700 mb-2">
                    {{ JSON.parse(question.field_name_display).th }}:
                  </label>
                  <InputText v-model="formValuesMap[formKey][question.field_name]" :readonly="question.readonly === 1"
                    :required="question.required === 1" :class="[
                      'w-full',
                      question.required === 1 && !formValuesMap[formKey][question.field_name] ? 'p-invalid' : ''
                    ]" @input="handleInputChange(formKey, question.field_name)" />
                  <small v-if="question.field_name_display_end" class="text-gray-500 mt-1 block">
                    {{ question.field_name_display_end }}
                  </small>
                </div>


                <!-- Input number -->
                <div v-else-if="question.question_type === 'input_text_number'" class="mb-4">
                  <label v-if="question.field_name_display" class="block text-sm font-medium text-gray-700 mb-2">
                    {{ JSON.parse(question.field_name_display).th }}:
                  </label>
                  <InputNumber v-model="formValuesMap[formKey][question.field_name]" :readonly="question.readonly === 1"
                    :required="question.required === 1" :class="[
                      'w-full',
                      question.required === 1 && !formValuesMap[formKey][question.field_name] ? 'p-invalid' : ''
                    ]" />
                  <small v-if="question.field_name_display_end" class="text-gray-500 mt-1 block">
                    {{ question.field_name_display_end }}
                  </small>
                </div>

                <!-- Date -->
                <div v-else-if="question.question_type === 'date'" class="mb-4">
                  <label v-if="question.field_name_display" class="block text-sm font-medium text-gray-700 mb-2">
                    {{ JSON.parse(question.field_name_display).th }}:
                  </label>
                  <!-- <Calendar
                    v-model="formValuesMap[formKey][question.field_name]"
                    :required="question.required === 1"
                    dateFormat="yy-mm-dd"
                    :class="[
                      'w-full',
                      question.required === 1 && !formValuesMap[formKey][question.field_name] ? 'p-invalid' : ''
                    ]"
                  /> -->
                  <CustomDatePicker v-model="formValuesMap[formKey][question.field_name]" inputClass="w-full"
                    :required="question.required === 1" dateFormat="yy-mm-dd" :class="[
                      'w-full',
                      question.required === 1 && !formValuesMap[formKey][question.field_name] ? 'p-invalid' : ''
                    ]" />
                  <small v-if="question.field_name_display_end" class="text-gray-500 mt-1 block">
                    {{ question.field_name_display_end }}
                  </small>
                </div>

                <!-- Time -->
                <div v-else-if="question.question_type === 'time'" class="mb-4">
                  <label v-if="question.field_name_display" class="block text-sm font-medium text-gray-700 mb-2">
                    {{ JSON.parse(question.field_name_display).th }}:
                  </label>
                  <Calendar v-model="formValuesMap[formKey][question.field_name]" :required="question.required === 1"
                    timeOnly :class="[
                      'w-full',
                      question.required === 1 && !formValuesMap[formKey][question.field_name] ? 'p-invalid' : ''
                    ]" />
                  <small v-if="question.field_name_display_end" class="text-gray-500 mt-1 block">
                    {{ question.field_name_display_end }}
                  </small>
                </div>


                <!-- Textarea -->
                <div v-else-if="question.question_type === 'textarea'" class="mb-4">
                  <label v-if="question.field_name_display" class="block text-sm font-medium text-gray-700 mb-2">
                    {{ JSON.parse(question.field_name_display).th }}:
                  </label>
                  <Textarea v-model="formValuesMap[formKey][question.field_name]" :readonly="question.readonly === 1"
                    :required="question.required === 1" :autoResize="true" rows="3" :class="[
                      'w-full',
                      question.required === 1 && !formValuesMap[formKey][question.field_name] ? 'p-invalid' : ''
                    ]" />
                  <small v-if="question.field_name_display_end" class="text-gray-500 mt-1 block">
                    {{ question.field_name_display_end }}
                  </small>
                </div>



                <!-- Label -->
                <div v-else-if="question.question_type === 'label'" :class="[
                  'p-2 mb-2',
                  question.text_align === 'center' ? 'text-center' : '',
                  question.text_align === 'right' ? 'text-right' : 'text-left'
                ]">
                  <div class="text-lg font-medium text-gray-800" :style="{
                    'text-indent': question['text_indent'] || '0',
                    'font-weight': question['font_weight'] || 'normal',
                    'text-decoration': question['text_decoration'] || 'none'
                  }">
                    {{ JSON.parse(question.field_name_display).th }}
                  </div>
                  <!-- <div v-if="question.field_name_display_end" class="text-lg font-medium text-gray-800">
                    {{ question.field_name_display_end }}
                  </div> -->
                </div>


                <!-- Checkbox Options -->
                <div v-else-if="question.question_type === 'checkbox' || question.question_type === 'checkbox-other'"
                  class="">
                  <div class="flex flex-wrap items-center w-full">
                    <div class="flex items-center space-x-2">
                      <!-- {{ formValuesMap[formKey][question.field_name] }} -->
                      <Checkbox v-model="formValuesMap[formKey][question.field_name]"
                        :inputId="`${formKey}_${question.field_name}`" binary :trueValue="question.checked_value"
                        :falseValue="question.unchecked_value" @change="handleCheckboxChange(formKey, question)" />
                      <label :for="`${formKey}_${question.field_name}`" class="text-sm text-gray-700 cursor-pointer">
                        {{ JSON.parse(question.field_name_display).th }}
                      </label>
                    </div>

                    <!-- Child Text Inputs -->
                    <div class="flex items-center space-x-2 ml-4">
                      <div v-for="childQuestion in findChildQuestions(formData._question, question)"
                        :key="childQuestion.id">
                        <InputText v-model="formValuesMap[formKey][childQuestion.field_name]"
                          :placeholder="JSON.parse(childQuestion.field_name_display).th || 'ระบุ'"
                          :disabled="formValuesMap[formKey][question.field_name] !== question.checked_value"
                          class="w-52" size="small" />
                      </div>
                    </div>
                  </div>
                </div>


                <!-- Radio Options -->
                <div v-else-if="question.question_type === 'radio' || question.question_type === 'radio-other'"
                  class="">

                  <label v-if="question.field_name_display" class="block text-sm font-medium text-gray-700 mb-3">
                    {{ JSON.parse(question.field_name_display).th }}
                  </label>


                  <div v-if="question.direction === 'horizental'" class="flex flex-wrap items-center gap-4">
                    <template v-for="option in normalizeSelectValue(question.select_value)" :key="option.value">
                      <div class="flex items-center space-x-2 flex-shrink-0">
                        <RadioButton v-model="formValuesMap[formKey][question.field_name]"
                          :inputId="`${formKey}_${question.field_name}_${option.value}`" :value="option.value" />
                        <label :for="`${formKey}_${question.field_name}_${option.value}`"
                          class="text-sm text-gray-700 cursor-pointer" v-if="typeof (option.text) == 'object'">
                          {{ option.text.th }}
                        </label>
                        <label :for="`${formKey}_${question.field_name}_${option.value}`"
                          class="text-sm text-gray-700 cursor-pointer" v-else>
                          {{ JSON.parse(option.text).th }}
                        </label>


                        <div v-if="option.is_other" class="ml-2">
                          <div v-for="childQuestion in findChildQuestionsRadio(formData._question, question)"
                            :key="childQuestion.id">
                            <InputText v-model="formValuesMap[formKey][childQuestion.field_name]"
                              :placeholder="parse(childQuestion.field_name_display).th || 'ระบุ'"
                              :disabled="formValuesMap[formKey][question.field_name] !== option.value" class="w-44"
                              size="small" />
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>


                  <div v-else class="space-y-3">
                    <template v-for="option in normalizeSelectValue(question.select_value)" :key="option.value">
                      <div class="flex items-center space-x-2">
                        <RadioButton v-model="formValuesMap[formKey][question.field_name]"
                          :inputId="`${formKey}_${question.field_name}_${option.value}`" :value="option.value" />
                        <label :for="`${formKey}_${question.field_name}_${option.value}`"
                          class="text-sm text-gray-700 cursor-pointer" v-if="typeof (option.text) == 'object'">
                          {{ option.text.th }}
                        </label>
                        <label :for="`${formKey}_${question.field_name}_${option.value}`"
                          class="text-sm text-gray-700 cursor-pointer" v-else>
                          {{ JSON.parse(option.text).th }}
                        </label>


                        <template v-if="option.is_other">
                          <div class="flex items-center space-x-2 ml-2">
                            <template v-for="childQuestion in findChildQuestionsRadio(formData._question, question)"
                              :key="childQuestion.id">
                              <InputText v-model="formValuesMap[formKey][childQuestion.field_name]"
                                :placeholder="parse(childQuestion.field_name_display).th || 'ระบุ'"
                                :disabled="formValuesMap[formKey][question.field_name] !== option.value" class="w-40"
                                size="small" />
                            </template>
                          </div>
                        </template>
                      </div>
                    </template>
                  </div>
                </div>









                <!-- Select -->
                <div v-else-if="question.question_type === 'select'" class="mb-4">
                  <label v-if="question.field_name_display" class="block text-sm font-medium text-gray-700 mb-2">
                    {{ question.field_name_display }}:
                  </label>
                  <Dropdown v-model="formValuesMap[formKey][question.field_name]"
                    :options="normalizeSelectValue(question.select_value)" optionLabel="text" optionValue="value"
                    :class="[
                      'w-full',
                      question.required === 1 && !formValuesMap[formKey][question.field_name] ? 'p-invalid' : ''
                    ]" />
                  <small v-if="question.field_name_display_end" class="text-gray-500 mt-1 block">
                    {{ question.field_name_display_end }}
                  </small>
                </div>





                <!-- เพิ่ม input, textarea, select ฯลฯ ตามปกติ -->
              </div>
            </div>




          </template>
        </div>
      </div>
    </template>

    <div class="flex items-center justify-end gap-2 py-4">
      <Button :loading="isloadingAxi" type="submit" label="บันทึกข้อมูลทั้งหมด"
        class="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg px-6 py-2 shadow transition disabled:opacity-60"
        severity="primary" size="large" icon="pi pi-save" iconPos="left" />
    </div>
  </form>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
// import { uploadFileToExternalAPI } from '@/service/UploadExternalService'
// import * as api from '@/service/api/template.js'


const isloadingAxi = useState('isloadingAxi', () => true)

const props = defineProps({
  surveyDataMap: {
    type: Object,
    required: true
  },
  defaultValues: Object,
  modelChange: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['submit'])
const formRef = ref(null)

// สร้าง Object สำหรับเก็บค่าจากฟอร์ม
const formValuesMap = ref({})


// อัปเดต field เป้าหมายเมื่อ field ต้นทางเปลี่ยน
watch(
  () => formValuesMap.value,
  (newVal) => {
    props.modelChange.forEach(({ from, to }) => {
      const fromVal = newVal?.main?.[from] // ปรับให้ใช้ key ที่ตรงกับ formKey เช่น main
      if (fromVal !== undefined) {
        formValuesMap.value.main[to] = fromVal
      }
    })
  },
  { deep: true }
)
const handleInputChange = (formKey, fieldName) => {
  const newValue = formValuesMap.value[formKey][fieldName]

  // ตรวจสอบ modelChange และ sync ค่า
  props.modelChange.forEach(({ from, to }) => {
    if (from === fieldName) {
      formValuesMap.value[formKey][to] = newValue
    }
  })
}


// เก็บ ref ของ signature pads
const signatureRefs = ref({})
const signatureErrors = ref({})

// ฟังก์ชันสำหรับกำหนด ref ของ signature pad
const setSignatureRef = (formKey, fieldName, el) => {
  if (el) {
    const key = `${formKey}_${fieldName}`
    signatureRefs.value[key] = el
  }
}

// ฟังก์ชันสำหรับสร้าง table rows พร้อมจัดการ colspan และ rowspan
const generateTableRows = (tableQuestions) => {
  if (!tableQuestions || tableQuestions.length === 0) return []

  // จัดกลุ่มตาม table_row_set
  const rowGroups = {}
  tableQuestions.forEach(q => {
    const rowSet = q.table_row_set || 1
    if (!rowGroups[rowSet]) rowGroups[rowSet] = []
    rowGroups[rowSet].push(q)
  })

  // สร้างแถวตามลำดับ table_row_set
  const rows = Object.keys(rowGroups)
    .sort((a, b) => Number(a) - Number(b))
    .map(rowKey => {
      const questions = rowGroups[rowKey]
      // เรียงตาม index ภายในแถว
      questions.sort((a, b) => Number(a.index || 0) - Number(b.index || 0))

      return questions.map(q => ({
        question: q,
        colspan: parseInt(q.col_span_table) || 1,
        rowspan: parseInt(q.row_span_table) || 1,
        skip: false
      }))
    })

  // จัดการ rowspan ที่ซับซ้อน - ทำเครื่องหมายเซลล์ที่ถูก rowspan
  const occupiedCells = new Set()
  const finalRows = []

  rows.forEach((row, rowIndex) => {
    const finalRow = []
    let colIndex = 0

    row.forEach(cell => {
      // ข้ามคอลัมน์ที่ถูก rowspan จากแถวก่อนหน้า
      while (occupiedCells.has(`${rowIndex}-${colIndex}`)) {
        finalRow.push({ skip: true })
        colIndex++
      }

      // เพิ่มเซลล์ปัจจุบัน
      finalRow.push(cell)

      // ทำเครื่องหมายเซลล์ที่ถูกใช้งานโดย rowspan และ colspan
      for (let r = 0; r < cell.rowspan; r++) {
        for (let c = 0; c < cell.colspan; c++) {
          if (r > 0) { // rowspan ที่มากกว่า 1 จะส่งผลต่อแถวถัดไป
            occupiedCells.add(`${rowIndex + r}-${colIndex + c}`)
          }
        }
      }

      colIndex += cell.colspan
    })

    finalRows.push(finalRow)
  })

  return finalRows
}

// แปลง base64 เป็น File
const base64ToFile = (base64Data, filename = 'signature.png') => {
  const arr = base64Data.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

// ฟังก์ชันอัปโหลดลายเซ็น
const uploadSignature = async (formKey, fieldName) => {
  const key = `${formKey}_${fieldName}`
  const signaturePad = signatureRefs.value[key]

  if (!signaturePad || signaturePad.isCanvasEmpty()) {
    return null
  }

  try {
    const base64 = signaturePad.saveSignature()
    const file = base64ToFile(base64, `signature_${fieldName}.png`)

    const formData = new FormData()
    formData.append('filez', file)

    // const url = await uploadFileToExternalAPI(formData)
    return url
  } catch (error) {
    console.error('Error uploading signature:', error)
    throw error
  }
}
import { format } from 'date-fns'

// สร้าง formValues ตามโครงสร้าง form และ defaultValues
const initializeFormValues = (surveyMap, defaultValues = {}) => {
  const result = {};

  for (const [key, form] of Object.entries(surveyMap)) {
    result[key] = {};

    // Prepare map id -> question (easier to find parent)
    const questionList = form._question || [];
    const questionById = {};
    for (const q of questionList) {
      questionById[q.id] = q;
    }

    for (const q of questionList) {
      let value = '';

      // Prioritize defaultValues > field_value > default_value > checkbox unchecked
      if (defaultValues && defaultValues[q.field_name] != null && defaultValues[q.field_name] !== '') {
        value = defaultValues[q.field_name];
      } else if (q.field_value != null && q.field_value !== '') {
        value = q.field_value;
      } else if (q.default_value != null && q.default_value !== '') {
        value = q.default_value;
      } else if (q.question_type === 'checkbox' || q.question_type === 'checkbox-other') {
        value = q.unchecked_value;
      }
      else if (q.question_type === 'date' && q.default_value !== '') {
        value = format(new Date(), 'yyyy-MM-dd');
      }
      else if (q.question_type === 'time' && q.default_value !== '') {
        value = format(new Date(), 'HH:mm');
      }
      else if (q.question_type === 'files' && q.default_value !== '') {
        // Initialize files and url arrays separately
        value = {
          files: [], // For storing file objects or metadata
          url: JSON.parse('["https/CNTDEVELOP/pdf1.com","https/CNTDEVELOP/pdf2.com"]') || [] // For storing URLs
        };
      }

      // Assign the value to the field in the result
      result[key][q.field_name] = value;

      // Add parent_id for child questions (question_other == 2)
      if (q.question_other == 2) {
        // Find the parent: must be question_other == 1 and question_other_multiple_choice_id === q.id
        const parent = questionList.find(
          (qq) =>
            qq.question_other == 1 &&
            qq.question_other_multiple_choice_id === q.id
        );
        if (parent) {
          q.parent_id = parent.id;
        } else {
          q.parent_id = null;
        }
      }
    }
  }

  formValuesMap.value = result;
};
const isParentChecked = computed(() => {
  return (formKey, childQuestion) => {
    if (childQuestion.question_other !== 2 || !childQuestion.parent_id) {
      return true // ถ้าไม่มี parent ให้ enable เสมอ
    }

    // หา parent question
    const parentQuestion = props.surveyDataMap[formKey]?._question?.find(q =>
      q.id == childQuestion.parent_id
    )

    if (!parentQuestion) {
      console.warn(`Parent question not found for child ${childQuestion.id}`)
      return true
    }

    const parentValue = formValuesMap.value[formKey]?.[parentQuestion.field_name]
    const isChecked = parentValue === "1" || parentValue === parentQuestion.checked_value
    return isChecked
  }
})

let isInitialized = false;
watch(
  () => [props.surveyDataMap, props.defaultValues],
  ([newMap, newDefaultValues]) => {
    if (!isInitialized && newMap && Object.keys(newMap).length > 0) {
      initializeFormValues(newMap, newDefaultValues)
      isInitialized = true
    }
  },
  { immediate: true, deep: true }
)

// เฝ้าดูการเปลี่ยนแปลงของ props
// watch(
//   () => [props.surveyDataMap, props.defaultValues],
//   ([newMap, newDefaultValues]) => {
//     if (newMap) {
//       initializeFormValues(newMap, newDefaultValues)
//     }
//   },
//   { immediate: true, deep: true }
// )

// เฝ้าดู defaultValues แยกเพื่อ update ค่าที่มีอยู่แล้ว
watch(
  () => props.defaultValues,
  (newDefaultValues) => {
    if (newDefaultValues && formValuesMap.value) {
      for (const [formKey, formData] of Object.entries(formValuesMap.value)) {
        for (const fieldName in newDefaultValues) {
          if (formData.hasOwnProperty(fieldName) && newDefaultValues[fieldName] != null && newDefaultValues[fieldName] !== '') {
            formData[fieldName] = newDefaultValues[fieldName]
          }
        }
      }
    }
  },
  { deep: true }
)

// ค้นหา child questions ที่เกี่ยวข้องกับ parent checkbox-other หรือ radio-other
const findChildQuestions = (questions, parentQuestion) => {
  if (!parentQuestion || !parentQuestion.question_other_multiple_choice_id) return []

  return questions.filter(q =>
    q.question_other === 2 && q.id === parentQuestion.question_other_multiple_choice_id
  )
}
const findChildQuestionsCheckboxOther = (questions, parentQuestion) => {


  if (!parentQuestion) return []
  const result = questions.filter(q =>
    q.question_other == 2 &&
    (
      q.parent_id == parentQuestion.id ||
      parentQuestion.question_other_multiple_choice_id == q.id
    )
  )
  return result
}

const findChildQuestionsRadio = (questions, parentQuestion) => {
  // เอาลูกที่ parent_id == parentQuestion.id (รองรับได้หลายลูก)
  if (!parentQuestion) return []
  return questions.filter(q => q.question_other === 2 && q.parent_id === parentQuestion.id)
}

// กฎการตรวจสอบฟิลด์ที่จำเป็น
const requiredRule = (label) => (v) => !!v || `กรุณากรอก ${label}`
// ปรับปรุงฟังก์ชัน handleCheckboxChange
const handleCheckboxChange = (formKey, question) => {
  console.log('check')
  // หากเป็น checkbox-other และถูก uncheck
  if (question.question_type === 'checkbox-other' &&
    formValuesMap.value[formKey][question.field_name] === question.unchecked_value) {

    // ค้นหา child questions และล้างค่า
    const childQuestions = findChildQuestions(props.surveyDataMap[formKey]._question, question)
    childQuestions.forEach(childQ => {
      formValuesMap.value[formKey][childQ.field_name] = ''
    })
  }

  // ✅ จัดการ parent-child relationship สำหรับ checkbox ที่เป็น parent
  if (question.question_other === 1) {
    const isChecked = formValuesMap.value[formKey][question.field_name] === "1" ||
      formValuesMap.value[formKey][question.field_name] === question.checked_value


    if (!isChecked) {
      const childQuestions = props.surveyDataMap[formKey]._question.filter(q =>
        q.question_other === 2 && q.parent_id === question.id
      )

      childQuestions.forEach(childQ => {
        formValuesMap.value[formKey][childQ.field_name] = ''
      })
    }
  }

  // ✅✅✅ เพิ่มส่วนนี้: รองรับ modelChange ไม่กระทบ logic อื่น
  if (props.modelChange?.length) {
    const fieldName = question.field_name
    const newValue = formValuesMap.value[formKey][fieldName]

    props.modelChange.forEach(({ from, to }) => {
      if (from === fieldName) {
        formValuesMap.value[formKey][to] = newValue
      }
    })
  }
}


const setupParentChildWatchers = () => {
  nextTick(() => {
    for (const [formKey, formData] of Object.entries(props.surveyDataMap)) {
      for (const question of formData._question || []) {
        // หา parent questions (question_other === 1)
        if (question.question_other === 1) {
          // Watch การเปลี่ยนแปลงของ parent question
          watch(
            () => formValuesMap.value[formKey]?.[question.field_name],
            (newValue, oldValue) => {
              if (newValue !== oldValue) {
                const isChecked = newValue === "1" || newValue === question.checked_value


                if (!isChecked) {
                  // หา child questions ที่เกี่ยวข้อง
                  const childQuestions = formData._question.filter(q =>
                    q.question_other == 2 && q.parent_id == question.id
                  )

                  // ล้างค่า child questions
                  childQuestions.forEach(childQ => {
                    formValuesMap.value[formKey][childQ.field_name] = ''
                  })
                }
              }
            }
          )
        }
      }
    }
  })
}

// เรียกใช้ setupParentChildWatchers ใน onMounted
onMounted(() => {
  if (props.surveyDataMap) {
    initializeFormValues(props.surveyDataMap, props.defaultValues)
  }
});
onMounted(async () => {
  setupParentChildWatchers()
})

// จัดการเมื่อ radio เปลี่ยนแปลง
const handleRadioChange = (formKey, question, newValue) => {
  // ค้นหา child questions
  const childQuestions = findChildQuestions(props.surveyDataMap[formKey]._question, question)

  if (childQuestions.length > 0) {
    // ตรวจสอบว่าค่าที่เลือกใหม่เป็น option ที่มี is_other หรือไม่
    const selectOptions = normalizeSelectValue(question.select_value)
    const selectedOption = selectOptions.find(opt => opt.value === newValue)

    // หากไม่ใช่ option ที่มี is_other ให้ล้างค่าในช่อง input
    if (!selectedOption || !selectedOption.is_other) {
      childQuestions.forEach(childQ => {
        formValuesMap.value[formKey][childQ.field_name] = ''
      })
    }
  }

  // อัปเดตค่า radio
  formValuesMap.value[formKey][question.field_name] = newValue
}

// แปลงค่า select_value เป็น Array format ที่ v-select ต้องการ
const normalizeSelectValue = (val) => {
  if (Array.isArray(val)) return val
  try {
    const parsed = JSON.parse(val)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function normalizeTableQuestions(questions) {
  if (questions) {
    return;
  }
  console.log(questions)
  // เก็บ id ของทุก table (question_type === 'table')
  const tables = questions.filter(q => q.question_type === 'table')
  const others = questions.filter(
    q =>
      q.question_type !== 'table' &&
      !(
        q.group_questions_id &&
        tables.some(t => t.id === q.group_questions_id)
      )
  )

  // สร้าง array ใหม่ที่ลำดับตาม index (ถ้ามี index field)
  const result = []
  for (const q of questions) {
    if (q.question_type === 'table') {
      // หาลูก
      const children = questions.filter(
        child =>
          child.group_questions_id === q.id &&
          (child.question_type.endsWith('_table') ||
            child.question_type === 'label_table')
      )
      result.push({ ...q, item_in_table: children })
    } else if (
      !(
        q.group_questions_id &&
        tables.some(t => t.id === q.group_questions_id)
      )
    ) {
      result.push(q)
    }
  }
  return result
}

const validateAndUploadSignatures = async () => {
  const uploadPromises = []
  let hasSignatureErrors = false
  const errorMessages = []

  // รีเซ็ต errors
  signatureErrors.value = {}

  for (const [formKey, formData] of Object.entries(props.surveyDataMap)) {
    for (const question of formData._question || []) {
      if (question.question_type === 'signpad') {
        const key = `${formKey}_${question.field_name}`
        const signaturePad = signatureRefs.value[key]
        const currentValue = formValuesMap.value[formKey][question.field_name]

        // 🔥 หากเป็น URL แล้ว (มี https:// หรือ /) ให้ข้าม validation+upload ไปเลย
        if (
          typeof currentValue === 'string' &&
          currentValue &&
          (currentValue.startsWith('http') || currentValue.startsWith('/'))
        ) {
          // ถือว่า valid และ upload ไปแล้ว
          continue
        }

        // ตรวจสอบ required
        if (question.required === 1) {
          if (!signaturePad || signaturePad.isCanvasEmpty()) {
            signatureErrors.value[key] = true
            hasSignatureErrors = true
            errorMessages.push(`กรุณาลงลายเซ็น ${question.field_name_display || question.field_name}`)
            continue
          }
        }

        // หากมีลายเซ็น ให้อัปโหลด
        if (signaturePad && !signaturePad.isCanvasEmpty()) {
          uploadPromises.push(
            uploadSignature(formKey, question.field_name).then(url => {
              if (url) {
                formValuesMap.value[formKey][question.field_name] = url
              }
            })
          )
        }
      }
    }
  }

  if (hasSignatureErrors) {
    throw new Error(errorMessages.join('\n'))
  }

  await Promise.all(uploadPromises)
}
function getSubmitPayload(surveyDataMap, formValuesMap) {
  const payload = {};

  for (const [groupKey, groupObj] of Object.entries(surveyDataMap)) {
    const formGroupValue = formValuesMap[groupKey] || {};
    const filteredFormValue = {};

    // 1. เอา field ที่ไม่ใช่ลูก template มาก่อน
    for (const [key, value] of Object.entries(formGroupValue)) {
      const isTemplateChild = groupObj._question.some(
        q => q.field_name === key && q.field_name_mock
      );
      if (!isTemplateChild) filteredFormValue[key] = value;
    }

    // 2. ดึงชื่อ template_group_name_name ทั้งหมด (เช่น form1_03, form1_04)
    const allTemplateNames = [
      ...new Set(
        groupObj._question
          .filter(q => q.field_name_mock)
          .map(q => q.template_group_name_name)
      ),
    ];

    for (const templateName of allTemplateNames) {
      // เอาเฉพาะลูกที่เป็นของ template นี้
      const templateChildren = groupObj._question.filter(
        q => q.field_name_mock && q.template_group_name_name === templateName
      );

      // **กรุ๊ปตาม insert_template_id_parent**
      const groupByTemplateParent = {};
      templateChildren.forEach(q => {
        const parentId = q.insert_template_id_parent;
        if (!groupByTemplateParent[parentId]) groupByTemplateParent[parentId] = [];
        groupByTemplateParent[parentId].push(q);
      });

      // map ให้อยู่ในรูปแบบตามต้องการ
      filteredFormValue[templateName] = Object.entries(groupByTemplateParent).map(
        ([parentId, childArr]) => {
          // ในแต่ละ parentId ให้แยกต่อด้วย time_use_this_template
          const groupByTime = {};
          childArr.forEach(q => {
            const t = q.time_use_this_template ?? 0;
            if (!groupByTime[t]) groupByTime[t] = [];
            groupByTime[t].push(q);
          });

          // ในแต่ละกลุ่ม time_use_this_template สร้าง object ใน group_value
          return {
            group_id: Number(parentId), // สำคัญ! ต้องใช้ id template ต้นทาง
            group_value: Object.keys(groupByTime)
              .sort((a, b) => +a - +b)
              .map(timeUse => {
                const qList = groupByTime[timeUse];
                const parentQ = qList[0];
                return {
                  group_id: parentQ.insert_template_id_parent,
                  question_group_id: parentQ.insert_template_id_parent,
                  question_group_name: parentQ.insert_template_name_parent,
                  value: qList.map(q => ({
                    [q.field_name_mock]: formGroupValue[q.field_name] ?? ""
                  }))
                }
              })
          }
        }
      );
    }

    payload[groupKey] = filteredFormValue;
  }

  return payload;
}

// ส่งข้อมูลฟอร์ม
const submitAllForms = async () => {
  try {
    isloadingAxi.value = true

    console.log('Starting form submission...')
    console.log('Current form values:', formValuesMap.value)
    console.log('Survey data map:', props.surveyDataMap)

    // ตรวจสอบฟอร์มทั่วไป
    const { valid } = await formRef.value.validate()
    console.log('Form validation result:', valid)

    if (!valid) {
      throw new Error('มีข้อผิดพลาดในการกรอกฟอร์ม กรุณาตรวจสอบอีกครั้ง')
    }

    // ตรวจสอบและอัปโหลดลายเซ็น
    console.log('Validating signatures...')
    await validateAndUploadSignatures()
    console.log('Signatures validated and uploaded successfully')

    // Loop through each group in surveyDataMap (e.g., "test_test", "test_test_2")
    for (const [groupKey, groupValue] of Object.entries(props.surveyDataMap)) {
      console.log(`Processing group: ${groupKey}`);

      // Check if the group has questions
      if (groupValue._question && groupValue._question.length > 0) {
        // Loop through each question in the current group
        for (const question of groupValue._question) {
          const fieldName = question.field_name;
          const questionType = question.question_type;

          // Check if the question type is 'files' and upload the files
          if (questionType === 'files') {
            console.log(`Uploading files for field: ${fieldName}...`);
            await uploadFiles(groupKey, fieldName); // Upload files for the current field in the group
            // console.log(`Files for field ${fieldName} uploaded successfully`);
          }
        }
      }
    }

    // ส่งข้อมูล
    // const payload = getSubmitPayload(props.surveyDataMap, formValuesMap.value, "form1_03");
    const payload = getSubmitPayload(props.surveyDataMap, formValuesMap.value);
    console.log('Final form values before submit:', payload);
    emit('submit', payload);

    // console.log('Final form values before submit:', formValuesMap.value)
    // emit('submit', formValuesMap.value)

  } catch (error) {
    console.error('Error submitting form:', error)
    alert(error.message)

    // Force scroll to first error
    if (Object.keys(signatureErrors.value).length > 0) {
      const firstErrorKey = Object.keys(signatureErrors.value)[0]
      const errorElement = document.querySelector(`[data-signature-key="${firstErrorKey}"]`)
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  } finally {
    isloadingAxi.value = false
  }
}
const uploadFiles = async (groupKey, fieldName) => {
  // Get the files array based on the dynamic fieldName from formValuesMap
  const files = formValuesMap.value[groupKey]?.[fieldName]?.files || [];


  // If there are files to upload
  if (files.length > 0) {
    // Iterate over all the files and upload them
    const fileUploadPromises = files.map(async (file) => {
      try {
        console.log('Uploading files:', file);
        // Create FormData to upload the file
        const formData = new FormData();
        formData.append('file', file);  // Append the actual file

        // Upload the file using the uploadFileToExternalServer function
        // const uploadedFileUrl = await uploadFileToExternalAPI(formData);
        return uploadedFileUrl;  // Return the external URL for the uploaded file
      } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('File upload failed');
      }
    });

    // Wait for all file uploads to complete and get the URLs
    const uploadedFileUrls = await Promise.all(fileUploadPromises);

    // Update the 'url' array with both the existing URLs and the uploaded file URLs
    formValuesMap.value[groupKey][fieldName].url = [
      ...formValuesMap.value[groupKey][fieldName].url, // Keep existing URLs
      ...uploadedFileUrls // Append the uploaded file URLs
    ];

    // Optionally clear the `files` array (since they are uploaded)
    formValuesMap.value[groupKey][fieldName].files = [];
  }
};


// Function to simulate the file upload (replace with your actual file upload logic)

// Reactive variables สำหรับ dialog
const deleteSignatureDialog = ref(false)
const pendingDeleteFormKey = ref('')
const pendingDeleteFieldName = ref('')

// เปิด dialog ยืนยันการลบ
const openDeleteDialog = (formKey, fieldName) => {
  pendingDeleteFormKey.value = formKey
  pendingDeleteFieldName.value = fieldName
  deleteSignatureDialog.value = true
}

// ยืนยันการลบลายเซ็น
const confirmDeleteSignature = () => {
  const formKey = pendingDeleteFormKey.value
  const fieldName = pendingDeleteFieldName.value

  if (formKey && fieldName) {
    // ลบ URL ลายเซ็น
    formValuesMap.value[formKey][fieldName] = ''

    // ล้าง signature pad ถ้ามี
    const key = `${formKey}_${fieldName}`
    if (signatureRefs.value[key]) {
      signatureRefs.value[key].clearCanvas()
    }

    // ล้าง error ถ้ามี
    if (signatureErrors.value[key]) {
      signatureErrors.value[key] = false
    }
  }

  // ปิด dialog และล้างค่า pending
  deleteSignatureDialog.value = false
  pendingDeleteFormKey.value = ''
  pendingDeleteFieldName.value = ''
}

// ปรับปรุงฟังก์ชัน clearSignature ให้รองรับการลบ URL ด้วย
const clearSignature = (formKey, fieldName) => {
  const key = `${formKey}_${fieldName}`

  // ล้าง signature pad
  if (signatureRefs.value[key]) {
    signatureRefs.value[key].clearCanvas()
  }

  // ล้างค่าใน form (ทั้ง URL และ empty string)
  formValuesMap.value[formKey][fieldName] = ''

  // ล้าง error
  signatureErrors.value[key] = false
}

const getCellStyle = (q) => {
  let indent = q['text_indent'] || 0
  indent = isNaN(indent) ? indent : indent + 'px'
  // ถ้า q['rotate'] เป็นตัวเลข
  const rotateDeg = q['rotate']

  return {
    textIndent: indent,
    fontWeight: q['font_weight'] || 'normal',
    textDecoration: q['text_decoration'] || 'none',
    textAlign: q['text_align'] || 'left',
    display: 'block',
    // transform: `rotate(${rotateDeg}deg)`,
    color: 'black',
    // fontStyle: q['font_style'] || 'normal'
  }
}

const signatureContainerRef = ref(null)
const signaturePadWidth = ref('100%') // ตั้งค่าเริ่มต้น

const updateSignaturePadWidth = () => {
  nextTick(() => {
    if (signatureContainerRef.value) {
      const width = signatureContainerRef.value.offsetWidth
      signaturePadWidth.value = `${width}px`
    }
  })
}

onMounted(() => {
  updateSignaturePadWidth()
  window.addEventListener('resize', updateSignaturePadWidth)
})


const showDialogChooseTemplate = ref(false)
const selectedQuestionId = ref(null)
const selectedQuestionName = ref(null)

const selectedTemplateId = ref(null)
const templateOptions = ref([])

const openTemplateDialog = async (question) => {
  console.log('question', question.id)


  selectedQuestionId.value = await question.id
  console.log('selectedQuestionId', selectedQuestionId.value)

  // alert('selectedQuestionId',selectedQuestionId.value)
  selectedQuestionName.value = question.field_name
  showDialogChooseTemplate.value = true
  fetchTemplates()
}

async function fetchTemplates() {
  try {
    ///api/module/healthcheck/v1/manage/template/get-template
    // const res = await request('GET', '/api/module/healthcheck/v1/manage/template/get-template')
    // const res = await api.getTemplate();
    templateOptions.value = res.data.data
  } catch (error) {
    console.error('ไม่สามารถดึงข้อมูลเทมเพลตได้', error)
  }
}
// import * as apiTemplate from '@/service/api/preview.js'
import { v4 as uuidv4 } from 'uuid';
const onInsertTemplate = ref(false);
const confirmTemplate = async () => {
  try {
    // alert('selectedQuestionId',selectedQuestionId.value)
    console.log('selectedQuestionId confirmTemplate', selectedQuestionId.value)

    const res = await apiTemplate.getSurveyPreviewTemplate(selectedTemplateId.value);

    const templateData = res.data.data?.data_survey;
    const firstTemplateKey = Object.keys(templateData)[0];
    const firstTemplate = templateData[firstTemplateKey];
    const templateQuestions = firstTemplate._question;

    // === ปรับตรงนี้ ===
    // นับ max time_use_this_template เฉพาะกลุ่มที่ parent id ตรงกับ selectedQuestionId.value
    let maxTimeUse = -1;
    for (const groupObj of Object.values(props.surveyDataMap)) {
      for (const q of groupObj._question) {
        // ต้อง parent id ตรงกับ selectedQuestionId.value ด้วย
        if (
          q.insert_template_id_parent === firstTemplate.id &&
          q.template_group_name_id === selectedQuestionId.value && // เพิ่มเช็คตรงนี้
          typeof q.time_use_this_template === 'number'
        ) {
          if (q.time_use_this_template > maxTimeUse) {
            maxTimeUse = q.time_use_this_template;
          }
        }
      }
    }
    const nextTimeUse = maxTimeUse + 1;

    // === ตำแหน่งเดิม ===
    for (const [groupKey, groupObj] of Object.entries(props.surveyDataMap)) {
      const idx = groupObj._question.findIndex(q => q.id === selectedQuestionId.value);
      if (idx !== -1) {
        const clonedQuestions = templateQuestions.map(q => ({
          ...q,
          time_use_this_template: nextTimeUse,
          template_group_name_id: selectedQuestionId.value,

          template_group_name_name: selectedQuestionName.value,
          field_name_mock: q.field_name,
          field_name: `${q.field_name}_${uuidv4()}`,
          insert_template_id_parent: firstTemplate.id,
          insert_template_name_parent: firstTemplate.group_name
        }));

        groupObj._question.splice(idx + 1, 0, ...clonedQuestions);
        break;
      }
    }
  } catch (error) {
    console.error(error);
  }
  showDialogChooseTemplate.value = false;
};


const group_id = computed(() => {
  return selectedTemplateId.value;
})
// import PreviewTemplate from '@/components/preview-template.vue'
const showPreview = ref(false)
const showPreviewTemplate = async (id) => {
  try {
    // console.log('id',id)
    // group_id.value = await selectedTemplateId.value
    showPreview.value = true
    // if (group_id.value) {
    //   showPreview.value =await true;
    //   showDialog.value =await false
    // }
  } catch (error) {
    console.error(error)
  }
}

// upload files section
// Function to handle file selection (upload)
const handleFileSelect = (event, formKey, question) => {
  const selectedFiles = event.target.files;
  // const fileURLs = [];
  // Create a URL for each selected file and add it to the fileURLs array
  // for (let i = 0; i < selectedFiles.length; i++) {
  //   const fileURL = URL.createObjectURL(selectedFiles[i]); // Create a temporary URL for the selected file
  //   fileURLs.push(fileURL); // Push the URL to the array
  // }
  // Append selected file URLs to the existing URLs in formValuesMap[formKey][question.field_name]
  // formValuesMap.value[formKey][question.field_name].files.push(...fileURLs);
  for (let i = 0; i < selectedFiles.length; i++) {
    formValuesMap.value[formKey][question.field_name].files.push(selectedFiles[i]);
  }


};

// Function to remove a file (URL) from the list

const removeFile = (array, index) => {
  // Show a confirmation dialog to the user
  const isConfirmed = confirm("แน่ใจที่จะลบรายการไฟล์ ?");
  // If the user confirms, remove the item
  if (isConfirmed) {
    if (Array.isArray(array) && index >= 0 && index < array.length) {
      array.splice(index, 1); // Removes the item at the specified index
    } else {
      console.error('Invalid array or index out of bounds');
    }
  }
};

// Example function to get accepted file types
const getAcceptedFileTypes = (question) => {
  return ".pdf, .jpg, .jpeg, .png"; // Modify this according to your requirements
};

// Example function to get file hint
const getFileHint = (question) => {
  return "คุณสามารถเลือกไฟล์ PDF หรือรูปภาพ"; // Example hint, modify based on requirements
};

</script>