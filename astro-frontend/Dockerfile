FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

# 生产镜像
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

RUN npm install --production

EXPOSE 4321

CMD ["node", "dist/server/entry.mjs"]
