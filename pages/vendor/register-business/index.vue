<template>
    <div>
      <widgetFormStart v-if="formStore.activePage == 1" />
      <widgetForm1 v-if="formStore.activePage == 2" />
      <widgetForm2 v-if="formStore.activePage == 3"/>
      <widgetForm3 v-if="formStore.activePage == 4"/>
      <widgetForm4 v-if="formStore.activePage == 5"/>
      <widgetForm5 v-if="formStore.activePage == 6"/>
      <widgetFormFinish v-if="formStore.activePage == 7"/>
      <widgetFormAdditem v-if="formStore.activePage == 8"/>
      
    </div>
  </template>
  
  <script setup>
  import { useFormStore } from '@/store/businessStore.js';
  
  import widgetFormStart from './widgets/start/index.vue';
  import widgetForm1 from './widgets/form1/index.vue';
  import widgetForm2 from './widgets/form2/index.vue';
  import widgetForm3 from './widgets/form3/index.vue';
  import widgetForm4 from './widgets/form4/index.vue';
  import widgetForm5 from './widgets/form5/index.vue';
  import widgetFormFinish from './widgets/finish/index.vue';
  import widgetFormAdditem from './widgets/form5/add-items/index.vue';

  
  const formStore = useFormStore();
  </script>
  