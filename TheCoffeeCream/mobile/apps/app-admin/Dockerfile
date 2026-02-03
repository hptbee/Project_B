# Build Stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy root workspace configurations
COPY package*.json ./

# Copy all source code (needed for workspace dependencies like ui-shared)
COPY . .

# Install dependencies and build
RUN npm install
RUN npm run build -w app-admin

# Serve Stage
FROM nginx:alpine
COPY --from=build /app/apps/app-admin/dist /usr/share/nginx/html
# Copy custom nginx config if needed (optional for now, default works for SPA if we add try_files)
# For React Router to work on refresh, we usually need a custom nginx conf.
# Let's add a simple one inline or assum default for now, but usually need try_files.
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
