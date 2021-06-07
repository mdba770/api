FROM node:16
COPY  . api
EXPOSE 5000
RUN cd api && npm install
CMD npm start  -prefix /api/
#ZIBBI
