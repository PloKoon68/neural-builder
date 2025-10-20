# Stage 1: Install dependencies
FROM node:20-alpine AS production
WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy app source
COPY . .

# Expose the port your Express app listens on
EXPOSE 5000

# Start the app
CMD ["node", "src/index.js"]
