#
# Builder
#
FROM node:22-alpine AS builder

ENV HOME=/root
ENV APP=${HOME}/client

WORKDIR ${APP}

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

#
# Deployer
#
FROM node:22-alpine AS deployer

ENV HOME=/root
ENV APP=${HOME}/client

WORKDIR ${APP}

COPY --from=builder ${APP}/.next .next
COPY --from=builder ${APP}/node_modules ./node_modules
COPY --from=builder ${APP}/package.json ./package.json
# public 폴더가 있을 때만 복사
RUN if [ -d ${APP}/public ]; then cp -r ${APP}/public ./public; fi

CMD ["npm", "start"]