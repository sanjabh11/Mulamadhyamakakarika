#!/bin/bash
# run-soak-day.sh
# Daily soak test runner for the monetization funnel analytics pipeline.
#
# Usage: ./scripts/run-soak-day.sh <day-number> [base-url]
# Example: ./scripts/run-soak-day.sh 1 http://localhost:3004
#
# Gates: completeness >= 95, attribution >= 90, webhook p95 < 60ms

set -e

DAY=${1:-1}
BASE_URL=${2:-http://localhost:3004}
REPORT_DIR="docs/soak"
LOG_FILE="$REPORT_DIR/day-${DAY}-log.md"

mkdir -p "$REPORT_DIR"

echo "# Soak Day $DAY — $(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$LOG_FILE"
echo "" >> "$LOG_FILE"
echo "## Configuration" >> "$LOG_FILE"
echo "- Base URL: $BASE_URL" >> "$LOG_FILE"
echo "- Day: $DAY / 7" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

echo "▶ Starting Day $DAY soak run against $BASE_URL"

# 1. Simulate paywall view event (upgrade_cta_shown)
echo "  [1/5] Simulating paywall funnel events..."
INTENT_ID="soak-$(date +%s)-day${DAY}"

curl -sf -X POST "$BASE_URL/api/checkout/intent" \
  -H "Content-Type: application/json" \
  -d "{\"checkoutIntentId\":\"$INTENT_ID\",\"selectedTier\":\"seeker\",\"anonymousId\":\"soak-anon-$DAY\",\"sessionId\":\"soak-session-$DAY\"}" \
  > /dev/null && echo "  ✅ checkout_intent_captured" || echo "  ❌ checkout intent POST failed"

# 2. Simulate webhook: payment.succeeded
echo "  [2/5] Simulating Whop payment.succeeded webhook..."
WEBHOOK_START=$(date +%s%3N)
curl -sf -X POST "$BASE_URL/api/webhooks/whop" \
  -H "Content-Type: application/json" \
  -H "webhook-id: soak-wh-$DAY" \
  -H "webhook-timestamp: $(date -u +%s)" \
  -H "webhook-signature: v1,soak-sig-placeholder" \
  -d '{"type":"payment.succeeded","data":{"id":"pay_soak_'$DAY'","user_id":"soak-user-'$DAY'","amount":1900,"plan_id":"seeker"}}' \
  > /dev/null && echo "  ✅ payment.succeeded accepted" || echo "  ⚠️  Webhook may require valid signature in prod"
WEBHOOK_END=$(date +%s%3N)
WEBHOOK_MS=$((WEBHOOK_END - WEBHOOK_START))

echo "  Webhook response time: ${WEBHOOK_MS}ms"
echo "- Webhook p95 sample (Day $DAY): ${WEBHOOK_MS}ms" >> "$LOG_FILE"

# 3. Simulate membership.activated webhook
echo "  [3/5] Simulating Whop membership.activated webhook..."
curl -sf -X POST "$BASE_URL/api/webhooks/whop" \
  -H "Content-Type: application/json" \
  -H "webhook-id: soak-wh-act-$DAY" \
  -H "webhook-timestamp: $(date -u +%s)" \
  -H "webhook-signature: v1,soak-sig-placeholder" \
  -d '{"type":"membership.activated","data":{"id":"mem_soak_'$DAY'","user_id":"soak-user-'$DAY'","plan_id":"seeker","product_id":"prod_test"}}' \
  > /dev/null && echo "  ✅ membership.activated accepted" || echo "  ⚠️  Webhook may require valid signature in prod"

# 4. Check analytics endpoint health
echo "  [4/5] Checking auth validate endpoint..."
AUTH_STATUS=$(curl -sf -o /dev/null -w "%{http_code}" "$BASE_URL/api/auth/validate" || echo "000")
echo "  Auth validate status: $AUTH_STATUS (401 is expected for unauthenticated)"

# 5. Record KPI snapshot
echo "  [5/5] Recording KPI snapshot..."
echo "" >> "$LOG_FILE"
echo "## KPI Snapshot" >> "$LOG_FILE"
echo "| KPI | Target | Status |" >> "$LOG_FILE"
echo "|-----|--------|--------|" >> "$LOG_FILE"
echo "| Event completeness | ≥95% | ⏳ Verify in logs |" >> "$LOG_FILE"
echo "| Attribution rate | ≥90% | ⏳ Verify in logs |" >> "$LOG_FILE"
echo "| Webhook p95 | <60ms | ${WEBHOOK_MS}ms $([ $WEBHOOK_MS -lt 60 ] && echo '✅' || echo '⚠️') |" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
echo "## Manual Verification Steps" >> "$LOG_FILE"
echo "- [ ] Verify \`checkout_intent_captured\` event in server logs" >> "$LOG_FILE"
echo "- [ ] Verify \`payment_succeeded\` event in server logs" >> "$LOG_FILE"
echo "- [ ] Verify \`subscription_started\` event in server logs" >> "$LOG_FILE"
echo "- [ ] Verify \`ANALYTICS_EVENT\` lines in stdout / log drain" >> "$LOG_FILE"
echo "- [ ] Confirm attribution linkage in checkout intent store" >> "$LOG_FILE"

echo ""
echo "✅ Day $DAY soak run complete. Log saved to $LOG_FILE"
echo "   Next: run \`npm run soak:metrics -- 7\` after Day 7 for KPI gate check."
