# Frontend/Dockerfile
FROM node:22-alpine as builder

WORKDIR /app/Frontend

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# copy only package files for cache
COPY ./Frontend/package*.json ./

# install deps and build
RUN npm ci
COPY ./Frontend ./
RUN npm run build

# Production image (serve static site)
FROM node:22-alpine

WORKDIR /app/Frontend

# install `serve` runtime
RUN npm install -g serve

# copy built files from builder
COPY --from=builder /app/Frontend/dist ./dist

EXPOSE 3005

CMD ["serve", "-s", "dist", "-l", "3000"]
