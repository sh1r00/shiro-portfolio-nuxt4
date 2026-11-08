#!/usr/bin/env bash
# Deploy the shiro-portfolio Worker (cloudflare_module preset).
# Reads Cloudflare creds from the vault via `read` (no inline command substitution).
set -e

VAULT="$HOME/.hermes/.hermese_keys/Cloudflare"
IFS= read -r CLOUDFLARE_API_TOKEN < "$VAULT/Admin/API_token.txt"
IFS= read -r CLOUDFLARE_ACCOUNT_ID < "$VAULT/R2/Account_id.txt"
export CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID

cd "D:/sh1r00/sh1r00 Local Git Repo/sh1r00/live/shiro-portfolio-nuxt4"
npx wrangler --config .output/server/wrangler.json deploy 2>&1 | tail -12
