<template>
    <div class="mx-auto card">
      <!-- Header -->
      <div class="mb-4">
        <h3 class="text-lg font-semibold">สถิติพื้นที่ตรวจสอบ</h3>
      </div>
  
      <!-- Doughnut Chart -->
      <div class="flex justify-center mb-4">
        <Chart
          type="doughnut"
          :data="chartData"
          :options="chartOptions"
          style="width: 150px; height: 150px"
        />
      </div>
  
      <!-- Total Count -->
      <div class="text-center mb-4">
        <p class="text-gray-500 text-sm">จำนวน (แห่ง)</p>
        <p class="text-4xl font-bold">7000</p>
      </div>
  
      <!-- Legend -->
      <div class="flex justify-around items-center">
        <div class="flex items-center space-x-2">
          <span class="w-4 h-4 rounded-full" style="background-color: #2c1c74"></span>
          <p class="text-sm">พื้นที่ตรวจสอบแล้ว</p>
        </div>
        <div class="flex items-center space-x-2">
          <span class="w-4 h-4 rounded-full" style="background-color: #e5e7eb"></span>
          <p class="text-sm">พื้นที่ที่รอตรวจสอบ</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import Chart from 'primevue/chart';
  
  const chartData = ref({
    labels: ['พื้นที่ตรวจสอบแล้ว', 'พื้นที่ที่รอตรวจสอบ'],
    datasets: [
      {
        data: [4500, 2500],
        backgroundColor: ['#2c1c74', '#e5e7eb'],
      },
    ],
  });
  
  const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        labels: {
              font: {
                family: 'Noto Sans Thai', // กำหนดฟอนต์ที่ต้องการ
                size: 14, // ขนาดของฟอนต์
              },
            },
        display: false, // ซ่อน legend ใน chart
      },
    },
  });
  </script>
  
  <style scoped>
  .text-center p {
    font-family: 'Noto Sans Thai', sans-serif;
  }
  </style>
  