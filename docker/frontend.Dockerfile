FROM node:20-alpine AS build
WORKDIR /app

COPY frontend/package.json ./
RUN npm install

COPY frontend/public ./public
COPY frontend/src ./src

ARG REACT_APP_API_ROOT=http://localhost:3000/api
ENV REACT_APP_API_ROOT=$REACT_APP_API_ROOT

RUN npm run build

FROM nginx:alpine
COPY docker/frontend.nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
