#!/bin/sh

DB_HOST=${DB_HOST:-finance-mysql}
DB_PORT=${DB_PORT:-3306}

echo "⏳ Waiting for MySQL to be ready at $DB_HOST:$DB_PORT..."

# Loop until MySQL is up and ready to accept connections
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

# Optional: You can check if MySQL is accepting connections using `mysqladmin` (improves certainty).
# Uncomment the next line if you want to check for MySQL's own health check.
# while ! mysqladmin ping -h $DB_HOST --silent; do
#   sleep 1
# done

echo "✅ MySQL is ready! Starting backend..."

# Start the backend application (can replace with your server entry point if needed)
node server.js

