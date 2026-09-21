FROM node:20-alpine

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm install --production

# 复制项目文件
COPY . .

# 构建Strapi
RUN npm run build

# 暴露端口
EXPOSE 1337

# 启动命令
CMD ["npm", "start"]
