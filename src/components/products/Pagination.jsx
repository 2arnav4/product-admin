import { PAGE_SIZES } from "@/lib/productQuery";
import { getPageNumbers, getShowingRange, getTotalPages } from "@/lib/pagination";

export default function Pagination({ page, pageSize, total, shownCount, onPageChange, onPageSizeChange }) {
  const totalPages = getTotalPages(total, pageSize);
  const { from, to } = getShowingRange(page, pageSize, total, shownCount);

  const buttonClass =
    "min-w-9 rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
      <p className="text-gray-600">
        Showing {from}–{to} of {total}
      </p>

      <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          className={buttonClass}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        {getPageNumbers(page, totalPages).map((item) =>
          typeof item === "number" ? (
            <button
              key={item}
              type="button"
              aria-current={item === page ? "page" : undefined}
              className={`${buttonClass} ${item === page ? "border-gray-900 bg-gray-900 text-white" : ""}`}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          ) : (
            <span key={item} className="px-1 text-gray-400">…</span>
          )
        )}
        <button
          type="button"
          className={buttonClass}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </nav>

      <label className="flex items-center gap-2 text-gray-600">
        Per page
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-md border border-gray-300 px-2 py-1.5"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
