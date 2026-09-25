# Notes

## A problem I faced and how I fixed it

**Problem:** After logging out, pressing the browser's Back button could land on a protected page stuck on "Checking session..." forever, instead of sending the user to the login page.

**How to reproduce:** Log in, open `/products` and then `/products?page=2` by typing each in the address bar (two full page loads), log out, then press Back.

**Cause:** Browsers keep a frozen copy of recently visited pages in memory, called the back-forward cache (bfcache), so Back feels instant. Pressing Back unfreezes that copy instead of loading the page again. My route guard only checked the login when the page loaded, and React effects don't re-run on a restored page, so the check never happened again. It only appears after full page loads. Moving around inside the app with Next's links stays in one page, so the guard runs normally there.

**How I found it:** While testing the logout flow, Back landed on the protected URL instead of `/login`. Logging the browser's page-restore events showed the page was coming from the cache.

**Fix:** In `src/components/auth/AuthGuard.jsx`, the guard now listens for the event the browser fires when it restores a page from bfcache. If the page came from the cache and there is no valid token in storage, it reloads the page, so the guard runs fresh and redirects to login with the return URL kept. It reads the token from storage rather than React state, because the state inside the frozen copy is stale. Logged-in users are not affected, so Back stays instant for them.

**Why not other options:** Always reloading on restore slows Back for everyone. Disabling bfcache with no-store cache headers behaves differently across browsers. A server-side check can't help, because restoring from the cache never contacts the server.

**Limit:** This is a client-side guard. Real protection needs the API to reject requests without a valid token, which DummyJSON's product endpoints don't do.

## Choices

- **The URL is the single source of truth** for page, page size, search, category and sort. Components only change the URL, and the list is re-derived from it, so refresh, shared links and the Back button all work without extra state.
- **All URL values are parsed in one place** (`lib/productQuery.js`). Anything invalid (`?page=abc`, `?pageSize=0`, an unknown sort) falls back to a default, and a page past the end moves to the last page once the total is known.
- **Race safety lives in one hook** (`useFetch`). Every request gets an `AbortController`; when the query changes the old request is aborted, and a response from an aborted request is ignored even if it already arrived. This can be tried live with `?delay=2000` in the page URL.
- **Search and category are mutually exclusive.** DummyJSON cannot combine them, and filtering search results in the browser would break limit/skip paging and page counts. Typing a search clears the category and picking a category clears the search.
- **Add, edit and delete call the real API first, then are saved in `localStorage`**, because DummyJSON does not persist them. Results from the API are merged with those local changes, so they survive a refresh. New products get their own ids (1001+) because the API returns id 195 for every add.
- **Double submits are blocked with a ref**, not only a disabled button, because a ref updates synchronously while state only updates on the next render.
- **Layers:** `api/` only talks HTTP, `services/` combines the API with local changes, hooks own state, and components only render.
- **Admin layout:** a sidebar with a dashboard (revenue and orders from DummyJSON carts, catalogue and low-stock stats), inspired by an admin panel I built earlier for an e-commerce client.
- **Prices stay in USD** because that is the currency of the DummyJSON data; showing a rupee symbol without converting would display wrong prices.

## Where AI helped

I used Claude Code for planning the module structure, explaining smaller concepts, and debugging. I wrote most of the modules myself, including all the logic-heavy parts. Claude Code wrote the parts that were not logic-intensive. Every module was tested first by Claude Code with automated browser checks and then manually by me, and Claude Code reviewed all the code. When I got stuck on an issue, including the one above, Claude Code helped me track down the cause. I can explain every decision in these notes.
