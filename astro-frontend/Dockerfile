FROM node:18-bookworm AS builder

# 配置国内 npm 镜像源
RUN npm config set registry https://registry.npmmirror.com

RUN apt-get update && apt-get install -y \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-bookworm

# 配置国内 npm 镜像源
RUN npm config set registry https://registry.npmmirror.com

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

RUN npm install --omit=dev

EXPOSE 4321

CMD ["node", "dist/server/entry.mjs"]
