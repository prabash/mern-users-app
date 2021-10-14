FROM node:14-slim

WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY ./package.json ./

RUN npm install --no-optional && npm cache clean --force

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]