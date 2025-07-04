<template>
  <Form :validation-schema="yupSchema" @submit="onSubmit">
    <div
      v-for="{ as, name, label, ...attrs } in schema.fields"
      :key="name"
      class="form-group"
    >
      <label :for="name">{{ label }}</label>
      <Field :as="as" :id="name" :name="name" v-bind="attrs" />
      <ErrorMessage class="text-red-500" :name="name" />
    </div>
    <button class="p-5 border-2" type="submit">Submit</button>
  </Form>
</template>

<script setup>
import { ref, computed } from "vue";
import { useForm, Field, Form, ErrorMessage } from "vee-validate";
import * as Yup from "yup";

// Props รับ schema ที่มาจาก parent component
const props = defineProps({
  schema: {
    type: Object,
    required: true,
  },
});

// สร้าง Yup schema จาก `props.schema`
const yupSchema = computed(() => {
  const shape = props.schema.fields.reduce((acc, field) => {
    acc[field.name] = field.rules; // ใช้ rules ในฟิลด์สร้าง Yup schema
    return acc;
  }, {});
  return Yup.object().shape(shape);
});

// สร้างค่าเริ่มต้นของฟอร์ม
const initialValues = ref(
  props.schema.fields.reduce((acc, field) => {
    acc[field.name] = ""; // ค่าเริ่มต้นของทุกฟิลด์เป็น ""
    return acc;
  }, {})
);

// ตั้งค่าฟอร์ม
const { handleSubmit } = useForm({
  initialValues: initialValues.value,
  validationSchema: yupSchema.value,
});

// ฟังก์ชันเมื่อ Submit
const onSubmit = handleSubmit((values) => {
  console.log("Form submitted with values:", values);
});
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

.text-red-500 {
  font-size: 0.875rem;
  color: red;
}
</style>
