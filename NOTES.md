# Notes

> Draft — edit this into your own words before submitting.

## Choices

- **The URL is the single source of truth** for page, page size, search, category and sort. Components change the URL; the data is re-derived from it. That makes refresh, shared links and the Back button work without extra state.
- **Race safety lives in one hook** (`useFetch`) instead of in every page, using `AbortController` plus an "ignore if aborted" check.
- **Search and category are mutually exclusive**, to keep pagination server-side and exact (see README).
- **Local change store** in `localStorage` so add/edit/delete are visible and survive a refresh, while the real API is still called for each action.
- **Layers:** `api/` only talks HTTP, `services/` combines API + local store, hooks own state, components only render.

## A problem I faced and how I fixed it

After logging in, the token was deleted immediately and every protected request failed. `saveToken(token, minutes)` was being called with an extra argument, so the refresh token was used as the expiry time. `"eyJ..." * 60000` is `NaN`, and the expiry check (`!(expiresAt > Date.now())`) treats `NaN` as expired, so the token was cleared on the next read. I found it by logging the stored expiry, fixed the call, and kept the NaN-safe comparison because it fails safe if storage is ever corrupted.

## Where AI helped

I used Claude (Claude Code) throughout: to plan the module structure, explain concepts (interceptors, AbortController, URL state, hydration), review and debug my code, write parts of the code, and run automated browser checks against each module. I reviewed every file and can explain the decisions above.
