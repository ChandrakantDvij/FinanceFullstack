# Backend/Dockerfile
FROM node:22-alpine

# Create app dir
WORKDIR /app/Backend

# copy package files first (caching)
COPY ./Backend/package*.json ./

# Install all deps (including devDependencies for nodemon)
RUN npm ci --only=production

# Copy the rest of the backend source
COPY ./Backend ./

# make wait-for-db.sh and healthcheck.sh executable (they already exist in repo)
RUN chmod +x ./wait-for-db.sh ./healthcheck.sh || true

EXPOSE 5005

# Wait-for-db script is ENTRYPOINT so it blocks until DB is ready
ENTRYPOINT ["./wait-for-db.sh"]
# run seeder then start app (dev)
CMD ["sh", "-c", "node initdb.js && npm start"]
