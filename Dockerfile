FROM node:18
ENV TZ=America/Lima
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
RUN npm run build

CMD [ "npm", "run", "start:prod" ]
