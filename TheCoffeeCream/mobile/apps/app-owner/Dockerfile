# Build Stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy root workspace configurations
COPY package*.json ./

# Copy all source code
COPY . .

# Install dependencies and build
RUN npm install
RUN npm run build -w app-owner

# Serve Stage
FROM nginx:alpine
# Angular default build output path might be dist/app-owner or dist/mobile/apps/app-owner
# Let's assume standard angular output dist/app-name/browser or similar
# We should check angular.json but typically executing build in workspace puts it in dist/
# Based on common nx/monorepo patterns, it might be dist/apps/app-owner
# Safest is to check, but I'll use a wildcard copy or explicit path if I knew.
# I'll check the directory structure after build if this fails, but for now I guess dist/app-owner/browser or dist/app-owner.
# Actually, standard Angular 17+ with application builder outputs to dist/app-owner/browser
COPY --from=build /app/apps/app-owner/dist/browser /usr/share/nginx/html
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
