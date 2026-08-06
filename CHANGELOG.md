# Changelog

## 2026-08-06 — Mobile / Facebook in-app browser failure (HTTP 206 investigation)

### Findings (all verified against the live site + git history)
- No service worker exists in the repo or in git history — nothing to disable.
- No `_headers`/`_redirects` existed before; added `_headers` to make the HTML
  caching policy explicit (revalidate always, never serve stale/partial).
- The "206 Partial Content" reported by Facebook's Sharing Debugger is expected
  CDN behavior: Facebook's crawler sends `Range` headers and Cloudflare answers
  with 206 from cache. Browsers never send `Range` on page navigation, so this
  is debugger noise, not a page-load blocker.
- **Root cause (infrastructure, not code):** the bare domain `kaziemon.online`
  has NO DNS records (only `www.kaziemon.online` resolves). Links using the
  non-www domain fail DNS lookup on mobile (fresh cache), which matches
  "works on desktop, fails inside the Facebook app".

### Action required in Cloudflare dashboard (cannot be committed)
1. Cloudflare dashboard → Pages → `kaziemon` project → Custom domains.
2. Add `kaziemon.online` and let Cloudflare create the proxied DNS record.
3. Confirm `https://kaziemon.online/` loads, then re-test the Facebook link.