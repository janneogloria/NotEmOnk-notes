import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─── Storage helpers ─────────────────────────────────────────────────────────
const STORAGE_KEY   = 'notemOnk_notes';
const REMINDERS_KEY = 'notemOnk_reminders';
const TASKS_KEY     = 'notemOnk_tasks';

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

// ─── Seed data ────────────────────────────────────────────────────────────────
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
    preview: 'Formula: ∫u dv = uv − ∫v du. Choose u using LIATE rule. Practice problems from Chapter 7…',
    date: 'Apr 21, 2026', createdAt: Date.now() - 86400000, updatedAt: Date.now() - 86400000,
    category: 'School', favorite: false, pinned: false, color: 'green',
    tags: ['#exam'], checkItems: [], reminder: null,
  },
  {
    id: '3', title: 'Book Recommendations',
    content: '1. Atomic Habits — James Clear\n2. Deep Work — Cal Newport\n3. The Almanack of Naval Ravikant',
    preview: '1. Atomic Habits — James Clear  2. Deep Work — Cal Newport  3. The Almanack of Naval Ravikant…',
    date: 'Apr 18, 2026', createdAt: Date.now() - 259200000, updatedAt: Date.now() - 259200000,
    category: 'Personal', favorite: true, pinned: false, color: 'purple',
    tags: ['#reading'], checkItems: [], reminder: null,
  },
  {
    id: '4', title: 'Weekly Grocery List',
    content: 'Eggs, Bread, Milk, Avocados, Brown rice, Greek yogurt',
    preview: '✅ Eggs · ✅ Bread · ☐ Milk · ☐ Avocados · ☐ Brown rice · ☐ Greek yogurt…',
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
    content: 'Webhook setup for Notion integration. Auth token expires every 90 days — update reminder set for July 1…',
    preview: 'Webhook setup for Notion integration. Auth token expires every 90 days — update reminder set for July 1…',
    date: 'Apr 15, 2026', createdAt: Date.now() - 518400000, updatedAt: Date.now() - 518400000,
    category: 'Tasks', favorite: false, pinned: false, color: 'blue',
    tags: ['#project'], checkItems: [], reminder: null,
  },
  {
    id: '6', title: 'App Idea: AI Note Integration',
    content: 'Build a smart integration layer that auto-tags notes using AI. Surface related notes by context…',
    preview: 'Build a smart integration layer that auto-tags notes using AI. Surface related notes by context…',
    date: 'Apr 18, 2026', createdAt: Date.now() - 259200000, updatedAt: Date.now() - 259200000,
    category: 'Personal', favorite: true, pinned: false, color: 'purple',
    tags: ['#idea'], checkItems: [], reminder: null,
  },
];

const SEED_REMINDERS = [
  {
    id: 'r1', title: 'Submit Leadership Deck',
    note: 'Draft roadmap slides for the Q3 leadership review. Finalize data, charts, and talking points…',
    time: 'Apr 20 · 5:00 PM', category: 'Work', status: 'Overdue',
    dotColor: '#C07070', actions: ['Dismiss', 'Snooze', 'Mark Done'], primaryAction: 'Mark Done', noteId: '1',
  },
  {
    id: 'r2', title: 'Calculus Exam Study Session',
    note: 'Review integration by parts and complete practice set B before tonight.',
    time: 'Today · 3:00 PM', category: 'School', status: 'Due Today',
    dotColor: '#C07850', actions: ['Snooze 1hr', 'Start Now'], primaryAction: 'Start Now', noteId: '2',
  },
  {
    id: 'r3', title: 'Team Standup Notes',
    note: 'Post standup summary to Slack by end of day. Include blockers and next-day plan…',
    time: 'Today · 6:00 PM', category: 'Work', status: 'Due Today',
    dotColor: '#7BA7C0', actions: ['Dismiss', 'Open Note'], primaryAction: 'Open Note', noteId: null,
  },
];

const SEED_TASKS = [
  {
    id: 't1', title: 'Q3 Roadmap Tasks', badge: 'Urgent',
    badgeColor: '#C07070', badgeLight: '#FFEDED', progressColor: '#C07850',
    items: [
      { id: 'i1', text: 'Finalize Q2 retrospective report', done: true,  sub: 'Completed · Apr 20' },
      { id: 'i2', text: 'Update project timeline in Notion', done: true,  sub: 'Completed · Apr 21' },
      { id: 'i3', text: 'Send status update to PM',          done: true,  sub: 'Completed · Apr 21' },
      { id: 'i4', text: 'Draft roadmap slides for leadership', done: false, sub: 'Due today · High priority' },
      { id: 'i5', text: 'Schedule engineering sync meeting',  done: false, sub: 'Due Apr 22 · Medium' },
    ],
  },
  {
    id: 't2', title: 'Exam Prep Checklist', badge: 'Today',
    badgeColor: '#C07850', badgeLight: '#FFF0E8', progressColor: '#7BA7C0',
    items: [
      { id: 'i6', text: 'Review Chapter 6 notes',             done: true,  sub: '' },
      { id: 'i7', text: 'Complete practice problems set A',   done: true,  sub: '' },
      { id: 'i8', text: 'Study integration by parts formula', done: false, sub: 'Due today' },
      { id: 'i9', text: 'Complete practice problems set B',   done: false, sub: 'Due today' },
    ],
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────
const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const [notes,     setNotes]     = useState(() => load(STORAGE_KEY,   SEED_NOTES));
  const [reminders, setReminders] = useState(() => load(REMINDERS_KEY, SEED_REMINDERS));
  const [tasks,     setTasks]     = useState(() => load(TASKS_KEY,     SEED_TASKS));

  useEffect(() => { save(STORAGE_KEY,   notes);     }, [notes]);
  useEffect(() => { save(REMINDERS_KEY, reminders); }, [reminders]);
  useEffect(() => { save(TASKS_KEY,     tasks);     }, [tasks]);

  // ── Note helpers ─────────────────────────────────────────────────────────────
  const saveNote = useCallback((noteData) => {
    const now     = Date.now();
    const dateStr = new Date(now).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const preview = (noteData.content || '').replace(/\n/g, ' ').slice(0, 120);

    if (noteData.id) {
      setNotes(prev => prev.map(n =>
        n.id === noteData.id
          ? { ...n, ...noteData, updatedAt: now, date: dateStr, preview }
          : n
      ));
    } else {
      const newNote = {
        id: String(now),
        createdAt: now, updatedAt: now, date: dateStr, preview,
        favorite: false, pinned: false,
        checkItems: [],  tags: [],  reminder: null,
        color: 'orange', category: 'Personal',
        content: '',
        ...noteData,
      };
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    }
  }, []);

  const deleteNote     = useCallback((id) => setNotes(prev => prev.filter(n => n.id !== id)), []);
  const toggleFavorite = useCallback((id) => setNotes(prev => prev.map(n => n.id === id ? { ...n, favorite: !n.favorite } : n)), []);
  const togglePin      = useCallback((id) => setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n)), []);
  const setNoteColor   = useCallback((id, color) => setNotes(prev => prev.map(n => n.id === id ? { ...n, color } : n)), []);

  const addTagToNote = useCallback((id, tag) => {
    setNotes(prev => prev.map(n =>
      n.id === id
        ? { ...n, tags: n.tags.includes(tag) ? n.tags.filter(t => t !== tag) : [...n.tags, tag] }
        : n
    ));
  }, []);

  const setNoteReminder = useCallback((noteId, reminderTime) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, reminder: reminderTime } : n));
  }, []);

  // Derived
  const recentNotes   = [...notes].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, 4);
  const favoriteNotes = notes.filter(n => n.favorite);
  const stats = {
    total:          notes.length,
    favorites:      favoriteNotes.length,
    remindersCount: reminders.length,
    tasks:          tasks.reduce((s, t) => s + t.items.length, 0),
  };

  // ── Reminder helpers ─────────────────────────────────────────────────────────
  const addReminder    = useCallback((rem)  => setReminders(prev => [{ ...rem, id: 'r_' + Date.now() }, ...prev]), []);
  const dismissReminder = useCallback((id) => setReminders(prev => prev.filter(r => r.id !== id)), []);
  const markReminderDone = useCallback((id) => setReminders(prev => prev.filter(r => r.id !== id)), []);
  const snoozeReminder = useCallback((id)  => setReminders(prev => prev.filter(r => r.id !== id)), []);

  // ── Task helpers ─────────────────────────────────────────────────────────────
  const toggleTaskItem = useCallback((taskId, itemId) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, items: task.items.map(item => item.id === itemId ? { ...item, done: !item.done } : item) }
        : task
    ));
  }, []);

  const addTaskItem = useCallback((taskId, text) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, items: [...task.items, { id: 'item_' + Date.now(), text, done: false, sub: '' }] }
        : task
    ));
  }, []);

  const addTaskList = useCallback((title, badge, badgeColor, badgeLight, progressColor) => {
    setTasks(prev => [{
      id: 'task_' + Date.now(), title, badge, badgeColor, badgeLight, progressColor, items: [],
    }, ...prev]);
  }, []);

  return (
    <NotesContext.Provider value={{
      notes, recentNotes, favoriteNotes, stats,
      saveNote, deleteNote, toggleFavorite, togglePin, setNoteColor, addTagToNote, setNoteReminder,
      reminders, addReminder, dismissReminder, markReminderDone, snoozeReminder,
      tasks, toggleTaskItem, addTaskItem, addTaskList,
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