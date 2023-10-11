# Use an official Node.js runtime as a parent image
FROM node:20.3.0-alpine as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the NestJS application for production
RUN npm run build

# Use a smaller base image for the production image
FROM node:20.3.0-alpine

# Set the working directory in the final production image
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .

# Expose the port your NestJS application is running on
EXPOSE 3000

# Start the NestJS application in production mode
CMD ["node", "dist/main"]
