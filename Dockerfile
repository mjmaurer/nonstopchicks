FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci --legacy-peer-deps

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev --legacy-peer-deps

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build


FROM node:20-alpine
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app

# Configure cache directory for runtime volume
ENV YOUTUBE_CACHE_DIR=/data
VOLUME ["/data"]

# Ensure proper permissions
RUN mkdir -p /data && chown -R node:node /data /app

# Switch to non-root user
USER node

# Expose port
EXPOSE 3000

CMD ["npm", "run", "start"]
