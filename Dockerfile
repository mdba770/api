FROM alpine:3.7
RUN echo -e "http://nl.alpinelinux.org/alpine/v3.7/main\nhttp://nl.alpinelinux.org/alpine/v3.7/community" > /etc/apk/repositories
RUN apk update
RUN apk upgrade
RUN apk add curl
RUN apk add  build-base
RUN apk add --update nodejs nodejs-npm
COPY  . api
EXPOSE 5000
RUN cd api && npm install
CMD npm start  -prefix /api/
