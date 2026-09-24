import { useCallback, useEffect, useRef } from "react";

export function useDebouncedCallback(callback, delay) {
    const timerRef = useRef(null);
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    });

    useEffect(() => () => clearTimeout(timerRef.current), []);

    const debounced = useCallback(
        (...args) => {
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => callbackRef.current(...args), delay);
        },
        [delay]
    );

    const cancel = useCallback(() => clearTimeout(timerRef.current), []);

    return { debounced, cancel };
}