# Product Admin Dashboard

A small admin dashboard for managing products, built on the free [DummyJSON](https://dummyjson.com) API.

**Live:** _add Vercel URL here_
**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Axios

Demo login: `emilys` / `emilyspass`

## Setup

```bash
git clone https://github.com/2arnav4/product-admin.git
cd product-admin
npm install
npm run dev        # http://localhost:3000
```

No environment variables are needed. `npm run build` creates a production build and `npm run lint` runs ESLint.

## What is finished

- [x] Login with error messages, protected product pages, logout
- [x] Product list: image, title, category, price, rating, stock — table on desktop, cards on mobile
- [x] Server-side pagination with `limit`/`skip`, page numbers, Previous/Next, page size 10/20/50, "Showing 21–40 of 194"
- [x] Debounced search via `/products/search`, resets to page 1
- [x] Category filter (`/products/categories`) and sort by price, rating or title
- [x] `/products/[id]` with image gallery, description, price and reviews; "not found" page for a wrong id
- [x] Add and edit form with validation; confirm popup before delete
- [x] Loading, empty and error states with a Retry button
- [x] One shared Axios file: token added to every request, errors handled in one place
- [x] Page, page size, search, category and sort kept in the URL (refresh and shared links work)
- [x] No React Query, SWR or table/pagination libraries

## How the tricky parts are handled

| Requirement | Approach |
|---|---|
| Old search results must never replace new ones | `useFetch` gives every request an `AbortController` and aborts it when the query changes; a response from an aborted request is ignored even if it already arrived. Try it with `?delay=2000` in the page URL — it is forwarded to the API. |
| Search and category can't be combined in the API | They are mutually exclusive: typing a search clears the category and picking a category clears the search (a URL containing both uses the search). This keeps pagination fully server-side and correct; filtering search results in the browser would break limit/skip paging and page counts. |
| Add/edit/delete are not saved by the API | Each action calls the real endpoint first (so network/server errors surface), then records the change in `localStorage`. API results are merged with those changes, so edits and deletes survive a refresh. New products get local ids (1001+) and are listed in an "Added in this browser" section on the first unfiltered page, because the API's paging can't include them. |
| Bad URL values (`?page=abc`, `?page=999`) | All URL values are parsed and whitelisted in one place (`lib/productQuery.js`); invalid values fall back to defaults, and a page past the end is moved to the last page once the total is known. |
| Clicking Save or Login many times | A ref-based guard blocks re-entry synchronously and the button is disabled while the request runs, so only one request is sent. |

## Project structure

```
src/
  lib/          axios instance, token storage, URL query parsing, pagination maths, validation, local change store
  api/          one function per DummyJSON endpoint (no UI code)
  services/     product actions that combine the API and the local change store
  hooks/        useFetch (race-safe), useProductQuery (URL state), useDebouncedCallback, useIsLoggedIn
  components/   auth, ui (spinner, empty, error, confirm dialog), products (table, cards, pagination, filters, form, detail)
  app/          routes: /login, /products, /products/new, /products/[id], /products/[id]/edit
```
