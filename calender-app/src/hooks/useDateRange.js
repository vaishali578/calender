import { useState, useCallback } from 'react';

export function useDateRange() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate]     = useState(null);
  const [hoverDate, setHoverDate] = useState(null);

  const handleDayClick = useCallback((date) => {
    if (!date) return;
    if (!startDate || (startDate && endDate)) {
      // fresh selection
      setStartDate(date);
      setEndDate(null);
      setHoverDate(null);
    } else {
      // second click
      if (date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
      setHoverDate(null);
    }
  }, [startDate, endDate]);

  const getDayState = useCallback((date) => {
    if (!date) return 'outside';
    const t = date.getTime();
    const s = startDate?.getTime();
    const e = endDate?.getTime();
    const h = hoverDate?.getTime();

    if (s && t === s) return 'start';
    if (e && t === e) return 'end';

    // range highlight during hover (before end is set)
    if (s && !e && h) {
      const lo = Math.min(s, h);
      const hi = Math.max(s, h);
      if (t === lo) return h < s ? 'end'   : 'start';
      if (t === hi) return h < s ? 'start' : 'end';
      if (t > lo && t < hi) return 'in-range';
    }

    if (s && e && t > s && t < e) return 'in-range';
    return 'default';
  }, [startDate, endDate, hoverDate]);

  const clearRange = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
    setHoverDate(null);
  }, []);

  return { startDate, endDate, hoverDate, setHoverDate, handleDayClick, getDayState, clearRange };
}
