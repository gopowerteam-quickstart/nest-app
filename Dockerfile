FROM alpine:3.17 as base
# -设置环境变量
ENV NODE_VERSION=18.15.0
ENV PNPM_VERSION=8.5.1
ENV APP_PATH=/app
ENV NODE_ENV=testing

# -设置工作目录
WORKDIR $APP_PATH
# 安装基础包
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories \
    && apk add --no-cache nodejs python3 curl gcc g++ make linux-headers \
    && curl -sL https://unpkg.com/@pnpm/self-installer | node \
    && node --version \
    && pnpm --version


# STEP2: 构建依赖镜像
FROM base as installer
# - 复制依赖相关目录
COPY package.json .npmrc pnpm-lock.yaml ./
# - 安装依赖
RUN pnpm install


# STEP3: 构建运行镜像
FROM base as running
# - 复制依赖文件
COPY --from=installer $APP_PATH/node_modules ./node_modules
# - 复制代码文件
COPY . .
# - 运行编译
RUN npm run build
# - 启动项目
CMD npm run start
