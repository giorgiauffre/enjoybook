### STAGE 1: Build ###
FROM node:lts-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

## create dist in the workdirectory! it's normal that you don't see under frontend directory
RUN npm run build

## STAGE 2: Run Server ###
FROM node:lts-alpine

WORKDIR /usr/app

COPY --from=build /app/dist/frontend ./

CMD node server/server.mjs

EXPOSE 4000


