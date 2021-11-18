FROM node:14.15.5-alpine3.13
LABEL maintainer="ezTEAM <ezpaarse@couperin.org>"

ARG http_proxy
ARG https_proxy

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production
COPY . .

ENTRYPOINT ["npm", "start"]