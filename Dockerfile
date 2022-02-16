FROM node:14-alpine3.10 as builder

ENV NODE_ENV=prd
WORKDIR /usr/src/app
RUN apk add --update --no-cache make g++ python2
COPY public ./public
COPY package.json yarn.lock tsconfig.json esbuild.js .env ./
RUN yarn install --ignore-scripts
COPY src ./src
RUN yarn dist


FROM nginx:1.19-alpine

LABEL org.opencontainers.image.source https://github.com/husky-dev/kremen-api

COPY ./configs/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
