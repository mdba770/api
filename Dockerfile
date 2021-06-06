FROM alpine:3.7
RUN apk update
RUN apk upgrade
RUN apk add curl
RUN apk add  build-base
RUN apk add --update nodejs nodejs-npm
COPY  . api
EXPOSE 3000
RUN cd api && npm install
CMD npm start  -prefix /api/
