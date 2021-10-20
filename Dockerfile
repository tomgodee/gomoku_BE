FROM node:14.17-alpine

WORKDIR /usr/src/gomoku

# COPY package*.json ./

# RUN npm install

# COPY . .

EXPOSE 5000

CMD [ "npm", "run", "watch" ]