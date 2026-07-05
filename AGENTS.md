# Project: Kazi Emon - Personal Website

## About This Project
- Single-page HTML website hosted on **Cloudflare Pages**.
- Domain: kaziemon.online
- Stack: Vanilla HTML + CSS + JS (no frameworks).
- All content is in `index.html`.

## How I Work

### 1. Auto-Push After Every Change
After making ANY change to the code, you MUST:
1. `git add -A`
2. `git commit -m "descriptive message about what changed"`
3. `git push`

Do NOT ask me for commit messages — write them yourself. Be specific about what changed.

### 2. I Am Non-Technical
- I don't know code, git, or terminal commands.
- If my request is vague or unclear, **ask me clarifying questions** before proceeding.
- Use simple language. Explain what you're doing in 1-2 plain sentences.
- Never ask me to run commands or do technical steps myself.

### 3. Run Tester Subagent
After every push and before reporting back, I MUST:
1. Fetch `https://www.kaziemon.online/` to confirm the change is deployed.
2. Invoke the **@tester** subagent to perform a full QA review of the live site. The tester will:
   - Analyze visual design, content, layout, functionality, and performance
   - Give a rating out of 10
   - List what's working and what's not
   - Provide a **KEEP / REVERT / IMPROVE** verdict
 3. Save the tester's full output to `suggestions/<number-one-priority-suggestion>_$(date +%Y-%m-%d).txt` so there's a permanent record of each review. Use the tester's stated #1 priority suggestion (slugified) as the filename.

### 4. Act on the Verdict
- **KEEP** → Report the tester's rating and positive feedback to me.
- **REVERT** → Run `git revert HEAD --no-edit && git push`, then tell me the tester found issues that need undoing.
- **IMPROVE** → Tell me the tester's suggestions first. Ask if I want to make those changes before finalizing.
- If I'm unavailable, apply **IMPROVE** suggestions that are clear and safe; use your best judgment.

### 5. Report Back
After testing, tell me the outcome in 2-3 plain sentences:
- What the tester rated (e.g., "8/10")
- Whether it was KEEP / REVERT / IMPROVE
- One key highlight or issue
- If reverted, say "I've undone the last change and your site is back to how it was before."

### 6. Going Back to Previous Version
If I say "go to previous version" or "undo" or "revert" or "this is wrong":
- Immediately run `git revert HEAD --no-edit && git push`
- If I say "go back 2 versions" or similar, revert multiple commits.
- Then tell me in plain language: "I've undone the last change and your site is back to how it was before."
- After reverting, fetch the live site to confirm it's back to the previous state.

## Design Preferences
- Dark theme (#030014 background).
- Purple (#7000FF) + Cyan (#00C2FF) accent colors.
- Clean, modern, professional.
- Keep everything in a single `index.html` unless I ask for more pages.
