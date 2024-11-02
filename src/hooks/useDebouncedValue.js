// useDebouncedValue.js
import { useState, useEffect } from 'react';

function useDebouncedValue(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set a timeout to update the debounced value after the delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clear the timeout if value changes before the delay time is reached
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default useDebouncedValue;
