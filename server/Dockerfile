# 1. Use an official Node.js base image
FROM node:20

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy only package.json and package-lock.json first (for better caching)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the application code
COPY . .

# 6. Expose the port your app runs on (adjust if your app uses another port)
EXPOSE 3000

# 7. Command to start the app
CMD ["npm", "run", "dev"]
