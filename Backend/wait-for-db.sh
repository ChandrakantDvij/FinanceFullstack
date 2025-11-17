#!/bin/sh

DB_HOST=${DB_HOST:-finance-mysql}
DB_PORT=${DB_PORT:-3306}
DB_NAME=${DB_NAME:-finance_db}
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD:-root}
SEED_SCRIPT_PATH=${SEED_SCRIPT_PATH:-/docker-entrypoint-initdb.d/finance.sql}

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

echo "✅ MySQL is ready!"

# Check if the database exists and if it's already seeded
echo "⏳ Checking if the database is already seeded..."

# Connect to MySQL and check if the database exists
DB_EXIST=$(mysql -h $DB_HOST -u root -p$MYSQL_ROOT_PASSWORD -e "SHOW DATABASES LIKE '$DB_NAME';" | grep "$DB_NAME" > /dev/null; echo "$?")

if [ "$DB_EXIST" -eq 0 ]; then
  echo "✅ Database '$DB_NAME' exists. Checking if seeding is required."

  # Check if a specific table exists (e.g., users) to determine if seeding is needed
  TABLE_EXIST=$(mysql -h $DB_HOST -u root -p$MYSQL_ROOT_PASSWORD -D $DB_NAME -e "SHOW TABLES LIKE 'users';" | grep "users" > /dev/null; echo "$?")
  
  if [ "$TABLE_EXIST" -ne 0 ]; then
    echo "❌ Table 'users' does not exist. Seeding the database..."

    # Run the SQL script to seed the database
    mysql -h $DB_HOST -u root -p$MYSQL_ROOT_PASSWORD $DB_NAME < $SEED_SCRIPT_PATH

    echo "✅ Database seeded successfully!"
  else
    echo "✅ Table 'users' exists. No seeding required."
  fi
else
  echo "❌ Database '$DB_NAME' does not exist. Seeding the database..."

  # Run the SQL script to seed the database
  mysql -h $DB_HOST -u root -p$MYSQL_ROOT_PASSWORD $DB_NAME < $SEED_SCRIPT_PATH

  echo "✅ Database seeded successfully!"
fi

# Start the backend application
echo "Starting backend application..."
node server.js
