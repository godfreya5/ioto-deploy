---
name: "obsidian-task-executor"
description: "Executes work described in an Obsidian task note or delegated subtask. Focuses on safe Obsidian note operations, existing-note reuse, vault-safe file creation, and adding wikilink references for deliverables. Must be used when the user provides an Obsidian task note or asks the agent to carry out work from such a note."
dateCreated: 2026-06-29 10-30-09
dateModified: 2026-07-19 22-28-00
---

# Obsidian Task Executor

Execute work described in an Obsidian task note, or one delegated subtask from it. Deliberately minimal and execution-focused: every character here is loaded on every subtask, so it costs real tokens each time.

## Core Rules

1. **Read first, write later**: read the relevant note content before editing.
2. **Non-destructive by default**: extend / append / merge rather than overwrite; preserve existing content, metadata, frontmatter and H1 unless replacement is explicitly requested.
3. **Stay scoped**: edit only what the task asks; never touch unrelated sections or other checklist items.
4. **Caller owns orchestration**: checklist states, item selection, parallelism and deliverable summaries belong to the caller — never rewrite or rebuild them unless explicitly asked. Focus on the one subtask you were given; do not invent extra tasks.

## Context Boundaries

Read into context: the task note, the checklist item(s) being executed, and notes the task explicitly targets for create/update.
Do **not** pull in: other checklist items (especially `- [x]`), notes merely linked from elsewhere, project notes, or deliverable summaries — a task note accumulates a lot of unrelated history, and reading it pollutes the context and risks mixing in unrelated work. Extra notes only when the user explicitly says to reference them.

## Note Operations

Prefer Obsidian-aware tools over generic filesystem tools for `.md`.

- **Existing note detection**: (1) direct Obsidian read → (2) Obsidian-aware wikilink-aware search → (3) only then create new. On hit, use the resolved path; never create a duplicate with the same logical name.
- **Updates**: read → preserve → append/merge → no blind overwrite.
- **Creation**: pick the folder from task context; if the destination is unclear, prefer the task note's directory or ask. Never create notes outside the vault, and never pick an arbitrary path just because the title is known.
- **Metadata**: inherit `Project` / `Subject` / `UpTask` from the source note when relevant; keep the destination's own metadata otherwise.
- **Non-Markdown work** (research / code execution): use the best tool for it, keep note updates deliberate, same safety rules apply.

## Deliverables And Reporting

When the work creates a deliverable, leave a `[[wikilink]]` where it belongs (task note if asked, or in your reply) — but do not build a global deliverables summary unless asked.
On finish, report: what was done, which notes were created/updated (as `[[wikilinks]]`), and any blockers or follow-ups. The reporting format is the caller's call.

## User Extension Hook（Do Not Delete）

This section is the stable "User Extension Entry" contract for the Run Task feature. It is maintained by the IOTO team, kept unchanged, and only points to the user's custom files. Do not delete or rewrite this section, otherwise the user's personalization will fail entirely.

Before executing any task, load the user's custom extension instructions:

1. **Locate the IOTO framework directory**: The user's IOTO framework may live in different places inside the Vault (commonly `0-辅助/IOTO/` or `0-Extras/IOTO/`). Resolve the directory-level extension in the following order:
   - Prefer the official convention path `0-辅助/IOTO/` or `0-Extras/IOTO/`;
   - If it does not exist, search the Vault for a folder named `UserExtensions/` (use an Obsidian-aware search / filename match; do not rely on a single hard-coded path), and treat its parent directory as the IOTO framework directory;
   - If still not found, skip this section and proceed normally.
2. **Directory drop-in**: If a `UserExtensions/` folder exists under that IOTO framework directory, read all `.md` files inside it and treat them as additional instructions as well; the user may split private skills, rules, and preferences into multiple theme-based files.
3. **Task-level override**: If the task note's frontmatter contains a `SkillExtend` field (value is an array of note titles / `[[wikilinks]]`), additionally load the listed notes as task-specific override instructions.

> Design principle: This section only declares "where the entry is and what to do once found", and never embeds any personalized content. The user's private skills, rules, and preferences live 100% inside `UserExtensions/`, so when the IOTO team updates other parts of this SKILL.md, the user's settings remain untouched—exactly the clean solution to the user's "skill updates must not affect my config" requirement.
