# 📝 NotEmOnk

A versatile mobile-first note-taking app built with **Expo (React Native Web)** — designed for students, professionals, and anyone managing daily life.

---

## 📱 Screens

| Screen | Description |
|--------|-------------|
| **Home** | All notes, recent notes, stats, search bar, FAB |
| **Create / Edit Note** | Title input, formatting toolbar, interactive checklist |
| **Categories** | Category grid with progress bars, tag cloud |
| **Search** | Live search with highlighted results, recent searches |
| **Tasks** | Interactive checklist tasks with progress tracking |
| **Reminders** | Calendar strip, timeline-style reminder cards |

---

## 🎨 Design

- **Color Palette:** Warm parchment background `#F5F2EE`, terracotta accent `#C07850`
- **Typography:** System font (San Francisco / Roboto), clean weight hierarchy
- **Layout:** Mobile-first, max-width 430px centered on web, native on mobile

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

```bash
npm install -g expo-cli
```

---

### Installation

1. **Clone or unzip the project** and open it in VS Code:

```bash
# If cloning from GitHub:
git clone https://github.com/YOUR_USERNAME/notemOnk.git

# Navigate into the folder:
cd notemOnk
```

2. **Install dependencies:**

```bash
npm install
```

---

### Running Locally

#### 🌐 Run in Browser (Web)

```bash
npm run web
```

Then open [http://localhost:8081](http://localhost:8081) in your browser.  
For the best experience, open **Chrome DevTools → Toggle Device Toolbar** and select a mobile device (e.g. iPhone 14).

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

---

### Step 2 — Deploy to Netlify

#### Option A — Netlify CLI (fastest)

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

#### Option B — Netlify Dashboard (no CLI)

1. Push your project to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import from Git**
3. Connect your GitHub repo
4. Set the build settings:
   - **Build command:** `npm run build:web`
   - **Publish directory:** `dist`
5. Click **Deploy site**

Netlify will automatically deploy on every `git push` to your main branch.

---

## 🗂️ Project Structure

```
notemOnk/
├── App.js                        # Root component — navigation setup
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
    ├── data/
    │   └── staticData.js         # All static/mock data (notes, tasks, reminders)
    │
    ├── navigation/
    │   └── AppNavigator.js       # Bottom tab navigation
    │
    ├── components/
    │   └── NoteCard.js           # Reusable note card component
    │
    └── screens/
        ├── HomeScreen.js         # Home — stats, recent, all notes, FAB
        ├── CreateNoteScreen.js   # Create/Edit — title, toolbar, checklist
        ├── CategoriesScreen.js   # Categories grid + tags cloud
        ├── SearchScreen.js       # Search with highlighted results
        ├── TasksScreen.js        # Task checklist with progress tracking
        └── RemindersScreen.js    # Reminders with calendar strip + actions
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
| Run in browser | `npm run web` | Opens app in browser |
| Run on Android | `npm run android` | Requires Android Studio |
| Run on iOS | `npm run ios` | Requires macOS + Xcode |
| Build for web | `npm run build:web` | Generates `dist/` folder |

---


---

## 📱 Test on Your Phone (Same Wi-Fi)

You can open the app on your real phone **without any cables** while the dev server runs on your laptop.

### Step 1 — Find your laptop's local IP address

**Windows (in terminal):**
```
ipconfig
```
Look for **IPv4 Address** under your Wi-Fi adapter — it looks like `192.168.x.x`

**Mac/Linux:**
```
ifconfig | grep "inet "
```

### Step 2 — Start the dev server with your IP exposed

```bash
npm run web
```

Expo will show a local URL like:
```
› Metro waiting on http://localhost:8081
```

### Step 3 — Open on your phone

On your phone's browser, go to:
```
http://192.168.x.x:8081
```
Replace `192.168.x.x` with your actual IP from Step 1.

> ✅ Both your laptop and phone must be on the **same Wi-Fi network**.  
> 💡 Tip: Bookmark the URL on your phone for quick access.

### Optional — Use Expo Go instead

If you prefer a native app feel on your phone:
1. Install **Expo Go** ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. Run `npm start` in your terminal
3. Scan the QR code with your phone camera (iOS) or the Expo Go app (Android)

## 🎓 About

**NotEmOnk** was designed and built as a final project for a mobile application development course.  
UI/UX design wireframes by **Jan-Neo Gloria, 2BSIT-2**.

---

## 📄 License

This project is for academic purposes only.