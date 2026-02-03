# Build Stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy root workspace configurations
COPY package*.json ./

# Copy all source code
COPY . .

# Install dependencies and build
RUN npm install
RUN npm run build -w app-staff

# Serve Stage
FROM nginx:alpine
COPY --from=build /app/apps/app-staff/dist /usr/share/nginx/html
RUN echo 'server { \
    listen 80; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files $uri $uri/ /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
