<template>
   <div>
    <Toast />
   </div>
  </template>
  <!-- script -->
  <script setup>
  import Toast from 'primevue/toast';
  import { useToast } from "primevue/usetoast";
  const toast = useToast();
  const props = defineProps({
      data: {
          type: Object,
          required: true,
          default: () => ({
              color: "primary",
              title: "",
              msg: "",
              isError: false,
              dataError:null
          }),
      },
  });
  
  onUpdated(() => showMessage());
  
  const showMessage = () => {
      if (props.data.isError == false) {
          toast.add({ severity: props.data.color, summary: props.data.title, detail: props.data.msg, life: 3000});
      } else {
          try {
              toast.add({ severity: 'error', summary: props.data.title, detail: props.data.msg, life: 3000 });
          } catch (error) {
              console.error(error)
          }
      }
  
  };
  </script>