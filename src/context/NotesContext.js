import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY   = 'notemOnk_notes';
const REMINDERS_KEY = 'notemOnk_reminders';

function load(key, fallback) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    }
  } catch (_) {}
  return fallback;
}

function save(key, value) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (_) {}
}

const SEED_NOTES = [
  {
    id: '1', title: 'Q3 Product Roadmap Strategy',
    content: 'Key initiatives for Q3 include feature rollout, team expansion, and the onboarding redesign project.',
    preview: 'Key initiatives for Q3 include feature rollout, team expansion, and the onboarding redesign project.',
    date: 'Apr 20, 2026', createdAt: Date.now() - 172800000, updatedAt: Date.now() - 172800000,
    category: 'Work', favorite: false, pinned: false, color: 'orange',
    tags: ['#urgent', '#meeting'],
    checkItems: [
      { id: 'ci1', text: 'Finalize Q2 retrospective report', done: true },
      { id: 'ci2', text: 'Update project timeline in Notion', done: true },
      { id: 'ci3', text: 'Draft roadmap slides for leadership deck', done: false },
      { id: 'ci4', text: 'Collect feedback from design team', done: false },
      { id: 'ci5', text: 'Schedule sync with engineering leads', done: false },
    ],
    reminder: null,
  },
  {
    id: '2', title: 'Calculus II — Integration by Parts',
    content: 'Formula: ∫u dv = uv − ∫v du. Choose u using LIATE rule. Practice problems from Chapter 7, exercises 4–18…',
    preview: 'Formula: ∫u dv = uv − ∫v du. Choose u using LIATE rule.',
    date: 'Apr 21, 2026', createdAt: Date.now() - 86400000, updatedAt: Date.now() - 86400000,
    category: 'School', favorite: false, pinned: false, color: 'green',
    tags: ['#exam'], checkItems: [], reminder: null,
  },
  {
    id: '3', title: 'Book Recommendations',
    content: '1. Atomic Habits — James Clear\n2. Deep Work — Cal Newport\n3. The Almanack of Naval Ravikant',
    preview: '1. Atomic Habits — James Clear  2. Deep Work — Cal Newport',
    date: 'Apr 18, 2026', createdAt: Date.now() - 259200000, updatedAt: Date.now() - 259200000,
    category: 'Personal', favorite: true, pinned: false, color: 'purple',
    tags: ['#reading'], checkItems: [], reminder: null,
  },
  {
    id: '4', title: 'Weekly Grocery List',
    content: 'Eggs, Bread, Milk, Avocados, Brown rice, Greek yogurt',
    preview: 'Eggs · Bread · Milk · Avocados · Brown rice · Greek yogurt',
    date: 'Apr 19, 2026', createdAt: Date.now() - 172800000, updatedAt: Date.now() - 172800000,
    category: 'Tasks', favorite: false, pinned: false, color: 'blue',
    tags: ['#task'],
    checkItems: [
      { id: 'gi1', text: 'Eggs', done: true },
      { id: 'gi2', text: 'Bread', done: true },
      { id: 'gi3', text: 'Milk', done: false },
      { id: 'gi4', text: 'Avocados', done: false },
      { id: 'gi5', text: 'Brown rice', done: false },
    ],
    reminder: null,
  },
  {
    id: '5', title: 'Notion Integration Notes',
    content: 'Webhook setup for Notion integration. Auth token expires every 90 days.',
    preview: 'Webhook setup for Notion integration. Auth token expires every 90 days.',
    date: 'Apr 15, 2026', createdAt: Date.now() - 518400000, updatedAt: Date.now() - 518400000,
    category: 'Tasks', favorite: false, pinned: false, color: 'blue',
    tags: ['#project'], checkItems: [], reminder: null,
  },
  {
    id: '6', title: 'App Idea: AI Note Integration',
    content: 'Build a smart integration layer that auto-tags notes using AI.',
    preview: 'Build a smart integration layer that auto-tags notes using AI.',
    date: 'Apr 18, 2026', createdAt: Date.now() - 259200000, updatedAt: Date.now() - 259200000,
    category: 'Personal', favorite: true, pinned: false, color: 'purple',
    tags: ['#idea'], checkItems: [], reminder: null,
  },
];

const SEED_REMINDERS = [
  {
    id: 'r1', title: 'Submit Leadership Deck',
    note: 'Draft roadmap slides for the Q3 leadership review.',
    time: 'Apr 20 · 5:00 PM', category: 'Work', status: 'Overdue',
    dotColor: '#C07070', noteId: '1',
  },
  {
    id: 'r2', title: 'Calculus Exam Study Session',
    note: 'Review integration by parts and complete practice set B.',
    time: 'Today · 3:00 PM', category: 'School', status: 'Due Today',
    dotColor: '#C07850', noteId: '2',
  },
  {
    id: 'r3', title: 'Team Standup Notes',
    note: 'Post standup summary to Slack by end of day.',
    time: 'Today · 6:00 PM', category: 'Work', status: 'Due Today',
    dotColor: '#7BA7C0', noteId: null,
  },
];

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const [notes,     setNotes]     = useState(() => load(STORAGE_KEY,   SEED_NOTES));
  const [reminders, setReminders] = useState(() => load(REMINDERS_KEY, SEED_REMINDERS));

  useEffect(() => { save(STORAGE_KEY,   notes);     }, [notes]);
  useEffect(() => { save(REMINDERS_KEY, reminders); }, [reminders]);

  // ── Notes ──────────────────────────────────────────────────────────────────
  const saveNote = useCallback((noteData) => {
    const now     = Date.now();
    const dateStr = new Date(now).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    // Accept either checkItems (context) or checklist (CreateNoteScreen local state)
    const checkItems = noteData.checkItems ?? noteData.checklist ?? [];
    const preview = (noteData.content || '').replace(/\n/g, ' ').slice(0, 120);

    if (noteData.id) {
      setNotes(prev => prev.map(n =>
        n.id === noteData.id
          ? { ...n, ...noteData, checkItems, updatedAt: now, date: dateStr, preview }
          : n
      ));
    } else {
      const newNote = {
        id: String(now),
        createdAt: now, updatedAt: now, date: dateStr, preview,
        favorite: false, pinned: false,
        checkItems: [], tags: [], reminder: null,
        color: 'orange', category: 'Personal',
        content: '',
        ...noteData,
        checkItems,
      };
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    }
  }, []);

  const deleteNote = useCallback((id) =>
    setNotes(prev => prev.filter(n => n.id !== id)), []);

  const toggleFavorite = useCallback((id) =>
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, favorite: !n.favorite } : n
    )), []);

  const togglePin = useCallback((id) =>
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, pinned: !n.pinned } : n
    )), []);

  // Toggle a checkItem inside a note (used by TasksScreen)
  const toggleCheckItem = useCallback((noteId, itemId) => {
    setNotes(prev => prev.map(n =>
      n.id === noteId
        ? {
            ...n,
            checkItems: (n.checkItems || []).map(i =>
              i.id === itemId ? { ...i, done: !i.done } : i
            ),
          }
        : n
    ));
  }, []);

  // Add a new checkItem to a note (used by TasksScreen)
  const addCheckItemToNote = useCallback((noteId, text) => {
    setNotes(prev => prev.map(n =>
      n.id === noteId
        ? {
            ...n,
            checkItems: [
              ...(n.checkItems || []),
              { id: 'ci_' + Date.now(), text, done: false },
            ],
          }
        : n
    ));
  }, []);

  // ── Reminders ──────────────────────────────────────────────────────────────
  const addReminder = useCallback((rem) =>
    setReminders(prev => [{ ...rem, id: 'r_' + Date.now() }, ...prev]), []);

  const dismissReminder  = useCallback((id) =>
    setReminders(prev => prev.filter(r => r.id !== id)), []);

  const markReminderDone = useCallback((id) =>
    setReminders(prev => prev.filter(r => r.id !== id)), []);

  const snoozeReminder   = useCallback((id) =>
    setReminders(prev => prev.filter(r => r.id !== id)), []);

  // ── Derived ────────────────────────────────────────────────────────────────
  const recentNotes   = [...notes].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, 5);
  const favoriteNotes = notes.filter(n => n.favorite);
  const pinnedNotes   = notes.filter(n => n.pinned);
  const taskNotes     = notes.filter(n => Array.isArray(n.checkItems) && n.checkItems.length > 0);

  const stats = {
    total:     notes.length,
    favorites: favoriteNotes.length,
    reminders: reminders.length,
    tasks:     taskNotes.length,
  };

  return (
    <NotesContext.Provider value={{
      notes,
      recentNotes,
      favoriteNotes,
      pinnedNotes,
      taskNotes,
      stats,
      saveNote,
      deleteNote,
      toggleFavorite,
      togglePin,
      toggleCheckItem,
      addCheckItemToNote,
      reminders,
      addReminder,
      dismissReminder,
      markReminderDone,
      snoozeReminder,
    }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used inside NotesProvider');
  return ctx;
}