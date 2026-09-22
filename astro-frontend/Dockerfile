FROM node:20-bookworm AS builder

RUN npm config set registry https://registry.npmmirror.com

RUN apt-get update && apt-get install -y \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-bookworm

RUN npm config set registry https://registry.npmmirror.com

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

RUN npm install -g serve

EXPOSE 4321

CMD ["serve", "-l", "4321", "dist"]
