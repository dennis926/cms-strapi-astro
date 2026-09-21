FROM node:20-alpine

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm install

# 复制项目文件
COPY . .

# 构建Astro
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
