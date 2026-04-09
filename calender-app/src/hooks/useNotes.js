import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'calendar_notes_v1';

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {}
}

export function useNotes(currentYear, currentMonth) {
  const [notes, setNotes] = useState(loadNotes);
  const [draft, setDraft] = useState('');

  // Monthly notes key
  const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  // Load draft when month changes
  useEffect(() => {
    setDraft('');
  }, [monthKey]);

  // Get notes for a date-range key
  function makeRangeKey(startDate, endDate) {
    if (!startDate) return null;
    const s = startDate.toISOString().split('T')[0];
    const e = endDate ? endDate.toISOString().split('T')[0] : s;
    return `range:${s}::${e}`;
  }

  const getNotesForRange = useCallback((startDate, endDate) => {
    const key = makeRangeKey(startDate, endDate);
    if (!key) return [];
    return notes[key] || [];
  }, [notes]);

  const getMonthNotes = useCallback(() => {
    return notes[monthKey] || [];
  }, [notes, monthKey]);

  const addNote = useCallback((text, startDate, endDate) => {
    const key = startDate ? makeRangeKey(startDate, endDate) : monthKey;
    if (!key || !text.trim()) return;
    const entry = {
      id: Date.now(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    setNotes(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), entry],
    }));
  }, [monthKey]);

  const deleteNote = useCallback((key, id) => {
    setNotes(prev => ({
      ...prev,
      [key]: (prev[key] || []).filter(n => n.id !== id),
    }));
  }, []);

  return {
    notes,
    draft,
    setDraft,
    monthKey,
    makeRangeKey,
    addNote,
    deleteNote,
    getNotesForRange,
    getMonthNotes,
  };
}
