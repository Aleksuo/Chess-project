FROM node:24.16-slim AS base

RUN apt update && apt install -y less man-db sudo
RUN npm install -g @angular/cli

RUN mkdir app
COPY . /app

WORKDIR /app

RUN npm ci

FROM base AS development

RUN npm run start

FROM  base AS build

RUN npm run build

FROM nginx:1.30.1-alpine AS production

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/chess_frontend/browser /usr/share/nginx/html
EXPOSE  80

CMD [ "nginx", "-g", "daemon off;"]
