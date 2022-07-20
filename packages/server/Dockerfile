FROM node:18

ENV NANGO_SERVER_RABBIT_HOST=nango-rabbit
ENV NANGO_SERVER_RABBIT_PORT=5672
ENV NANGO_SERVER_ROOT_DIR=/usr/nango-server
ENV NANGO_INTEGRATIONS_PACKAGE_DIR=/var/nango-integrations-compiled
ENV NANGO_INTEGRATIONS_INSTALL_MODE=LOCAL_COPY

WORKDIR /usr/nango-server/src

COPY packages/core/dist/*.js packages/core/dist/
COPY packages/core/package*.json packages/core/

COPY packages/utils/dist/*.js packages/utils/dist/
COPY packages/utils/package*.json packages/utils/

COPY packages/server/dist/*.js packages/server/dist/
COPY packages/server/package*.json packages/server/

COPY package*.json ./

RUN npm install --only=production

CMD ["node", "packages/server/dist/server.js"]