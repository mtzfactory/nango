FROM node:18-alpine

ENV NANGO_SERVER_RABBIT_HOST=nango-rabbit
ENV NANGO_SERVER_RABBIT_PORT=5672
ENV NANGO_SERVER_ROOT_DIR=/usr/nango-worker
ENV NANGO_SERVER_RUN_MODE=DOCKERIZED

WORKDIR /usr/nango-worker/src

COPY packages/core/ packages/core/

COPY packages/worker/ packages/worker/

COPY package*.json ./

RUN npm install --omit=dev

ENTRYPOINT [ "node", "./packages/worker/dist/lib/worker.js" ]