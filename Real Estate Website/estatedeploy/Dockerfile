#FROM node:23-alpine3.19
#
#WORKDIR /estatedeploy
#
#COPY /src /estatedeploy
#
#COPY package.json /estatedeploy
#
#COPY package-lock.json /estatedeploy
#
#RUN npm install --legacy-peer-deps
#
#CMD ["node", "/estatedeploy/server.js"]


FROM node:23-alpine3.19

# Copy package files first (for better layer caching)
COPY package.json package-lock.json ./

# Install project dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the project (including /src and /public)
COPY . .

# Build the React app
RUN npm run build

# Install 'serve' globally
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start the app using 'serve
CMD ["serve", "-s", "build", "-l", "3000"]
