FROM node:22-alpine AS build

RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM nginx:alpine

EXPOSE 3004

CMD ["yarn", "start", "start:prod"]
