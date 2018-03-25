FROM node:9 AS build

WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install --pure-lockfile

COPY . /app/
RUN yarn run build

FROM nginx

COPY --from=build /app/public /usr/share/nginx/html