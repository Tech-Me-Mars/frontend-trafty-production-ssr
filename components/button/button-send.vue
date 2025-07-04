<style>
.btn-hover {
    transition: all 0.3s ease-in-out;
    /* เพิ่มการเคลื่อนไหว */
}

.btn-hover:hover {
    background-color: #3a4b87;
    /* สีเมื่อ hover */
    transform: scale(1.05);
    /* ขยายเล็กน้อยเมื่อ hover */
}
</style>
<template>
    <button class="btn-hover w-full px-6 py-3 bg-[#202c54] !text-white rounded-3xl">
        ส่ง
    </button>
</template>