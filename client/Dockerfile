FROM node:18-bullseye AS build
WORKDIR /app
COPY . /app/
RUN npm install
# Cuando actualicen las dependencias, prueben sin la siguiente linea
ENV NODE_OPTIONS="--openssl-legacy-provider"
RUN npm run build

FROM registry-1.docker.io/library/nginx:1.27-alpine
COPY --from=build /app/build/ /usr/share/nginx/html/
