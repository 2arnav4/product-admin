export function getTotalPages(total, pageSize) {
  return Math.max(1, Math.ceil(total / pageSize));
}

export function getShowingRange(page, pageSize, total) {
  if (total === 0) return { from: 0, to: 0 };
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return { from, to };
}

export function getPageNumbers(current, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);
  const pages = [1];

  if (start > 2) pages.push("start-gap");
  for (let page = start; page <= end; page++) pages.push(page);
  if (end < totalPages - 1) pages.push("end-gap");
  pages.push(totalPages);

  return pages;
}
