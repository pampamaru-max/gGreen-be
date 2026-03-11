# ---- Build Stage ----
FROM node:20-slim AS builder

# 🌟 เปลี่ยนจาก apk (Alpine) เป็น apt-get (Debian)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm ci

COPY src ./src/

ENV DATABASE_URL="postgresql://dummy"

RUN npx prisma generate
RUN npm run build


# ---- Production Stage ----
FROM node:20-slim AS production

WORKDIR /app

# 🌟 ลง OpenSSL ฝั่ง Production ด้วย และเคลียร์แคชให้ไฟล์ Docker เล็กๆ
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated

EXPOSE 4000

CMD ["sh", "-c", "npx prisma@latest db push && npm run start:prod"]