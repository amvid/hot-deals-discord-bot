FROM oven/bun AS base

COPY package.json bun.lockb ./


FROM base AS dev

RUN bun install

COPY . .

CMD ["bun", "--hot", "run", "index.js"]


FROM base AS prod

RUN bun install --production

COPY . . 

CMD ["bun", "index.js"]