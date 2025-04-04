FROM node:20.14.0-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8081

CMD [ "npx", "expo", "start", "-c" ]