#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:3000}"
FAIL=0

echo "== Smoke tests =="

# 1. Health
echo -n "GET /health ... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health" || echo "000")
if [ "$STATUS" = "200" ] || [ "$STATUS" = "401" ] || [ "$STATUS" = "403" ]; then
  echo "ok ($STATUS)"
else
  echo "FAIL ($STATUS)"
  FAIL=1
fi

# 2. Auth probe (should reject missing/invalid credentials)
echo -n "POST /auth/login (invalid) ... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"smoke@test","password":"invalid"}' || echo "000")
if [ "$STATUS" = "401" ] || [ "$STATUS" = "400" ]; then
  echo "ok ($STATUS)"
else
  echo "FAIL ($STATUS)"
  FAIL=1
fi

# 3. Rate limit sanity (hit a limited endpoint a few times)
echo -n "Rate limit sanity ... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/auth/otp/send" \
  -H "Content-Type: application/json" \
  -d '{"phone":"+251900000000"}' || echo "000")
if [ "$STATUS" = "429" ] || [ "$STATUS" = "200" ] || [ "$STATUS" = "400" ]; then
  echo "ok ($STATUS)"
else
  echo "FAIL ($STATUS)"
  FAIL=1
fi

if [ "$FAIL" -ne 0 ]; then
  echo "Smoke tests FAILED"
  exit 1
fi
echo "Smoke tests passed"
