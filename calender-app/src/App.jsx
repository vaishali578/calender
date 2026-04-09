import React, { useState, useEffect, useCallback } from 'react';
import { HeroImage, MONTH_THEMES } from './components/HeroImage';
import { CalendarGrid } from './components/CalendarGrid';
import { NotesPanel } from './components/NotesPanel';
import { useCalendar, MONTH_NAMES } from './hooks/useCalendar';
import { useDateRange } from './hooks/useDateRange';
import { useNotes } from './hooks/useNotes';
import { useTheme } from './hooks/useTheme';
import './index.css';

/* ── Sub‑components ─────────────────────────────────── */

function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const dateString = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 text-[11px] font-medium text-gray-500 dark:text-gray-400 opacity-80 shadow-sm transition-all hover:opacity-100 grid-cell-animate">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-ring"></span>
      {dateString} <span className="opacity-40">|</span> {timeString}
    </div>
  );
}

function RangeInfo({ startDate, endDate, clearRange }) {
  if (!startDate) return null;
  const fmt = d =>
    d?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const diff = endDate
    ? Math.round((endDate - startDate) / 86400000) + 1
    : 1;

  return (
    <div className="flex flex-wrap items-center gap-2 px-3 py-2 rounded-xl border text-xs
      bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] border-[color-mix(in_srgb,var(--accent)_35%,transparent)]">
      <span className="font-semibold" style={{ color: 'var(--accent)' }}>Selected:</span>
      <span className="text-gray-700 dark:text-gray-200 flex-1">
        {fmt(startDate)}
        {endDate && endDate.getTime() !== startDate.getTime() ? ` → ${fmt(endDate)}` : ''}
      </span>
      <span
        className="rounded-full px-2.5 py-0.5 font-bold text-white text-[11px]"
        style={{ background: 'var(--accent)' }}
      >
        {diff} day{diff !== 1 ? 's' : ''}
      </span>
      <button
        onClick={clearRange}
        aria-label="Clear selection"
        className="ml-auto text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 px-2 py-0.5 rounded-lg transition-colors duration-150"
      >
        ✕
      </button>
    </div>
  );
}

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700
        text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600
        transition-all duration-200 hover:rotate-12"
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      )}
    </button>
  );
}

/* ── Root App ────────────────────────────────────────── */

export default function App() {
  const { theme, toggleTheme }                  = useTheme();
  const { currentYear, currentMonth, days, goToPrev, goToNext, goToToday, goToPrevYear, goToNextYear } = useCalendar();
  const {
    startDate, endDate, hoverDate, setHoverDate,
    handleDayClick, getDayState, clearRange,
  } = useDateRange();
  const {
    notes, draft, setDraft,
    monthKey, makeRangeKey,
    addNote, deleteNote,
    getNotesForRange, getMonthNotes,
  } = useNotes(currentYear, currentMonth);

  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDir, setFlipDir]       = useState('next');
  const accent = MONTH_THEMES[currentMonth].accent;

  // Set dynamic CSS accent variable on <html>
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent);
  }, [accent]);

  // Page‑flip wrapper
  const navigate = useCallback((dir) => {
    setFlipDir(dir);
    setIsFlipping(true);
    setTimeout(() => {
      dir === 'next' ? goToNext() : goToPrev();
      setIsFlipping(false);
    }, 350);
  }, [goToPrev, goToNext]);

  // Keyboard navigation — use refs so the handler is registered exactly once
  // but always calls the latest navigate/clearRange functions
  const navigateRef = React.useRef(navigate);
  const clearRangeRef = React.useRef(clearRange);
  const goToTodayRef = React.useRef(goToToday);
  useEffect(() => { navigateRef.current = navigate; });
  useEffect(() => { clearRangeRef.current = clearRange; });
  useEffect(() => { goToTodayRef.current = goToToday; });

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight') navigateRef.current('next');
      if (e.key === 'ArrowLeft')  navigateRef.current('prev');
      if (e.key === 'Escape')     clearRangeRef.current();
      if (e.key.toLowerCase() === 't') {
        goToTodayRef.current();
        clearRangeRef.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []); // registers once, never re-registers

  return (
    <div className="relative min-h-dvh flex flex-col bg-[#fafafa] dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 transition-colors duration-500 overflow-hidden z-0">
      
      {/* ── Ambient Accent Background ── */}
      <div 
        className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] opacity-[0.12] dark:opacity-[0.08] blur-[120px] rounded-[100%] transition-colors duration-1000 -z-10 pointer-events-none"
        style={{ background: 'var(--accent)' }}
      />
      
      {/* ── Subtle Noise Texture ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.05] -z-10 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* ── Floating Header ── */}
      <div className="pt-4 md:pt-6 px-4 md:px-8 flex justify-center w-full z-50">
        <header className="flex items-center justify-between px-5 md:px-6 py-3 w-full max-w-6xl bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-2xl shadow-sm ring-1 ring-black/5 dark:ring-white/10 transition-all">
          <div className="flex items-center gap-3 font-bold text-lg tracking-tight text-gray-800 dark:text-gray-100">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-linear-to-tr from-gray-100 to-white dark:from-gray-800 dark:to-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 font-normal">
              <span className="text-[17px] leading-none" style={{ transform: 'translateY(-1px)' }}>📅</span>
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">WallCal</span>
            <div className="hidden sm:flex ml-3 border-l border-gray-200 dark:border-gray-700/80 pl-4 h-5 items-center">
               <LiveClock />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 select-none mr-2">
              <kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm text-[10px]">←</kbd>
              <kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm text-[10px]">→</kbd>
              <span className="ml-0.5">navigate</span>
              <kbd className="ml-2 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm text-[10px]">T</kbd>
              <span className="ml-0.5">today</span>
            </div>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </header>
      </div>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 py-8 md:p-8 z-10">
        <div className="w-full max-w-5xl rounded-[26px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] bg-white/85 dark:bg-[#111111]/85 backdrop-blur-2xl border border-white/60 dark:border-white/10 ring-1 ring-black/3 dark:ring-white/2">

          {/* Spiral binding strip */}
          <div className="hidden md:flex justify-evenly items-center h-7 bg-black/2 dark:bg-white/2 border-b border-black/5 dark:border-white/5 px-10 backdrop-blur-md">
            {Array.from({ length: 22 }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-[18px] rounded-full border-[2.5px] border-white dark:border-gray-600 bg-gray-200 dark:bg-gray-800 shadow-inner binding-coil"
              />
            ))}
          </div>

          {/* 3-column body */}
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr_270px]">

            {/* Col 1 — Hero Image */}
            <HeroImage
              month={currentMonth}
              year={currentYear}
              onPrev={() => navigate('prev')}
              onNext={() => navigate('next')}
              isFlipping={isFlipping}
              flipDir={flipDir}
            />

            {/* Col 2 — Calendar Grid */}
            <section className="flex flex-col gap-3 p-5 md:p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800/80 bg-white/40 dark:bg-black/20">
              {/* Month nav */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex gap-1">
                  <button
                    onClick={goToPrevYear}
                    aria-label="Previous year"
                    className="month-nav-btn w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 transition-all duration-200"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>
                  </button>
                  <button
                    onClick={() => navigate('prev')}
                    aria-label="Previous month"
                    className="month-nav-btn w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 transition-all duration-200"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                </div>

                <div className="flex flex-col items-center leading-tight">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-2xl font-bold text-gray-800 dark:text-gray-100"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {MONTH_NAMES[currentMonth]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-gray-400 dark:text-gray-500 tracking-widest leading-none">{currentYear}</span>
                    <button 
                      onClick={() => {
                        goToToday();
                        clearRange();
                      }}
                      className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-[var(--accent)] hover:bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] transition-colors border border-gray-200 dark:border-gray-700"
                    >
                      Today
                    </button>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => navigate('next')}
                    aria-label="Next month"
                    className="month-nav-btn w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 transition-all duration-200"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                  <button
                    onClick={goToNextYear}
                    aria-label="Next year"
                    className="month-nav-btn w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 transition-all duration-200"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
                  </button>
                </div>
              </div>

              <CalendarGrid
                days={days}
                getDayState={getDayState}
                handleDayClick={handleDayClick}
                setHoverDate={setHoverDate}
              />

              <RangeInfo startDate={startDate} endDate={endDate} clearRange={clearRange} />
            </section>

            {/* Col 3 — Notes */}
            <NotesPanel
              startDate={startDate}
              endDate={endDate}
              currentMonth={currentMonth}
              currentYear={currentYear}
              notes={notes}
              draft={draft}
              setDraft={setDraft}
              addNote={addNote}
              deleteNote={deleteNote}
              monthKey={monthKey}
              makeRangeKey={makeRangeKey}
              getMonthNotes={getMonthNotes}
              getNotesForRange={getNotesForRange}
            />
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="text-center text-[11px] text-gray-400 dark:text-gray-600 py-3 border-t border-gray-200 dark:border-gray-800">
        WallCal · React + Vite + Tailwind CSS · Data saved in localStorage
      </footer>
    </div>
  );
}