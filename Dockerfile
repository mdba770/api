FROM ubuntu:20.04
RUN apt-get update
RUN  apt -y install gcc g++ make curl
RUN curl -sL https://deb.nodesource.com/setup_14.x |  bash -
RUN  apt -y install nodejs
COPY . api
EXPOSE 3000
RUN cd api && npm install
CMD npm start  -prefix /api/
