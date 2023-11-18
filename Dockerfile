FROM --platform=linux/amd64 node:18

# Create app directory
WORKDIR /usr/app

# Install app dependencies
COPY package*.json ./
RUN npm install

COPY src/ ./src

CMD [ "npm", "start" ]
