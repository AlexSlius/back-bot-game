FROM node:22-alpine

RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /backend

COPY package.json yarn.lock ./
RUN yarn install --immutable --immutable-cache

COPY prisma/schema ./prisma/schema

RUN npx prisma generate

COPY . .

RUN yarn build

EXPOSE 3004
CMD ["yarn", "start:prod"]
