FROM node:latest

RUN mkdir /src

WORKDIR /src
ADD . /src
ENV NODE_ENV production
RUN npm install
<<<<<<< HEAD
RUN npm build
=======
RUN npm run build
>>>>>>> progress bar

EXPOSE 8000

CMD npm start
