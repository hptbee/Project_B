# Base Stage - Install dependencies
FROM node:20 AS base
WORKDIR /app
COPY . .
RUN npm install

# Build Stage
FROM base AS build
RUN npm run build -w app-admin

# Serve Stage
FROM nginx:alpine
COPY --from=build /app/apps/app-admin/dist /usr/share/nginx/html
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
