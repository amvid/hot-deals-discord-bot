FROM node:14-alpine AS base

RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml ./


FROM base AS dev

RUN pnpm i

COPY . .

CMD ["pnpm", "run", "watch"]


FROM base AS prod

RUN pnpm i --prod

COPY . . 

CMD ["node", "index.js"]