<template>
    <div class="p-4">
      <h2>Location Info</h2>
  
      <div v-if="!ready">Loading location...</div>
  
      <div v-else>
        <p><strong>Latitude:</strong> {{ lat }}</p>
        <p><strong>Longitude:</strong> {{ lon }}</p>
        <p><strong>Source:</strong> {{ source }}</p>
        <p v-if="error" class="text-red-500"><strong>Error:</strong> {{ error }}</p>
  
        <button @click="refresh" class="bg-blue-500 text-white px-3 py-1 rounded mt-2">
          Refresh Location
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  const { lat, lon, source, ready, error, refresh } = useGetLatLon()
  
//   watch(ready, (v) => {
//     if (v) {
//       console.log('lat:', lat.value, 'lon:', lon.value, 'source:', source.value)
//     }
//   })
  </script>
  