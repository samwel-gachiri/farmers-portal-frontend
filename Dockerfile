FROM node:16.18 AS build-stage

WORKDIR /app

COPY package*.json ./
RUN apt-get update && apt-get install -y libnss3-dev libcups2-dev \
    libgconf-2-4 libxss1 libasound2 libatk1.0-0 libatk-bridge2.0-0 \
    libpangocairo-1.0-0 libgtk-3-0

RUN npm install
COPY ./ .
# the list of the env variables that we will have

RUN npm run build

# we can use nginx here

EXPOSE 8080

CMD ["npm", "run", "serve"]