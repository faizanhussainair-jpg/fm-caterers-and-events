#!/usr/bin/env bash
# Build the site into ./dist and deploy it to Netlify production.
# Used by the pre-push git hook and for manual deploys.
set -euo pipefail
cd "$(dirname "$0")"

export PATH="$HOME/.local/opt/node/bin:$PATH"

echo "→ Building dist..."
python3 deploy.py

echo "→ Deploying to Netlify (production)..."
netlify deploy --prod --dir dist --site 6127cbdf-fd2c-4042-90ed-63ae4586dc3d

echo "✓ Production deploy complete: https://fmeventslucknow.in"