#!/bin/bash
# Start ngrok tunnel with custom domain from .env

# Load .env from repo root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"

if [ -f "$ENV_FILE" ]; then
  export $(grep -v '^#' "$ENV_FILE" | grep NGROK_DOMAIN | xargs)
fi

if [ -z "$NGROK_DOMAIN" ]; then
  echo "Error: NGROK_DOMAIN not set in .env"
  echo "Add: NGROK_DOMAIN=your-domain.ngrok-free.app"
  exit 1
fi

echo "Starting ngrok tunnel to http://localhost:3001"
echo "Domain: $NGROK_DOMAIN"
echo ""

ngrok http 3001 --url "$NGROK_DOMAIN"
