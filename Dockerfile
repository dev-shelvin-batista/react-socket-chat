# Use a Node.js base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN npm install

# Expose the port React serves on (default is 3000)
EXPOSE 3000

# Command to run when the container starts
CMD ["npm", "run", "start"]