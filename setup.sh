#!/usr/bin/env bash
# Industry-standard local setup for the Events Platform API.
# Usage: bash setup.sh

set -euo pipefail

echo "==> Node version"
node -v
npm -v

if [ ! -f package.json ]; then
  echo "Run this script from the events-api directory."
  exit 1
fi

echo "==> Installing dependencies"
npm install

if [ ! -f .env ]; then
  echo "==> Creating .env from .env.example"
  cp .env.example .env
  echo "Edit .env and set MONGODB_URI before starting the server."
fi

echo "==> Done."
echo
echo "Next:"
echo "  1. Put your MongoDB Atlas URI in .env"
echo "  2. npm run dev"
echo "  3. optional: npm run seed"
echo "  4. curl http://localhost:3000/health"
