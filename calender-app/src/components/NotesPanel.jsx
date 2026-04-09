import React, { useRef } from 'react';
import { MONTH_NAMES } from '../hooks/useCalendar';

function formatDate(date) {
  if (!date) return null;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function NoteItem({ note, noteKey, onDelete }) {
  return (
    <div className="note-item-anim note-accent-border flex flex-col gap-1.5 px-3 py-2.5 rounded-xl border-l-[3px] bg-white dark:bg-gray-800 shadow-sm hover:translate-x-0.5 transition-transform duration-150">
      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200 whitespace-pre-wrap wrap-break-word">
        {note.text}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-400 dark:text-gray-500">
          {new Date(note.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </span>
        <button
          onClick={() => onDelete(noteKey, note.id)}
          aria-label="Delete note"
          className="flex items-center justify-center w-6 h-6 rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 transition-colors duration-150"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6M9 6V4h6v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function NotesPanel({
  startDate, endDate, currentMonth, currentYear,
  draft, setDraft, addNote, deleteNote,
  monthKey, makeRangeKey, getMonthNotes, getNotesForRange,
}) {
  const textareaRef = useRef(null);

  const rangeKey = makeRangeKey(startDate, endDate);
  const rangeNotes = startDate ? getNotesForRange(startDate, endDate) : [];
  const monthNotes = getMonthNotes();
  const hasRange = !!startDate;

  const rangeLabel = hasRange
    ? endDate && endDate.getTime() !== startDate.getTime()
      ? `${formatDate(startDate)} – ${formatDate(endDate)}`
      : formatDate(startDate)
    : null;

  const activeKey = hasRange ? rangeKey : monthKey;
  const activeNotes = hasRange ? rangeNotes : monthNotes;

  function handleAdd() {
    if (!draft.trim()) return;
    addNote(draft, startDate || null, endDate || null);
    setDraft('');
    textareaRef.current?.focus();
  }

  function handleKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  }

  function handleCopy() {
    const txt = activeNotes.map(n => n.text).join('\n');
    if (txt) navigator.clipboard?.writeText(txt);
  }

  function handleExport() {
    const txt = activeNotes.map(n => `[${new Date(n.createdAt).toLocaleString()}]\n${n.text}\n`).join('\n');
    if (!txt) return;
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WallCal-Notes-${hasRange ? 'Range' : MONTH_NAMES[currentMonth]}-${currentYear}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-3 p-5 md:p-6 bg-white/40 dark:bg-black/20 overflow-auto">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="w-4 h-4 shrink-0" style={{ color: 'var(--accent)' }}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-100"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Notes
          </h2>
        </div>

        {rangeLabel ? (
          <span className="range-badge inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit border">
            📅 {rangeLabel}
          </span>
        ) : (
          <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium tracking-wide">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>
        )}
      </div>


      <div className="flex flex-col gap-2 py-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-px bg-gray-200 dark:bg-gray-600/60 rounded" />
        ))}
      </div>


      <div className="flex flex-col gap-2">
        <textarea
          ref={textareaRef}
          className="notes-textarea w-full px-3.5 py-3 rounded-xl border border-black/10 dark:border-white/10
            bg-white/60 dark:bg-black/40 backdrop-blur-md shadow-sm text-gray-800 dark:text-gray-100
            text-sm leading-relaxed resize-y min-h-[70px] transition-all duration-200
            placeholder-gray-400 dark:placeholder-gray-500"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={hasRange
            ? `Add note for ${rangeLabel}…`
            : `Add note for ${MONTH_NAMES[currentMonth]}…`}
          rows={3}
          aria-label="Note text"
        />

        <div className="flex items-center justify-between gap-2 mt-1">
          <span className="text-[10px] text-gray-400 dark:text-gray-500">Ctrl+↵ to save</span>
          <div className="flex items-center gap-1.5">
            {activeNotes.length > 0 && (
              <>
                <button
                  onClick={handleExport}
                  title="Export to TXT"
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-150"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                </button>
                <button
                  onClick={handleCopy}
                  title="Copy all notes"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-150"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy
                </button>
              </>
            )}
            <button
              onClick={handleAdd}
              disabled={!draft.trim()}
              className="btn-accent px-3 py-1.5 rounded-lg text-[12px] font-semibold
                transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              + Save Note
            </button>
          </div>
        </div>
      </div>

      {/* Notes list */}
      <div className="flex flex-col gap-2 overflow-y-auto flex-1">
        {activeNotes.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-gray-400 dark:text-gray-500 text-xs text-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 opacity-60">
              <path d="M9 12h6m-3-3v6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
            <span>{hasRange ? 'No notes for this range' : 'No notes this month'}</span>
          </div>
        ) : (
          activeNotes.map(n => (
            <NoteItem key={n.id} note={n} noteKey={activeKey} onDelete={deleteNote} />
          ))
        )}
      </div>
    </div>
  );
}
