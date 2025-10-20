# Stage 1: Build the React app
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies cleanly and reproducibly
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build the app
COPY . .
RUN npm run build

# Stage 2: Serve the app with NGINX
FROM nginx:alpine AS production

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Optional: override default nginx config (if needed)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose default web port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
