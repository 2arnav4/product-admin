"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { getCategories } from "@/api/productsApi";

const SEARCH_DELAY_MS = 400;

const SORT_OPTIONS = [
  { value: "", label: "Default order" },
  { value: "title-asc", label: "Title A–Z" },
  { value: "title-desc", label: "Title Z–A" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-desc", label: "Rating: high to low" },
  { value: "rating-asc", label: "Rating: low to high" },
];

const fetchCategories = (signal) => getCategories({ signal });

export default function Filters({ query, updateQuery }) {
  const [searchText, setSearchText] = useState(query.q);
  const [lastSentQ, setLastSentQ] = useState(query.q);
  const [syncedQ, setSyncedQ] = useState(query.q);
  const { data: categories, error: categoriesError } = useFetch(fetchCategories);

  const { debounced: sendSearch, cancel: cancelSearch } = useDebouncedCallback((text) => {
    setLastSentQ(text);
    updateQuery({ q: text }, { replace: true });
  }, SEARCH_DELAY_MS);

  // The URL's q changed without us typing it (Back button, category pick, Clear):
  // show the URL's value in the box.
  if (query.q !== syncedQ) {
    setSyncedQ(query.q);
    if (query.q !== lastSentQ) {
      setSearchText(query.q);
      setLastSentQ(query.q);
    }
  }

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    sendSearch(event.target.value.trim());
  };

  const handleCategoryChange = (event) => {
    cancelSearch();
    setSearchText("");
    updateQuery({ category: event.target.value });
  };

  const handleSortChange = (event) => {
    const [sortBy = "", order = "asc"] = event.target.value.split("-");
    updateQuery({ sortBy, order });
  };

  const handleClear = () => {
    cancelSearch();
    setSearchText("");
    updateQuery({ q: "", category: "", sortBy: "", order: "asc" });
  };

  const sortValue = query.sortBy ? `${query.sortBy}-${query.order}` : "";
  const hasFilters = query.q || query.category || query.sortBy;

  return (
    <div className="space-y-2">
      <div className="grid gap-2 md:grid-cols-[1fr_auto_auto_auto]">
        <input
          type="search"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search products…"
          aria-label="Search products"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        />
        <select
          value={query.category}
          onChange={handleCategoryChange}
          disabled={!categories}
          aria-label="Filter by category"
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm disabled:opacity-60"
        >
          <option value="">
            {categoriesError ? "Categories unavailable" : "All categories"}
          </option>
          {categories?.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={sortValue}
          onChange={handleSortChange}
          aria-label="Sort products"
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleClear}
          disabled={!hasFilters}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm disabled:opacity-40"
        >
          Clear
        </button>
      </div>
      {query.q && (
        <p className="text-xs text-gray-500">
          Searching all categories. Picking a category clears the search.
        </p>
      )}
    </div>
  );
}
