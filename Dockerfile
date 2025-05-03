FROM node:22-alpine AS builder
WORKDIR /backend
COPY . .
RUN yarn install
RUN yarn build

FROM node:22-alpine
WORKDIR /backend

COPY --from=builder /backend/dist ./dist
COPY --from=builder /backend/node_modules ./node_modules
COPY --from=builder /backend/package.json ./package.json

CMD ["yarn", "start"]
