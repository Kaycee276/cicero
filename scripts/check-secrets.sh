#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Running Secrets & Credential Leak Detection..."

# Patterns to scan for in tracked/staged files:
# 1. npm access tokens (npm_...)
# 2. Private Keys (BEGIN PRIVATE KEY, etc.)
# 3. AWS keys (AKIA...)
# 4. Generic API secrets / bearer tokens / private seed phrases

FORBIDDEN_PATTERNS=(
  'npm_[A-Za-z0-9]{36}'
  '-----BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----'
  'AKIA[0-9A-Z]{16}'
  '(secret|private|token)[-_]?[kK]ey[ \t]*[:=][ \t]*["'\''][A-Za-z0-9+/=_-]{16,}["'\'']'
)

FAILED=0

# Files to check: all git tracked files, excluding node_modules, .git, dist, and lockfiles
FILES_TO_CHECK=$(git ls-files | grep -vE 'node_modules/|\.git/|dist/|pnpm-lock\.yaml|\.png$|\.jpg$|\.ico$')

for PATTERN in "${FORBIDDEN_PATTERNS[@]}"; do
  # Search for forbidden pattern, ignoring check-secrets.sh itself
  MATCHES=$(echo "$FILES_TO_CHECK" | xargs grep -En "$PATTERN" 2>/dev/null | grep -v 'scripts/check-secrets.sh' || true)
  if [ -n "$MATCHES" ]; then
    echo "❌ SECURITY ALERT: Potential secret leak detected matching pattern: $PATTERN"
    echo "$MATCHES"
    FAILED=1
  fi
done

if [ $FAILED -ne 0 ]; then
  echo "🚨 Commit rejected: Remove secrets before committing!"
  exit 1
fi

echo "✅ No exposed secrets or credentials detected."
exit 0
