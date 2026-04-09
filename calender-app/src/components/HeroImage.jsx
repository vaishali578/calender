import React from 'react';
import heroJan from '../assets/hero_jan.png';
import heroFeb from '../assets/hero_feb.png';
import heroMar from '../assets/hero_mar.png';
import heroApr from '../assets/hero_apr.png';
import heroMay from '../assets/hero_may.png';
import heroJun from '../assets/hero_jun.png';
import heroJul from '../assets/hero_jul.png';
import heroAug from '../assets/hero_aug.png';
import heroSep from '../assets/hero_sep.png';
import heroOct from '../assets/hero_oct.png';
import heroNov from '../assets/hero_nov.png';
import heroDec from '../assets/hero_dec.png';
import { MONTH_NAMES } from '../hooks/useCalendar';

export const MONTH_THEMES = [
  { img: heroJan, accent: '#3b9eff', gradient: 'linear-gradient(135deg,#1a2a6c,#2196f3,#90caf9)' },
  { img: heroFeb, accent: '#e040fb', gradient: 'linear-gradient(135deg,#4a148c,#ce93d8,#f8bbd0)' },
  { img: heroMar, accent: '#f06292', gradient: 'linear-gradient(135deg,#880e4f,#f06292,#ffe0b2)' },
  { img: heroApr, accent: '#66bb6a', gradient: 'linear-gradient(135deg,#1b5e20,#66bb6a,#c8e6c9)' },
  { img: heroMay, accent: '#ffb300', gradient: 'linear-gradient(135deg,#e65100,#ffb300,#fff9c4)' },
  { img: heroJun, accent: '#26c6da', gradient: 'linear-gradient(135deg,#006064,#26c6da,#b2ebf2)' },
  { img: heroJul, accent: '#ef6c00', gradient: 'linear-gradient(135deg,#bf360c,#ef6c00,#ffcc80)' },
  { img: heroAug, accent: '#29b6f6', gradient: 'linear-gradient(135deg,#01579b,#29b6f6,#e1f5fe)' },
  { img: heroSep, accent: '#ff7043', gradient: 'linear-gradient(135deg,#bf360c,#ff7043,#ffccbc)' },
  { img: heroOct, accent: '#ab47bc', gradient: 'linear-gradient(135deg,#4a148c,#ab47bc,#e1bee7)' },
  { img: heroNov, accent: '#8d6e63', gradient: 'linear-gradient(135deg,#3e2723,#8d6e63,#d7ccc8)' },
  { img: heroDec, accent: '#78909c', gradient: 'linear-gradient(135deg,#263238,#78909c,#cfd8dc)' },
];

export function HeroImage({ month, year, onPrev, onNext, isFlipping, flipDir }) {
  const theme = MONTH_THEMES[month];

  return (
    <div
      className={`relative overflow-hidden border-r border-black/5 dark:border-white/5 flex flex-col perspective-1000
        ${isFlipping ? (flipDir === 'next' ? 'flipping-next' : 'flipping-prev') : ''}`}
      style={{ perspective: '1200px' }}
    >
      <div className="flex justify-evenly items-center h-[22px] bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/5 px-6 shrink-0 backdrop-blur-md relative z-20">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="w-[5px] h-[5px] rounded-full bg-white dark:bg-[#111111] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] opacity-90"
          />
        ))}
      </div>
      <div className="relative flex-1 overflow-hidden min-h-[260px] group">
        {theme.img ? (
          <img
            src={theme.img}
            alt={MONTH_NAMES[month]}
            className="w-full h-full object-cover block transition-transform duration-500 ease-in-out hero-photo"
          />
        ) : (
          <div className="w-full h-full absolute inset-0" style={{ background: theme.gradient }} />
        )}
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none">
          <svg viewBox="0 0 600 80" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M0,80 L0,40 L200,80 L400,10 L600,60 L600,80 Z"
              fill={theme.accent}
              opacity="0.92"
            />
          </svg>
        </div>

        <div className="absolute bottom-3 right-4 flex flex-col items-end z-10">
          <span className="text-white/90 text-sm font-light tracking-[3px] leading-none">
            {year}
          </span>
          <span
            className="text-white text-3xl font-bold leading-tight tracking-tight drop-shadow-lg"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {MONTH_NAMES[month].toUpperCase()}
          </span>
        </div>

        <button
          onClick={onPrev}
          aria-label="Previous month"
          className="hero-nav-btn absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/25 backdrop-blur-sm text-white transition-all duration-200 hover:scale-110 z-10"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          onClick={onNext}
          aria-label="Next month"
          className="hero-nav-btn absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/25 backdrop-blur-sm text-white transition-all duration-200 hover:scale-110 z-10"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
