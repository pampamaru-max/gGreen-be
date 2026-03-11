# ---- Build Stage ----
FROM node:20-slim AS builder

# 1. เพิ่ม ca-certificates เข้าไปเผื่อ Prisma โหลด Engine ไม่ผ่าน
RUN apt-get update -y && apt-get install -y openssl ca-certificates

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# 2. ก๊อปปี้ทุกอย่างมาเลย กันพลาดเรื่องไฟล์ขาดหาย
COPY . .

# 3. สร้างโฟลเดอร์รอไว้ให้ Prisma เลย! (แก้ปัญหา Custom Output หาบ้านไม่เจอ)
RUN mkdir -p /app/src/generated/prisma

# 4. อัปเกรด URL หลอกให้เป็นฟอร์แมตที่ถูกต้อง 100% (บางที dummy เฉยๆ มันไม่ยอมรับ)
ENV DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public"

# รัน Generate และ Build
RUN npx prisma generate
RUN npm run build


# ---- Production Stage ----
FROM node:20-slim AS production

WORKDIR /app

# ลง OpenSSL ฝั่ง Production 
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --omit=dev

# ดึงไฟล์ที่ Build เสร็จแล้วมาใช้งาน
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated

EXPOSE 4000

# 🌟 อย่าลืมเว้นวรรคตรง CMD ["sh", ... นะครับ 
CMD ["sh", "-c", "npx prisma@6 db push && npm run start:prod"]