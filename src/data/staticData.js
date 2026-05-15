export const NOTES = [
  {
    id: '1',
    title: 'Q3 Product Roadmap Strategy',
    preview:
      'Key initiatives for the quarter include feature rollout, team expansion, and the onboarding redesign. Next review on Friday…',
    date: 'Apr 20, 2026',
    category: 'Work',
    favorite: false,
    color: 'orange',
    tags: ['#urgent', '#meeting'],
  },
  {
    id: '2',
    title: 'Calculus II — Integration by Parts',
    preview:
      'Formula: ∫u dv = uv − ∫v du. Choose u using LIATE rule. Practice problems from Chapter 7, exercises 4–18…',
    date: 'Apr 21, 2026',
    category: 'School',
    favorite: false,
    color: 'green',
    tags: ['#exam'],
  },
  {
    id: '3',
    title: 'Book Recommendations',
    preview:
      '1. Atomic Habits — James Clear 2. Deep Work — Cal Newport 3. The Almanack of Naval Ravikant…',
    date: 'Apr 18, 2026',
    category: 'Personal',
    favorite: true,
    color: 'purple',
    tags: ['#reading'],
  },
  {
    id: '4',
    title: 'Weekly Grocery List',
    preview:
      '✅ Eggs · ✅ Bread · ☐ Milk · ☐ Avocados · ☐ Brown rice · ☐ Greek yogurt…',
    date: 'Apr 19, 2026',
    category: 'Tasks',
    favorite: false,
    color: 'blue',
    tags: ['#task'],
  },
  {
    id: '5',
    title: 'Notion Integration Notes',
    preview:
      'Webhook setup for Notion integration. Auth token expires every 90 days — update reminder set for July 1…',
    date: 'Apr 15, 2026',
    category: 'Tasks',
    favorite: false,
    color: 'blue',
    tags: ['#project'],
  },
  {
    id: '6',
    title: 'App Idea: AI Note Integration',
    preview:
      'Build a smart integration layer that auto-tags notes using AI. Surface related notes by context…',
    date: 'Apr 18, 2026',
    category: 'Personal',
    favorite: true,
    color: 'purple',
    tags: ['#idea'],
  },
];

export const RECENT_NOTES = [
  { id: '2', title: 'Calculus Exam', date: 'Today, 9:15 AM', emoji: '📚' },
  { id: '1', title: 'Q3 Strategy',   date: 'Yesterday',      emoji: '💼' },
  { id: '4', title: 'Groceries',     date: 'Apr 19',         emoji: '🛒' },
  { id: '6', title: 'App Idea',      date: 'Apr 18',         emoji: '💡' },
];

export const CATEGORIES = [
  { name: 'Work',     emoji: '💼', count: 7,  color: '#C07850', light: '#FFF0E8', progress: 0.70 },
  { name: 'School',  emoji: '📚', count: 5,  color: '#7BAB8B', light: '#E8F5EE', progress: 0.45 },
  { name: 'Personal',emoji: '🌿', count: 4,  color: '#8B7BAB', light: '#EEEAF6', progress: 0.30 },
  { name: 'Tasks',   emoji: '✅', count: 6,  color: '#7BA7C0', light: '#E8F0F7', progress: 0.55 },
  { name: 'Ideas',   emoji: '💡', count: 9,  color: '#C0A050', light: '#FBF6E8', progress: 0.85 },
  { name: 'Journal', emoji: '📓', count: 2,  color: '#C07070', light: '#FFEDED', progress: 0.20 },
];

export const TAGS = [
  { label: '#urgent',   color: '#C07850', light: '#FFF0E8' },
  { label: '#exam',     color: '#7BAB8B', light: '#E8F5EE' },
  { label: '#reading',  color: '#8B7BAB', light: '#EEEAF6' },
  { label: '#meeting',  color: '#7BA7C0', light: '#E8F0F7' },
  { label: '#idea',     color: '#C0A050', light: '#FBF6E8' },
  { label: '#health',   color: '#C07070', light: '#FFEDED' },
  { label: '#project',  color: '#7BAB8B', light: '#E8F5EE' },
  { label: '#deadline', color: '#C07850', light: '#FFF0E8' },
  { label: '#review',   color: '#8B7BAB', light: '#EEEAF6' },
  { label: '#travel',   color: '#C0A050', light: '#FBF6E8' },
  { label: '#recipe',   color: '#C07070', light: '#FFEDED' },
  { label: '#finance',  color: '#7BA7C0', light: '#E8F0F7' },
];

export const TASKS = [
  {
    id: 't1',
    title: 'Q3 Roadmap Tasks',
    emoji: '💼',
    badge: 'Urgent',
    badgeColor: '#C07070',
    badgeLight: '#FFEDED',
    progressColor: '#C07850',
    items: [
      { id: 'i1', text: 'Finalize Q2 retrospective report',       done: true,  sub: 'Completed · Apr 20' },
      { id: 'i2', text: 'Update project timeline in Notion',      done: true,  sub: 'Completed · Apr 21' },
      { id: 'i3', text: 'Send status update to PM',              done: true,  sub: 'Completed · Apr 21' },
      { id: 'i4', text: 'Draft roadmap slides for leadership',   done: false, sub: 'Due today · High priority' },
      { id: 'i5', text: 'Schedule engineering sync meeting',     done: false, sub: 'Due Apr 22 · Medium' },
    ],
  },
  {
    id: 't2',
    title: 'Exam Prep Checklist',
    emoji: '📚',
    badge: 'Today',
    badgeColor: '#C07850',
    badgeLight: '#FFF0E8',
    progressColor: '#7BA7C0',
    items: [
      { id: 'i6', text: 'Review Chapter 6 notes',              done: true,  sub: '' },
      { id: 'i7', text: 'Complete practice problems set A',    done: true,  sub: '' },
      { id: 'i8', text: 'Study integration by parts formula',  done: false, sub: 'Due today' },
      { id: 'i9', text: 'Complete practice problems set B',    done: false, sub: 'Due today' },
    ],
  },
];

export const COMPLETED_TASKS = [
  { id: 'c1', title: 'Grocery Shopping', emoji: '🛒', progressColor: '#7BAB8B' },
];

export const REMINDERS = [
  {
    id: 'r1',
    title: 'Submit Leadership Deck',
    note: 'Draft roadmap slides for the Q3 leadership review. Finalize data, charts, and talking points…',
    time: 'Apr 20 · 5:00 PM',
    category: 'Work',
    status: 'Overdue',
    dotColor: '#C07070',
    actions: ['Dismiss', 'Snooze', 'Mark Done'],
    primaryAction: 'Mark Done',
  },
  {
    id: 'r2',
    title: 'Calculus Exam Study Session',
    note: 'Review integration by parts and complete practice set B before tonight. Exam is tomorrow at 9 AM…',
    time: 'Today · 3:00 PM',
    category: 'School',
    status: 'Due Today',
    dotColor: '#C07850',
    actions: ['Snooze 1hr', 'Start Now'],
    primaryAction: 'Start Now',
  },
  {
    id: 'r3',
    title: 'Team Standup Notes',
    note: 'Post standup summary to Slack by end of day. Include blockers and next-day plan…',
    time: 'Today · 6:00 PM',
    category: 'Work',
    status: 'Due Today',
    dotColor: '#7BA7C0',
    actions: ['Dismiss', 'Open Note'],
    primaryAction: 'Open Note',
  },
];

export const UPCOMING_REMINDERS = [
  {
    id: 'u1',
    title: 'Doctor Appointment Prep',
    time: 'Apr 22 · 9:00 AM',
    category: 'Personal',
    status: 'Tomorrow',
    statusColor: '#7BAB8B',
    statusLight: '#E8F5EE',
    dotColor: '#7BAB8B',
  },
  {
    id: 'u2',
    title: 'Q3 Stakeholder Review',
    time: 'Apr 25 · 10:00 AM',
    category: 'Work',
    status: 'Apr 25',
    statusColor: '#C0A050',
    statusLight: '#FBF6E8',
    dotColor: '#C0A050',
  },
];

export const CALENDAR_DAYS = [
  { wd: 'Sun', dn: '19', hasDot: false, isToday: false },
  { wd: 'Mon', dn: '20', hasDot: true,  isToday: false },
  { wd: 'Tue', dn: '21', hasDot: true,  isToday: true  },
  { wd: 'Wed', dn: '22', hasDot: true,  isToday: false },
  { wd: 'Thu', dn: '23', hasDot: false, isToday: false },
  { wd: 'Fri', dn: '24', hasDot: true,  isToday: false },
  { wd: 'Sat', dn: '25', hasDot: false, isToday: false },
];

export const RECENT_SEARCHES = [
  'calculus exam notes',
  'grocery list',
  'Q3 roadmap',
  'book recommendations',
];
