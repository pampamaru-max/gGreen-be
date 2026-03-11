# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm ci

COPY src ./src/

RUN npx prisma generate
RUN npm run build


# ---- Production Stage ----
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# 1. ลงเฉพาะ Dependencies ของ Production
RUN npm ci --omit=dev


# 3. ดึงไฟล์โค้ดที่ Build สำเร็จแล้วมาจากฝั่ง Builder
COPY --from=builder /app/dist ./dist

# 💡 หมายเหตุ: ผมขอคอมเมนต์บรรทัด src/generated ไว้นะครับ 
# เพราะถ้าใน schema.prisma คุณไม่ได้ตั้งค่า output พิเศษ บรรทัดนี้จะทำให้ Docker Error ว่าหาโฟลเดอร์ไม่เจอครับ (ปกติ Prisma จะไปอยู่แค่ใน node_modules)
COPY --from=builder /app/src/generated ./src/generated

EXPOSE 4000

# ใช้ && เพื่อสั่งรัน 2 คำสั่งต่อกัน 
# npx prisma db push จะทำการสร้าง/อัปเดตตารางให้ตรงกับ schema.prisma
CMD["sh", "-c", "npx prisma@latest db push && npm run start:prod"]