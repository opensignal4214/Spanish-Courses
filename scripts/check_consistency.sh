#!/usr/bin/env bash
# Consistency checks for the Spanish-Courses repository.
#
# Catches the classes of problems that have crept in before:
#   1. Lesson/workbook/answer/vocab pages missing the shared JS include.
#   2. Templated boilerplate left in lesson plans.
#   3. Translation (tw/) coverage gaps or structural drift vs the English source.
#
# Usage:  bash scripts/check_consistency.sh
# Exit code is non-zero if any check fails, so it can gate CI.

set -uo pipefail
cd "$(dirname "$0")/.."

fail=0
note() { printf '  - %s\n' "$1"; }

DOCS=(lesson_plan workbook answer_sheet supplemental_vocabulary_list)

echo "==> 1. Shared JS include present on every weekly page"
missing_js=0
for n in $(seq 1 12); do
  for doc in "${DOCS[@]}"; do
    f="Week_${n}_Spanish_Lesson/spanish_week_${n}_${doc}.html"
    [ -f "$f" ] || { note "MISSING FILE: $f"; fail=1; continue; }
    if ! grep -q "weekly-shared.js" "$f"; then
      note "no weekly-shared.js: $f"; missing_js=1; fail=1
    fi
  done
done
[ "$missing_js" -eq 0 ] && echo "    OK"

echo "==> 2. No templated boilerplate in lesson plans"
boiler=0
for pat in "Identify target pattern" "High-frequency week target"; do
  hits=$(grep -rl "$pat" Week_*/ 2>/dev/null || true)
  if [ -n "$hits" ]; then
    note "boilerplate \"$pat\" found in:"; echo "$hits" | sed 's/^/      /'
    boiler=1; fail=1
  fi
done
[ "$boiler" -eq 0 ] && echo "    OK"

echo "==> 3. Traditional Chinese (tw/) coverage + structural parity"
cov=0
for n in $(seq 1 12); do
  for doc in "${DOCS[@]}"; do
    en="Week_${n}_Spanish_Lesson/spanish_week_${n}_${doc}.html"
    tw="tw/Week_${n}_Spanish_Lesson/spanish_week_${n}_${doc}.html"
    [ -f "$en" ] || continue
    if [ ! -f "$tw" ]; then
      note "untranslated: $tw"; cov=1; fail=1; continue
    fi
    # zh-Hant lang attribute present?
    grep -q 'lang="zh-Hant"' "$tw" || { note "tw file not marked zh-Hant: $tw"; cov=1; fail=1; }
    # same number of day ids as the English source?
    en_ids=$(grep -o 'id="day-[0-9]"' "$en" | sort -u | wc -l | tr -d ' ')
    tw_ids=$(grep -o 'id="day-[0-9]"' "$tw" | sort -u | wc -l | tr -d ' ')
    if [ "$en_ids" != "$tw_ids" ]; then
      note "day-id count drift ($en_ids vs $tw_ids): $tw"; cov=1; fail=1
    fi
  done
done
[ "$cov" -eq 0 ] && echo "    OK"

echo
if [ "$fail" -eq 0 ]; then
  echo "All consistency checks passed."
else
  echo "Consistency checks FAILED (see notes above)."
fi
exit "$fail"
