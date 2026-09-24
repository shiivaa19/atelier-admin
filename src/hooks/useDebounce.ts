import { useEffect, useState } from "react";

/**
 * Custom hand-written useDebounce hook.
 * Delays updating the debounced value until after the specified delay ms has elapsed
 * since the last time the input value changed.
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
