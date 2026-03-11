# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# 🌟 1. สิ่งที่ต้องเพิ่ม: ติดตั้ง OpenSSL เพราะ Prisma ต้องใช้มันใน Alpine Linux
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm ci

COPY src ./src/

# 🌟 2. สิ่งที่ต้องเพิ่ม: ใส่ DATABASE_URL ปลอมๆ หลอก Prisma ไม่ให้มัน Error ตอน Generate
ENV DATABASE_URL="postgresql://dummy"

RUN npx prisma generate
RUN npm run build


# ---- Production Stage ----
FROM node:20-alpine AS production

WORKDIR /app

# 🌟 3. สิ่งที่ต้องเพิ่ม: ฝั่ง Production ก็ต้องติดตั้ง OpenSSL ด้วย ไม่งั้นตอนรันคำสั่ง db push จะพัง
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

# ลงเฉพาะ Dependencies ของ Production
RUN npm ci --omit=dev

# ดึงไฟล์โค้ดที่ Build สำเร็จแล้วมาจากฝั่ง Builder
COPY --from=builder /app/dist ./dist

# ก๊อปปี้โฟลเดอร์ generated มาด้วย เพราะใน schema.prisma ตั้งค่า output แยกไว้
COPY --from=builder /app/src/generated ./src/generated

EXPOSE 4000

# รันคำสั่งอัปเดตตาราง และรันแอปพลิเคชัน
CMD ["sh", "-c", "npx prisma@latest db push && npm run start:prod"]