export const PAGE_SIZES = [10, 20, 50];
export const SORT_FIELDS = ["title", "price", "rating"];

const DEFAULTS = {
    page: 1,
    pageSize: 10,
    q: "",
    category: "",
    sortBy: "",
    order: "asc",
    delay: 0,
};

function parsePositiveInt(value, fallback) {
    if (!/^\d+$/.test(value ?? "")) return fallback;
    const number = Number(value);
    return number >= 1 && Number.isSafeInteger(number) ? number : fallback;
}

export function parseQuery(searchParams) {
    const q = (searchParams.get("q") ?? "").trim();
    const category = searchParams.get("category") ?? "";
    const pageSize = Number(searchParams.get("pageSize"));
    const sortBy = searchParams.get("sortBy") ?? "";

    return {
        page: parsePositiveInt(searchParams.get("page"), DEFAULTS.page),
        pageSize: PAGE_SIZES.includes(pageSize) ? pageSize : DEFAULTS.pageSize,
        q,
        category: q ? "" : category,
        sortBy: SORT_FIELDS.includes(sortBy) ? sortBy : DEFAULTS.sortBy,
        order: searchParams.get("order") === "desc" ? "desc" : "asc",
        delay: parsePositiveInt(searchParams.get("delay"), DEFAULTS.delay),
    };
}

export function applyQueryChanges(current, changes) {
    const next = { ...current, ...changes };
    if (!("page" in changes)) next.page = DEFAULTS.page;
    if (changes.q) next.category = "";
    if (changes.category) next.q = "";
    return next;
}

export function buildQueryString(query) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
        if (value !== DEFAULTS[key]) params.set(key, String(value));
    }
    return params.toString();
}
