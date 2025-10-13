# Use Node.js 18 LTS Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy backend source code
COPY backend/ .

# Create .env file with environment variables
RUN echo "SUPABASE_URL=${SUPABASE_URL}" > .env
RUN echo "SUPABASE_API_KEY=${SUPABASE_API_KEY}" >> .env
RUN echo "JWT_SECRET=${JWT_SECRET}" >> .env
RUN echo "NODE_ENV=production" >> .env

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]