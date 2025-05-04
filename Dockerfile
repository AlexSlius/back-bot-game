FROM node:22-alpine

RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --immutable --immutable-cache

RUN npx prisma generate

COPY . .

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start:prod"]
