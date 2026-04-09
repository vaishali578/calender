import { useState, useMemo } from 'react';

export const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

export const DAY_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

// Indian public holidays (month is 1-indexed)
export const INDIAN_HOLIDAYS = {
  '1-26':  'Republic Day',
  '3-31':  'Id-ul-Fitr',
  '4-14':  'Dr. Ambedkar Jayanti',
  '4-18':  'Good Friday',
  '5-12':  'Buddha Purnima',
  '8-15':  'Independence Day',
  '10-2':  'Gandhi Jayanti',
  '10-2':  'Gandhi Jayanti',
  '11-5':  'Diwali',
  '12-25': 'Christmas Day',
};

function getHolidayKey(month1idx, day) {
  return `${month1idx}-${day}`;
}

export function useCalendar() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed

  const goToPrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const goToNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };
  
  const goToPrevYear = () => setCurrentYear(y => y - 1);
  const goToNextYear = () => setCurrentYear(y => y + 1);

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const days = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    // Monday=0 … Sunday=6
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const cells = [];

    // leading cells from prev month
    for (let i = startOffset - 1; i >= 0; i--) {
      cells.push({ day: daysInPrevMonth - i, currentMonth: false, date: null });
    }

    // current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentYear, currentMonth, d);
      const holidayKey = getHolidayKey(currentMonth + 1, d);
      cells.push({
        day: d,
        currentMonth: true,
        date,
        isToday:
          d === today.getDate() &&
          currentMonth === today.getMonth() &&
          currentYear === today.getFullYear(),
        holiday: INDIAN_HOLIDAYS[holidayKey] || null,
      });
    }

    // trailing cells from next month
    const remaining = 42 - cells.length; // always 6 rows × 7 cols
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, currentMonth: false, date: null });
    }

    return cells;
  }, [currentYear, currentMonth]);

  return { currentYear, currentMonth, days, goToPrev, goToNext, goToToday, goToPrevYear, goToNextYear };
}
