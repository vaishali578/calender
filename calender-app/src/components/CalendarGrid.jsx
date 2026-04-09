import React from 'react';
import { DAY_LABELS } from '../hooks/useCalendar';

function getDOWIndex(date) {
  const d = date.getDay();
  return d === 0 ? 6 : d - 1; // 0=Mon … 6=Sun
}

function DayCell({ cell, state, onClick, onMouseEnter, onMouseLeave, index }) {
  const isWeekend = cell.date ? getDOWIndex(cell.date) >= 5 : false;

  const stateClass = {
    start:    'day-start',
    end:      'day-end',
    'in-range': 'day-in-range',
  }[state] ?? '';

  const todayClass   = cell.isToday ? 'day-today' : '';
  const outsideClass = !cell.currentMonth ? 'opacity-30' : '';
  const weekendColor = isWeekend && cell.currentMonth && !stateClass ? 'text-(--accent)' : '';

  return (
    <button
      className={`
        day-cell relative flex flex-col items-center justify-center
        rounded-xl text-sm font-medium min-h-[40px] aspect-square
        transition-all duration-150 cursor-pointer border border-transparent
        text-gray-700 dark:text-gray-200 grid-cell-animate
        disabled:cursor-default disabled:pointer-events-none
        ${stateClass} ${todayClass} ${outsideClass} ${weekendColor}
      `}
      style={{ animationDelay: `${index * 15}ms` }}
      onClick={() => onClick(cell.date)}
      onMouseEnter={() => onMouseEnter(cell.date)}
      onMouseLeave={() => onMouseLeave(null)}
      disabled={!cell.currentMonth}
      aria-label={cell.date ? cell.date.toDateString() : undefined}
      aria-pressed={state === 'start' || state === 'end'}
    >
      <span className="relative z-10 leading-none">{cell.day}</span>

      {/* Today dot with pulse */}
      {cell.isToday && (
        <span
          className="absolute bottom-[3px] w-1.5 h-1.5 rounded-full pulse-ring"
          style={{ background: 'var(--accent)' }}
        />
      )}

      {/* Holiday indicator with custom tooltip */}
      {cell.holiday && (
        <>
          <span
            className="absolute top-0.5 right-1 text-[8px] leading-none text-red-500"
            aria-hidden="true"
          >
            ●
          </span>
          <div className="holiday-tooltip shadow-xl dark:bg-gray-800 border dark:border-gray-700 leading-tight">
            {cell.holiday}
          </div>
        </>
      )}
    </button>
  );
}

export function CalendarGrid({ days, getDayState, handleDayClick, setHoverDate }) {
  return (
    <div className="flex flex-col gap-1">
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAY_LABELS.map(d => (
          <div
            key={d}
            className={`text-center text-[10px] font-semibold uppercase tracking-widest py-1
              ${d === 'Sat' || d === 'Sun' ? 'text-(--accent)' : 'text-gray-400 dark:text-gray-500'}`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((cell, idx) => {
          const state = cell.date ? getDayState(cell.date) : 'outside';
          return (
            <DayCell
              key={idx}
              index={idx}
              cell={cell}
              state={state}
              onClick={handleDayClick}
              onMouseEnter={setHoverDate}
              onMouseLeave={setHoverDate}
            />
          );
        })}
      </div>
    </div>
  );
}
