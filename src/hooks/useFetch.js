import { useCallback, useEffect, useState } from "react";

export function useFetch(fetcher) {
    const [attempt, setAttempt] = useState(0);
    const [result, setResult] = useState({
        fetcher: null,
        attempt: -1,
        data: null,
        error: null,
    });

    useEffect(() => {
        const controller = new AbortController();

        fetcher(controller.signal)
            .then((data) => {
                if (controller.signal.aborted) return;
                setResult({ fetcher, attempt, data, error: null });
            })
            .catch((error) => {
                if (controller.signal.aborted) return;
                setResult({ fetcher, attempt, data: null, error });
            });

        return () => controller.abort();
    }, [fetcher, attempt]);

    const retry = useCallback(() => setAttempt((n) => n + 1), []);

    const isLoading = result.fetcher !== fetcher || result.attempt !== attempt;

    return {
        data: result.data,
        error: isLoading ? null : result.error,
        isLoading,
        retry,
    };
}