#!/usr/bin/env bash
# Optional live backend smoke check for SmartMarket Lite API.
# Does not run in CI. Requires curl and a running API (default http://localhost:5000).

set -euo pipefail

API_BASE="${VITE_SMARTMARKET_API_BASE_URL:-${VITE_API_BASE_URL:-http://localhost:5000}}"
API_BASE="${API_BASE%/}"
UNIQUE_SUFFIX="$(date +%s)"
TEST_EMAIL="smoke-${UNIQUE_SUFFIX}@example.test"
TEST_PASSWORD="SmokeTest123!"
FIRST_NAME="Smoke"
LAST_NAME="Test"

print_status() {
  printf '%s\n' "$1"
}

request() {
  local method="$1"
  local path="$2"
  local body="${3:-}"
  local auth_header="${4:-}"

  local args=(-s -w '\n%{http_code}' -X "$method" "${API_BASE}${path}" -H 'Accept: application/json')
  if [[ -n "$auth_header" ]]; then
    args+=(-H "Authorization: Bearer ${auth_header}")
  fi
  if [[ -n "$body" ]]; then
    args+=(-H 'Content-Type: application/json' -d "$body")
  fi

  curl "${args[@]}"
}

parse_response() {
  local raw="$1"
  HTTP_BODY="$(printf '%s' "$raw" | sed '$d')"
  HTTP_CODE="$(printf '%s' "$raw" | tail -n 1)"
}

print_status "SmartMarket live API check"
print_status "API base: ${API_BASE}"

if ! curl -s -o /dev/null --connect-timeout 3 "${API_BASE}/api/products?page=1&pageSize=1"; then
  print_status "Result: backend unreachable at ${API_BASE}"
  exit 1
fi

print_status "Step 1: API reachable (HTTP probe)"

REGISTER_RAW="$(request POST '/api/auth/register' "{\"email\":\"${TEST_EMAIL}\",\"password\":\"${TEST_PASSWORD}\",\"firstName\":\"${FIRST_NAME}\",\"lastName\":\"${LAST_NAME}\"}")"
parse_response "$REGISTER_RAW"
if [[ "$HTTP_CODE" != "200" && "$HTTP_CODE" != "201" ]]; then
  print_status "Step 2: register failed (HTTP ${HTTP_CODE})"
  exit 1
fi
TOKEN="$(printf '%s' "$HTTP_BODY" | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))" 2>/dev/null || true)"
if [[ -z "$TOKEN" ]]; then
  print_status "Step 2: register response missing token"
  exit 1
fi
print_status "Step 2: register passed (HTTP ${HTTP_CODE}, token received)"

LOGIN_RAW="$(request POST '/api/auth/login' "{\"email\":\"${TEST_EMAIL}\",\"password\":\"${TEST_PASSWORD}\"}")"
parse_response "$LOGIN_RAW"
if [[ "$HTTP_CODE" != "200" ]]; then
  print_status "Step 3: login failed (HTTP ${HTTP_CODE})"
  exit 1
fi
TOKEN="$(printf '%s' "$HTTP_BODY" | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))" 2>/dev/null || true)"
print_status "Step 3: login passed (HTTP ${HTTP_CODE})"

PRODUCTS_RAW="$(request GET '/api/products?page=1&pageSize=20' '' "$TOKEN")"
parse_response "$PRODUCTS_RAW"
if [[ "$HTTP_CODE" != "200" ]]; then
  print_status "Step 4: get products failed (HTTP ${HTTP_CODE})"
  exit 1
fi

PRODUCT_ID="$(printf '%s' "$HTTP_BODY" | python3 -c "
import sys, json
data = json.load(sys.stdin)
items = data.get('items') or data if isinstance(data, list) else []
for item in items:
    if item.get('isActive') and item.get('stockQuantity', 0) > 0:
        print(item['id'])
        break
" 2>/dev/null || true)"

if [[ -z "$PRODUCT_ID" ]]; then
  print_status "Step 4: products loaded (HTTP ${HTTP_CODE})"
  print_status "Result: No available product found for live cart/checkout smoke."
  exit 0
fi
print_status "Step 4: found available product id=${PRODUCT_ID}"

ADD_RAW="$(request POST '/api/cart/items' "{\"productId\":\"${PRODUCT_ID}\",\"quantity\":1}" "$TOKEN")"
parse_response "$ADD_RAW"
if [[ "$HTTP_CODE" != "200" ]]; then
  print_status "Step 5: add to cart failed (HTTP ${HTTP_CODE})"
  if [[ "$HTTP_CODE" == "409" ]]; then
    print_status "Hint: stock/business rule rejected add to cart"
  fi
  exit 1
fi
print_status "Step 5: add to cart passed (HTTP ${HTTP_CODE})"

CHECKOUT_RAW="$(request POST '/api/checkout' '' "$TOKEN")"
parse_response "$CHECKOUT_RAW"
if [[ "$HTTP_CODE" != "200" && "$HTTP_CODE" != "201" ]]; then
  print_status "Step 6: checkout failed (HTTP ${HTTP_CODE})"
  if [[ "$HTTP_CODE" == "409" ]]; then
    print_status "Hint: checkout failed due to stock/business rule"
  elif [[ "$HTTP_CODE" == "500" ]]; then
    print_status "Hint: server returned 500"
  fi
  exit 1
fi
print_status "Step 6: checkout passed (HTTP ${HTTP_CODE})"

ORDERS_RAW="$(request GET '/api/orders' '' "$TOKEN")"
parse_response "$ORDERS_RAW"
if [[ "$HTTP_CODE" != "200" ]]; then
  print_status "Step 7: get orders failed (HTTP ${HTTP_CODE})"
  exit 1
fi
print_status "Step 7: orders list passed (HTTP ${HTTP_CODE})"
print_status "Result: live API smoke check completed successfully."
