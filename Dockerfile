#bashCopy code
# Use the official Node.js image as the base image
FROM node:23

# Set the working directory in the container
WORKDIR /app

# Copy the application files into the working directory
COPY . /app

# Install the application dependencies
RUN npm install

# Define the entry point for the container
CMD ["npm", "start"]

#Expose port 3000 for web server
EXPOSE 3000