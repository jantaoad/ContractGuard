# Multi-stage Dockerfile for React frontend
# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --silent
COPY . ./
RUN npm run build

# Stage 2: Server (nginx)
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Configure nginx to listen on port 8080 (App Runner requirement)
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf

# Configure nginx to serve React SPA properly
RUN echo 'error_page 404 /index.html;' >> /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
