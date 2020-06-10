import { useState, useRef, useCallback, useEffect } from 'react';

export default function useDebounceInput(value: string, delay = 500) {
    const [currentValue, setCurrentValue] = useState(value);
    const interval = useRef(0);

    const clean = useCallback(() => {
        window.clearInterval(interval.current);
    }, []);

    useEffect(() => {
        interval.current = window.setTimeout(() => {
            setCurrentValue(value);
        }, delay);
        return clean;
    }, [value, delay]);

    useEffect(() => clean, []);

    return currentValue;
}