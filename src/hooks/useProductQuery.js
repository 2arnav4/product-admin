import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { applyQueryChanges, buildQueryString, parseQuery } from "@/lib/productQuery";

export function useProductQuery() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const query = useMemo(() => parseQuery(searchParams), [searchParams]);

    const updateQuery = useCallback(
        (changes, { replace = false } = {}) => {
            const queryString = buildQueryString(applyQueryChanges(query, changes));
            const url = queryString ? `${pathname}?${queryString}` : pathname;
            if (replace) {
                router.replace(url, { scroll: false });
            } else {
                router.push(url, { scroll: false });
            }
        },
        [query, pathname, router]
    );

    return { query, updateQuery };
}