# Notes

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

## A problem I faced and how I fixed it

After logging in, the token was deleted immediately and every protected request failed. I was calling `saveToken(token, minutes)` with an extra argument, so the refresh token was being used as the expiry time. `"eyJ..." * 60000` is `NaN`, and my expiry check (`!(expiresAt > Date.now())`) treats `NaN` as expired, so the token was cleared on the next read. I found it by logging the stored expiry value, fixed the call, and kept the NaN-safe comparison because it fails safe if storage is ever corrupted.

## Where AI helped

I used Claude (Claude Code) throughout the assignment. It helped me plan the module structure, explained the concepts before I wrote code (Axios interceptors, AbortController, URL state, hydration, debouncing), reviewed and debugged the parts I typed, wrote a large share of the later modules when I was short on time, and ran automated browser checks against every module and the live deployment. I reviewed every file and can explain the decisions above.
