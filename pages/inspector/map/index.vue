<template>
    <div ref="mapContainer"></div>
  </template>
  
  <script>
  import * as d3 from "d3";
  import thailandGeoJson from "@/assets/json/thailand-geojson.json";
  
  export default {
    mounted() {
      const width = 800, height = 1000;
  
      const svg = d3.select(this.$refs.mapContainer)
        .append("svg")
        .attr("width", width)
        .attr("height", height);
  
      const projection = d3.geoMercator().fitSize([width, height], thailandGeoJson);
      const pathGenerator = d3.geoPath().projection(projection);
  
      // ฟังก์ชันสุ่มสีแบบกำหนดเอง
      const getRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };
  
      svg.selectAll("path")
        .data(thailandGeoJson.features)
        .enter()
        .append("path")
        .attr("d", pathGenerator)
        .attr("fill", getRandomColor) // ใช้ฟังก์ชันสุ่มสี
        .attr("stroke", "#000")
        .on("click", (event, d) => {
          alert(`คุณคลิกที่จังหวัด: ${d.properties.name}`);
        });
    }
  };
  </script>
  
  <style>
  svg {
    display: block;
    margin: auto;
  }
  path {
    cursor: pointer;
  }
  </style>