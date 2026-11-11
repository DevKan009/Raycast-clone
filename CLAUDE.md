Delegate to `quick-worker` only for self-contained mechanical work I can fully specify.
Do quick targeted changes, debugging, design, and anything relying on context already loaded myself.

## Terminal output
- Run builds and other noisy commands through the filter, not raw: `node scripts/run-filtered.cjs npm run build`. It prints errors only (last lines on success) and keeps the real exit code.
- For searches and diffs, narrow first (`rg -l`, `git diff --stat`, `head`) before reading full output.
- If the filtered output hides something needed, rerun that one command raw.
- Bash output is capped at 20,000 characters (`BASH_MAX_OUTPUT_LENGTH` in `.claude/settings.json`).
