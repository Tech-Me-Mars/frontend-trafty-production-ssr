<template>
        <Breadcrumb :home="home" :model="items" />
        
</template>

<script setup>
import Breadcrumb from 'primevue/breadcrumb';

// รับ props ของ breadcrumb
const props = defineProps({
    items: {
        type: Array,
        required: true,
        default: () => [{
            label: "home",
        }],
    },
});
const home = ref({
    icon: 'pi pi-home'
});
</script>