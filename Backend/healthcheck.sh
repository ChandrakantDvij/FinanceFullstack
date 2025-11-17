#!/bin/sh
# Poll backend API until it responds

BACKEND_URL=${BACKEND_URL:-http://127.0.0.1:5000/api/users/}

for i in $(seq 1 12); do
  if curl -f $BACKEND_URL >/dev/null 2>&1; then
    echo "✅ Backend API is healthy!"
    exit 0
  fi
  echo "Backend not ready, retry $i..."
  sleep 5
done

echo "❌ Backend API failed to become healthy"
exit 1

