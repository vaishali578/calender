# 📅 WallCal — Interactive Wall Calendar Component

A polished, feature-rich interactive wall calendar built for the **TUF Frontend Engineering Challenge**. Designed to emulate a physical wall calendar aesthetic while delivering a fully responsive, accessible, and delightful user experience.

---

## ✨ Features

### Core Requirements
| Feature | Details |
|---|---|
| **Wall Calendar Aesthetic** | Hero landscape photo per month with animated chevron wave overlay, spiral binding decoration, Playfair Display typography |
| **Day Range Selector** | Click a start date, hover to preview, click an end date — with distinct visual states for `start`, `end`, `in-range`, and `today` |
| **Integrated Notes** | Per-month and per-date-range notes, persisted in `localStorage`. Ctrl+Enter to save, clipboard copy, delete |
| **Fully Responsive** | 3-column desktop layout (Hero \| Calendar \| Notes) collapses to a single stacked column on mobile |

### Creative Extras (Stand-out Features)
| Feature | Details |
|---|---|
| **Page-flip Animation** | CSS 3D `rotateY` keyframe animation plays on every month navigation |
| **Dynamic Monthly Themes** | Each month has a unique accent colour — used for range highlights, weekend labels, nav buttons, and note borders |
| **Hero Photography** | Cinematic landscape photos for all twelve months |
| **Indian Holiday Markers** | Republic Day, Independence Day, Diwali, Gandhi Jayanti etc. shown as red dots with tooltips |
| **Dark / Light Mode** | System-preference auto-detect + manual toggle, persisted in `localStorage` |
| **Keyboard Navigation** | `←` `→` navigate months, `Esc` clears selection |
| **Hover Range Preview** | Dragging your cursor shows a live preview of the range before you click the end date |

---

## 🏗 Architecture

```
src/
├── hooks/
│   ├── useCalendar.js     # Month navigation, day grid generation, holiday data
│   ├── useDateRange.js    # Start/end/hover range logic with getDayState()
│   ├── useNotes.js        # CRUD notes keyed per month or date-range, localStorage
│   └── useTheme.js        # Dark/light toggle, auto-detect, persistence
│
├── components/
│   ├── HeroImage.jsx      # Month photo, chevron overlay, month/year badge, page-flip
│   ├── CalendarGrid.jsx   # 7×6 day grid with DayCell sub-component + all day states
│   └── NotesPanel.jsx     # Textarea, save/copy/delete, range badge, ruled-line aesthetics
│
├── assets/
│   ├── hero_jan.png  … hero_dec.png   # Cinematic landscape photos
│   └── ...
│
├── App.jsx            # Root shell: 3-column layout, keyboard events, accent CSS var
└── index.css          # Tailwind v4 import + keyframe animations + dynamic --accent states
```

### State Management
- **React `useState` / `useMemo` / `useCallback`** — all state is local, no external library needed
- **`localStorage`** — notes (JSON map keyed by month or date-range) and theme preference

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Installation & Dev Server

```bash
cd calender-app
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🎨 Design Decisions

### Why Tailwind CSS v4?
The project already had `@tailwindcss/vite` installed. Tailwind is ideal here because layout and spacing can be expressed declaratively in JSX without context-switching to separate CSS files. The only remaining CSS rules are **keyframe animations** and **dynamic `--accent` colour states** — things that genuinely require CSS custom properties set at runtime (the accent changes monthly).

### Dynamic Accent Colour
Instead of creating 12 separate colour themes in Tailwind config, a single CSS custom property `--accent` is set on `<html>` via `useEffect` whenever the month changes. All dynamic accent-coloured elements reference `var(--accent)` through carefully placed CSS classes in `index.css`.

### No External Calendar Library
The entire day grid computation (`useCalendar`), range logic (`useDateRange`), and date formatting is hand-rolled so the code is fully transparent and demonstrates date arithmetic competency.

### Accessibility
- All interactive elements have `aria-label`
- `aria-pressed` on selected day cells
- Keyboard navigable (arrow keys, Escape)
- Holiday tooltip via `title` attribute
- Semantic HTML: `<header>`, `<main>`, `<footer>`, `<section>`

---

## 📱 Responsive Breakpoints

| Viewport | Layout |
|---|---|
| ≥ 768px (md) | 3-column: Hero (300px) \| Calendar (flex-1) \| Notes (270px) |
| < 768px | Single column, stacked: Hero → Calendar → Notes |

---

## 🛠 Tech Stack

- **React 19** (functional components + hooks)
- **Vite 8** (dev server + build)
- **Tailwind CSS v4** (`@tailwindcss/vite` plugin)
- **localStorage** (data persistence — no backend)
- **Google Fonts** (Inter + Playfair Display)

---

## 📂 Submission

| Item | Link |
|---|---|
| Source Code | *(your GitHub repo URL)* |
| Live Demo | *(Vercel / Netlify URL after deployment)* |
| Video Demo | *(Loom / YouTube link)* |

---

*Built with care for the TUF Frontend Engineering Challenge.*
