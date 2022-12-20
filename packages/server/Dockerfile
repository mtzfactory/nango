FROM node:18-slim

ENV NANGO_SERVER_ROOT_DIR=/usr/nango-server
ENV SERVER_RUN_MODE=DOCKERIZED
ENV NANGO_DB_MIGRATION_FOLDER=./packages/core/db/migrations

WORKDIR /usr/nango-server/src

COPY packages/core/ packages/core/
COPY packages/server/ packages/server/
COPY package*.json ./
COPY .env ./.env

RUN npm install --omit=dev

ENTRYPOINT [ "node", "packages/server/dist/lib/server.js" ]