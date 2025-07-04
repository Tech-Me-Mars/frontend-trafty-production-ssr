# ใช้ Node.js base image
FROM node:18-alpine

# ตั้งค่า working directory
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกโค้ดทั้งหมดในโฟลเดอร์ปัจจุบันไปที่ container
COPY . .

# สร้าง production build
RUN npm run build

# เปิดพอร์ต 3000
EXPOSE 3000

# รัน Nuxt ใน production mode
CMD ["npm", "run", "preview"]
