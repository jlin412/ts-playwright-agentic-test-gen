FROM node:20-alpine AS build
WORKDIR /app

COPY frontend/package.json ./
RUN npm install

COPY assets ./assets
COPY frontend/public ./public
COPY frontend/src ./src

ARG REACT_APP_API_ROOT=http://localhost:3000/api
ENV REACT_APP_API_ROOT=$REACT_APP_API_ROOT

RUN cp assets/main.css public/main.css \
 && sed -i 's|//demo.productionready.io/main.css|%PUBLIC_URL%/main.css|' public/index.html \
 && sed -i "s|https://conduit.productionready.io/api|${REACT_APP_API_ROOT}|" src/agent.js

RUN npm run build

FROM nginx:alpine
COPY docker/frontend.nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
