# Shared agent workflow

- Before starting work, inspect `HANDOFF.md` for the latest task status and next steps.
- Before ending or handing work to another agent, update `HANDOFF.md` with completed work, decisions, verification, and remaining steps.
- Treat the Git working tree as shared state: inspect `git status` before editing or reverting files, and preserve changes you did not make.
- Never put credentials, API keys, or other secrets in `HANDOFF.md` or commit them.

`HANDOFF.md` preserves project context between Codex and Antigravity sessions. It is a shared file, not live chat synchronization; commit it with the project changes when a handoff should persist across machines.

