### STAGE 1: Build ###

#Use the offical Node.js base image 
FROM node:lts-alpine AS build

#Set the working directory
WORKDIR /app

#Copy package.json in the working directory and install dependencies
COPY package*.json ./
RUN npm ci

#Copy the rest of the application files
COPY . .

#Create dist in the workdirectory
RUN npm run build


## STAGE 2: Run Server ###
FROM node:lts-alpine

WORKDIR /usr/app

#Copy the dist produced in the previous stage in the working directory
COPY --from=build /app/dist/frontend ./

#Run the application 
CMD node server/server.mjs

# Exposing port 4000
EXPOSE 4000


