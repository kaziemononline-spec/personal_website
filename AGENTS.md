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

### 3. Verify Changes Are Live
After every push, I MUST:
1. Fetch `https://www.kaziemon.online/` to confirm the change is deployed and looks correct.
2. Report back whether the change was applied successfully.

### 4. Going Back to Previous Version
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
