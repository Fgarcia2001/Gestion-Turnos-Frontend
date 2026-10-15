# ---- Etapa 1: build ----
FROM node:20-alpine AS build
WORKDIR /app

COPY P4-TPI/package*.json ./
RUN npm ci

COPY P4-TPI/ .
RUN npm run build

# ---- Etapa 2: serve ----
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
