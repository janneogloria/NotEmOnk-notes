# 📝 NotEmOnk

A versatile mobile-first note-taking app built with **Expo (React Native Web)** — designed for students, professionals, and anyone managing daily life.

---

## 📱 Screens

| Screen | Description |
|--------|-------------|
| **Home** | All notes, recent strip, favorites, pinned tabs, live stats, search bar, FAB |
| **Create / Edit Note** | Title input, formatting toolbar, interactive checklist, category, tags, pin, favorite, color, reminder chips |
| **Categories** | Category grid with note counts, filterable by category |
| **Search** | Live search by title, content, tags, and category with highlighted results |
| **Tasks** | Checklist tasks pulled from notes — toggle items, add new items, progress tracking |
| **Reminders** | Grouped by Overdue / Due Today / Upcoming — dismiss, snooze, and mark done |

---

## ✅ What's Functional (Phase 2)

### State & Persistence
- All notes, reminders, and task data persist via **localStorage** — no data is lost on refresh
- Global state managed through **React Context** (`NotesContext`) with seed data on first load
- Notes are the single source of truth — tasks and reminders are derived from notes

### Home Screen
- Four tabs: **All Notes**, **Recent**, **Favorites**, **Pinned** — all update dynamically
- Live stats bar: total notes, favorites, reminders, and task lists
- Recent notes horizontal strip (most recently updated first)
- Tapping any note opens it in the editor

### Create / Edit Note
- **Save** button writes to context and localStorage
- **Category** chip — modal picker (Work, School, Personal, Tasks, Ideas, Journal)
- **Add Tag** chip — modal with toggle selection; selected tags shown on note card
- **Remind** chip — picks from 6 time options; reminder persists to note
- **Pin** chip — toggles instantly, shown with 📌 on note card
- **Favorite** chip — toggles instantly, star fills yellow on note card
- **Color** chip — color picker modal; top bar and save button reflect the chosen color
- **Checklist** — add, toggle, and remove checklist items inline
- Removed from UI entirely: Photo, File, Audio, Location, Draw

### Tasks Screen
- Reads `checkItems` directly from notes — no separate data store
- Toggle any item done/undone (persists immediately)
- Add new items inline per task list
- Progress bar and percentage per note
- Tapping the note title opens it in the editor

### Reminders Screen
- Reminders grouped into **Overdue**, **Due Today**, and **Upcoming** sections
- **Dismiss**, **Snooze**, and **Done** buttons all functional — remove reminder from list and persist
- **Open Note** button navigates to the linked note in the editor

### Favorites & Pinned
- Favorite toggle works from both the note card star and the chip inside the editor
- Pinned notes appear in the Pinned tab on the home screen

### Search
- Searches title, content, tags, and category in real time

### Categories
- Counts real notes per category; tap to filter and see matching notes

---

## 🎨 Design

- **Color Palette:** Warm parchment background `#F5F2EE`, terracotta accent `#C07850`
- **Note colors:** Orange, Green, Purple, Blue, Gold, Red — reflected on card left bar and editor top bar
- **Typography:** System font (San Francisco / Roboto), clean weight hierarchy
- **Layout:** Mobile-first, max-width 430px centered on web, native on mobile

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

```bash
npm install -g expo-cli
```

### Installation

1. **Clone or unzip the project** and open it in VS Code:

```bash
git clone https://github.com/YOUR_USERNAME/notemOnk.git
cd notemOnk
```

2. **Install dependencies:**

```bash
npm install
```

### Running Locally

#### 🌐 Run in Browser (Web)

```bash
npm run web
```

Open [http://localhost:8081](http://localhost:8081) in your browser. For best results, open **Chrome DevTools → Toggle Device Toolbar** and select a mobile device (e.g. iPhone 14).

> If you get a blank white screen after replacing files, clear Metro's cache:
> ```bash
> npm run web -- --clear
> ```

#### 📱 Run on Mobile (Expo Go App)

1. Install **Expo Go** on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Run:
```bash
npm start
```

3. Scan the QR code shown in the terminal with your phone camera (iOS) or Expo Go (Android).

---

## 📦 Building for Web (Netlify)

### Step 1 — Build the web bundle

```bash
npm run build:web
```

This generates a `dist/` folder with the production-ready web app.

### Step 2 — Deploy to Netlify

#### Option A — Netlify CLI (fastest)

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

#### Option B — Netlify Dashboard

1. Push your project to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import from Git**
3. Connect your GitHub repo
4. Set build settings:
   - **Build command:** `npm run build:web`
   - **Publish directory:** `dist`
5. Click **Deploy site**

---

## 🗂️ Project Structure

```
notemOnk/
├── App.js                        # Root — wraps app in NotesProvider + NavigationContainer
├── app.json                      # Expo configuration
├── netlify.toml                  # Netlify deployment config
├── package.json                  # Dependencies and scripts
│
├── assets/                       # App icons and splash screens
│
└── src/
    ├── constants/
    │   └── theme.js              # Colors, fonts, shadows, radius values
    │
    ├── context/
    │   └── NotesContext.js       # Global state + localStorage persistence
    │
    ├── data/
    │   └── staticData.js         # Seed/mock data (used as fallback only)
    │
    ├── navigation/
    │   └── AppNavigator.js       # Bottom tab navigation
    │
    ├── components/
    │   └── NoteCard.js           # Reusable note card (title, preview, tags, favorite toggle)
    │
    └── screens/
        ├── HomeScreen.js         # Home — tabs, stats, recent strip, notes list, FAB
        ├── CreateNoteScreen.js   # Create/Edit — all chips functional, checklist, save
        ├── CategoriesScreen.js   # Category filter grid
        ├── SearchScreen.js       # Real-time search across all note fields
        ├── TasksScreen.js        # Task lists from notes — toggle, add items, progress
        └── RemindersScreen.js    # Grouped reminders — dismiss, snooze, done, open note
```

---

## 🗃️ Data Model

Each note stored in localStorage follows this shape:

```js
{
  id: string,           // timestamp string
  title: string,
  content: string,
  preview: string,      // auto-generated from content (first 120 chars)
  date: string,         // formatted display date
  createdAt: number,    // Unix timestamp
  updatedAt: number,    // Unix timestamp
  category: string,     // 'Work' | 'School' | 'Personal' | 'Tasks' | 'Ideas' | 'Journal'
  color: string,        // 'orange' | 'green' | 'purple' | 'blue' | 'gold' | 'red'
  tags: string[],       // e.g. ['#urgent', '#exam']
  favorite: boolean,
  pinned: boolean,
  reminder: string | null,  // reminder label string or null
  checkItems: [             // checklist items
    { id: string, text: string, done: boolean }
  ]
}
```

---

## 📚 Key Dependencies

| Package | Purpose |
|---------|---------|
| `expo` | Development framework for React Native |
| `react-native` | Core mobile UI framework |
| `@react-navigation/native` | Navigation library |
| `@react-navigation/bottom-tabs` | Bottom tab bar navigation |
| `@react-navigation/stack` | Stack (page push) navigation |
| `react-native-safe-area-context` | Safe area handling (notch, home bar) |
| `react-native-screens` | Native screen optimization |
| `react-native-gesture-handler` | Gesture support for navigation |

---

## 🛠️ Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Start dev server | `npm start` | Opens Expo dev tools |
| Run in browser | `npm run web` | Opens app in browser at localhost:8081 |
| Run on Android | `npm run android` | Requires Android Studio |
| Run on iOS | `npm run ios` | Requires macOS + Xcode |
| Build for web | `npm run build:web` | Generates `dist/` folder |
| Clear cache & run | `npm run web -- --clear` | Use after replacing files to clear Metro cache |

---

## 📱 Test on Your Phone (Same Wi-Fi)

### Step 1 — Find your laptop's local IP

**Windows:**
```
ipconfig
```
Look for **IPv4 Address** under your Wi-Fi adapter — e.g. `192.168.x.x`

**Mac/Linux:**
```
ifconfig | grep "inet "
```

### Step 2 — Start the dev server

```bash
npm run web
```

### Step 3 — Open on your phone

```
http://192.168.x.x:8081
```

> ✅ Both devices must be on the **same Wi-Fi network**.

### Optional — Expo Go

1. Install **Expo Go** ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. Run `npm start`
3. Scan the QR code

---

## 🎓 About

**NotEmOnk** was designed and built as a final project for a mobile application development course.
UI/UX design and development by **Jan-Neo Gloria, 2BSIT-2**.

---

## 📄 License

This project is for academic purposes only.