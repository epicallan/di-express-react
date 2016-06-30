FROM node:latest

RUN mkdir /src

WORKDIR /src
COPY . /src

# Provides cached layer for node_modules
COPY package.json /tmp/
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /src/

ENV NODE_ENV production

EXPOSE 9090 3030

CMD ["npm start"]
