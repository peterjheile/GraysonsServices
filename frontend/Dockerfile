FROM node:22-alpine AS base

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app


FROM base AS dependencies

COPY package.json package-lock.json ./
RUN npm ci


FROM base AS builder

ARG DJANGO_API_URL=http://backend:8000
ARG NEXT_PUBLIC_DJANGO_API_URL
ARG NEXT_PUBLIC_SITE_URL

ENV DJANGO_API_URL=$DJANGO_API_URL \
    NEXT_PUBLIC_DJANGO_API_URL=$NEXT_PUBLIC_DJANGO_API_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NODE_ENV=production

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN test -n "$NEXT_PUBLIC_DJANGO_API_URL" \
    && test -n "$NEXT_PUBLIC_SITE_URL" \
    && npm run build


FROM base AS runner

ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000

RUN addgroup --system --gid 10001 nodejs \
    && adduser --system --uid 10001 --ingroup nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN mkdir -p /app/.next/cache \
    && chown -R nextjs:nodejs /app/.next

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]