FROM node:18-slim

ENV NANGO_SERVER_ROOT_DIR=/usr/nango-worker
ENV NANGO_SERVER_RUN_MODE=DOCKERIZED

WORKDIR /usr/nango-worker/src

COPY packages/core/ packages/core/
COPY packages/worker/ packages/worker/
COPY package*.json ./

RUN npm install --omit=dev

EXPOSE 3004

ENTRYPOINT [ "node", "./packages/worker/dist/lib/worker.js" ]