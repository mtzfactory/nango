FROM node:18-alpine

ENV PORT=3003
ENV NANGO_SERVER_RABBIT_HOST=nango-rabbit
ENV NANGO_SERVER_RABBIT_PORT=5672
ENV NANGO_SERVER_ROOT_DIR=/usr/nango-server
ENV NANGO_SERVER_RUN_MODE=DOCKERIZED
ENV NANGO_DB_MIGRATION_FOLDER=./packages/core/db/migrations

WORKDIR /usr/nango-server/src

COPY packages/core/ packages/core/
COPY packages/server/ packages/server/
COPY package*.json ./

RUN npm install --omit=dev

ENTRYPOINT [ "node", "packages/server/dist/lib/server.js" ]