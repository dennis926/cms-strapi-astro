FROM node:18-bookworm

# 配置国内 npm 镜像源
RUN npm config set registry https://registry.npmmirror.com

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN mkdir -p public/uploads

EXPOSE 1337

CMD ["npm", "run", "develop"]
