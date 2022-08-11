FROM node:18-alpine

ENV NANGO_SERVER_RABBIT_HOST=nango-rabbit
ENV NANGO_SERVER_RABBIT_PORT=5672
ENV NANGO_SERVER_ROOT_DIR=/usr/nango-server
ENV NANGO_SERVER_RUN_MODE=DOCKERIZED

WORKDIR /usr/nango-server

COPY blueprints/ blueprints/

WORKDIR /usr/nango-server/src

COPY packages/core/dist/*.js packages/core/dist/
COPY packages/core/package*.json packages/core/

COPY packages/server/dist/oauth/*.js packages/server/dist/oauth/
COPY packages/server/dist/*.js packages/server/dist/
COPY packages/server/package*.json packages/server/

COPY package*.json ./

RUN npm install --omit=dev

CMD ["node", "packages/server/dist/server.js"]