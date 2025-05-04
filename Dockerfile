FROM node:22-alpine

RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3004

CMD ["yarn", "start:prod"]
