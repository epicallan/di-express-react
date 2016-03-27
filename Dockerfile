FROM node:latest

RUN mkdir /src

RUN npm install nodemon -g

WORKDIR /src
ADD . /src
ENV NODE_ENV production
echo 'installing dependencies'
RUN npm install
echo 'running build'
RUN npm build

EXPOSE 8000

CMD npm start
