<template>
    <div class="max-w-7xl mx-auto card">
      <h2 class="text-lg font-bold mb-4">สถิติพื้นที่ลงทะเบียน</h2>
      <Chart type="bar" :data="chartData" :options="chartOptions"  />
    </div>
  </template>
  
  <script setup>
  
  const chartData = {
    labels: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย."],
    datasets: [
      {
        label: "แหล่งท่องเที่ยว",
        backgroundColor: "#1E3A8A", // สีน้ำเงินเข้ม
        data: [200, 450, 300, 400, 450, 500],
      },
      {
        label: "ธุรกิจในแหล่งท่องเที่ยว",
        backgroundColor: "#F97316", // สีส้ม
        data: [100, 400, 250, 350, 400, 450],
      },
    ],
  };
  
  const chartOptions = {
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
                family: 'Noto Sans Thai', // กำหนดฟอนต์ที่ต้องการ
                size: 14, // ขนาดของฟอนต์
              },
          color: "#333", // สีของข้อความใน legend
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#666", // สีของตัวอักษรแกน X
        },
        grid: {
          display: false, // ซ่อนเส้นตารางแกน X
        },
      },
      y: {
        ticks: {
          color: "#666", // สีของตัวอักษรแกน Y
        },
        grid: {
          color: "#E5E7EB", // สีเส้นตารางแกน Y
        },
      },
    },
  };
  </script>
  
  <style scoped>
  .text-center p {
    font-family: 'Noto Sans Thai', sans-serif;
  }
  </style>
  