# 🚀 Awliya – Parents Porter | Project Roadmap

> **Tech Stack**: Next.js (App Router) · TypeScript · Tailwind CSS · Supabase (later) · localStorage (Phase 1)

---

## 📐 Project Architecture

```
src/
├── app/                          # Next.js App Router (Pages & API Routes)
│   ├── (auth)/                   # Auth group layout (login, register, forgot-password)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   │
│   ├── (dashboard)/              # Protected dashboard group layout
│   │   ├── layout.tsx            # Sidebar + Topbar wrapper
│   │   ├── page.tsx              # Dashboard home
│   │   ├── children/             # Children management
│   │   │   ├── page.tsx          # List children
│   │   │   └── [id]/page.tsx     # Single child profile
│   │   ├── grades/page.tsx       # Grades & academic progress
│   │   ├── attendance/page.tsx   # Attendance tracking
│   │   ├── messages/page.tsx     # Messages / notifications
│   │   ├── schedule/page.tsx     # Timetable / calendar
│   │   ├── payments/page.tsx     # Payments & invoices
│   │   └── settings/page.tsx     # Profile & settings
│   │
│   ├── api/                      # Backend API Routes (Next.js Route Handlers)
│   │   ├── auth/route.ts         # Auth endpoints
│   │   ├── children/route.ts     # Children CRUD
│   │   ├── grades/route.ts       # Grades fetch
│   │   ├── attendance/route.ts   # Attendance fetch
│   │   ├── messages/route.ts     # Messages CRUD
│   │   ├── schedule/route.ts     # Schedule fetch
│   │   └── payments/route.ts     # Payments fetch
│   │
│   ├── layout.tsx                # Root layout (fonts, metadata, providers)
│   ├── page.tsx                  # Landing page
│   ├── globals.css               # Global styles
│   └── favicon.ico
│
├── components/                   # Reusable UI Components
│   ├── ui/                       # Base UI primitives (Button, Card, Input, Modal, etc.)
│   ├── layout/                   # Layout components (Sidebar, Topbar, Footer)
│   ├── dashboard/                # Dashboard-specific widgets
│   └── shared/                   # Shared components (LoadingSpinner, EmptyState, etc.)
│
├── lib/                          # Utility & config layer
│   ├── localStorage.ts           # Phase 1: localStorage helpers (get/set/remove)
│   ├── supabase.ts               # Phase 2: Supabase client (for later)
│   ├── utils.ts                  # General utility functions
│   └── constants.ts              # App-wide constants (routes, keys, etc.)
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Auth state hook
│   ├── useLocalStorage.ts        # localStorage hook
│   └── useChildren.ts            # Children data hook
│
├── types/                        # TypeScript type definitions
│   ├── index.ts                  # Barrel export
│   ├── user.ts                   # User / Parent types
│   ├── child.ts                  # Child profile types
│   ├── grade.ts                  # Grades types
│   ├── attendance.ts             # Attendance types
│   ├── message.ts                # Message types
│   ├── schedule.ts               # Schedule types
│   └── payment.ts                # Payment types
│
├── context/                      # React Context providers
│   ├── AuthContext.tsx            # Auth provider (localStorage-based for Phase 1)
│   └── ThemeContext.tsx           # Theme provider (dark/light mode)
│
└── data/                         # Mock data (Phase 1 only)
    ├── mockUsers.ts
    ├── mockChildren.ts
    ├── mockGrades.ts
    └── mockSchedule.ts
```

---

## 🗺️ Development Phases

### ✅ Phase 0 — Project Setup (CURRENT)
- [x] Initialize Next.js with TypeScript, Tailwind CSS, App Router, `src/` directory
- [ ] Create folder structure (components, lib, hooks, types, context, data)
- [ ] Set up global styles, fonts, and design tokens
- [ ] Create base UI components (Button, Card, Input, etc.)
- [ ] Set up localStorage utility layer

---

### 🔐 Phase 1 — Authentication (localStorage)
- [ ] Design & build **Login** page (email + password)
- [ ] Design & build **Register** page
- [ ] Design & build **Forgot Password** page
- [ ] Create `AuthContext` with localStorage persistence
- [ ] Build protected route middleware/wrapper
- [ ] Store mock users in localStorage

---

### 🏠 Phase 2 — Dashboard & Layout
- [ ] Build **Sidebar** navigation component
- [ ] Build **Topbar** with user avatar, notifications bell, search
- [ ] Build **Dashboard Home** page with summary cards:
  - Children count
  - Upcoming events
  - Unread messages
  - Quick stats (attendance %, grades avg)
- [ ] Implement responsive layout (mobile hamburger menu)

---

### 👨‍👩‍👧‍👦 Phase 3 — Children Management
- [ ] **Children List** page with cards/table
- [ ] **Child Profile** page (name, class, photo, grades overview)
- [ ] Add/Edit child form (modal or page)
- [ ] Store children data in localStorage

---

### 📊 Phase 4 — Grades & Attendance
- [ ] **Grades** page — per child, per subject view
- [ ] Grade charts / progress visualization
- [ ] **Attendance** page — calendar or table view
- [ ] Attendance statistics & trends

---

### 💬 Phase 5 — Messages & Notifications
- [ ] **Messages** page — inbox/outbox layout
- [ ] Compose new message
- [ ] Read message detail
- [ ] Notification bell with unread count

---

### 📅 Phase 6 — Schedule & Calendar
- [ ] **Schedule** page — weekly timetable view
- [ ] Calendar with events
- [ ] Event detail modal

---

### 💳 Phase 7 — Payments
- [ ] **Payments** page — invoices list
- [ ] Payment status (paid, pending, overdue)
- [ ] Payment history

---

### ⚙️ Phase 8 — Settings & Profile
- [ ] **Settings** page — update profile, change password
- [ ] Theme toggle (dark/light mode)
- [ ] Language toggle (if multilingual)

---

### 🔄 Phase 9 — Supabase Migration
- [ ] Set up Supabase project & database schema
- [ ] Replace localStorage with Supabase client
- [ ] Implement Supabase Auth (email/password, OAuth)
- [ ] Migrate all data operations to Supabase
- [ ] Add Row Level Security (RLS) policies
- [ ] Real-time subscriptions for messages/notifications

---

### 🚀 Phase 10 — Polish & Deploy
- [ ] SEO optimization (meta tags, OG tags)
- [ ] Performance optimization (lazy loading, image optimization)
- [ ] Error boundaries & fallback UI
- [ ] Loading skeletons throughout the app
- [ ] Deploy to Vercel
- [ ] Custom domain setup

---

## 🎨 Design Principles
| Principle | Implementation |
|-----------|---------------|
| **Premium Feel** | Dark mode, glassmorphism, smooth gradients, modern typography (Inter/Geist) |
| **Mobile First** | Responsive across all breakpoints, touch-friendly |
| **Micro-animations** | Hover effects, page transitions, skeleton loaders |
| **Accessibility** | Semantic HTML, ARIA labels, keyboard navigation |
| **RTL Support** | Ready for Arabic language (if needed) |

---

## 📦 Key Dependencies
| Package | Purpose |
|---------|---------|
| `next` | Full-stack React framework |
| `typescript` | Type safety |
| `tailwindcss` | Utility-first CSS |
| `lucide-react` | Icon library |
| `framer-motion` | Animations |
| `@supabase/supabase-js` | Database (Phase 9) |
| `recharts` | Charts/graphs (Phase 4) |
| `date-fns` | Date formatting |

---

> **Next Step**: Once you validate this roadmap, share the app overview/screens and I'll start building Phase 0 → Phase 1.
