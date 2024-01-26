# Use the specific Node.js version
FROM node:21-alpine

# Expose the port your app runs in
EXPOSE 3000

# Define the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Define the command to run your app
CMD ["node", "index.js"]
