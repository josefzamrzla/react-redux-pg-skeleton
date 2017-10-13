FROM node:boron

#ENV http_proxy ${http_proxy}
#ENV https_proxy ${http_proxy}
#ENV no_proxy ${no_proxy}

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .

RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "run", "docker" ]
