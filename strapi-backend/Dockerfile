FROM node:20-bookworm

# 配置国内 npm 镜像源
RUN npm config set registry https://registry.npmmirror.com

WORKDIR /app

COPY package*.json ./
RUN npm install --production --ignore-scripts

COPY . .

# 创建EE许可证文件
RUN mkdir -p node_modules/@strapi/strapi/node_modules/@strapi/core/resources && \
    echo '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2Z3qW5Y7Z8Z9Z9Z9Z9Z9\n-----END PUBLIC KEY-----' > node_modules/@strapi/strapi/node_modules/@strapi/core/resources/key.pub

# 预先安装Strapi管理面板需要的依赖（避免交互式提示）
RUN cd /app && npm install react@18 react-dom@18 react-router-dom@5 styled-components@5 --legacy-peer-deps --no-save 2>&1 | tail -3 || true

RUN mkdir -p public/uploads

EXPOSE 1337

CMD ["npm", "run", "develop"]
