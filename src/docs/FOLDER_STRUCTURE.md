# Event Management Platform - Folder Structure

This document provides a detailed explanation of the project's folder structure and file organization.

---

## 📁 Root Directory

```
/
├── /components/          # React components
├── /contexts/            # React Context providers  
├── /lib/                 # Utilities, types, mock data
├── /styles/              # Global styles
├── /docs/                # Documentation
├── App.tsx               # Root component
└── Attributions.md       # Third-party credits
```

---

## 📦 Components Directory

### `/components/` Overview

```
/components/
├── /chatbot/             # AI Chatbot feature
├── /events/              # Event-specific components
├── /figma/               # Figma integration utilities
├── /layout/              # Navigation and layout
├── /pages/               # Page-level components
└── /ui/                  # Reusable UI components
```

---

### `/components/chatbot/`

**Purpose**: AI chatbot with voice and text capabilities

```
/components/chatbot/
└── Chatbot.tsx           # Main chatbot component
```

**Features**:
- Floating chat button
- Chat window with message history
- Voice input (Web Speech API)
- Voice output (Speech Synthesis API)
- Pattern-based response generation
- Toggle voice on/off

**Dependencies**:
- `lucide-react` for icons
- `react` hooks for state
- Browser Web Speech API
- Browser Speech Synthesis API

---

### `/components/events/`

**Purpose**: Event-specific display components

```
/components/events/
├── EmptyState.tsx        # Empty state messages
├── EventCard.tsx         # Event display card
└── EventCardSkeleton.tsx # Loading skeleton
```

**EmptyState.tsx**:
- No events found
- No search results
- No created events
- No attending events

**EventCard.tsx**:
- Grid and list view modes
- Event image, title, description
- Date, time, location
- Capacity indicator
- RSVP button

**EventCardSkeleton.tsx**:
- Loading placeholder
- Shimmer animation
- Matches card dimensions

---

### `/components/figma/`

**Purpose**: Figma-related utilities

```
/components/figma/
└── ImageWithFallback.tsx # Image component with fallback
```

**Protected file** - Do not modify

---

### `/components/layout/`

**Purpose**: Application layout components

```
/components/layout/
├── Footer.tsx            # Page footer
├── MobileNav.tsx         # Bottom mobile navigation
└── Navbar.tsx            # Desktop top navigation
```

**Navbar.tsx**:
- Desktop navigation bar
- Logo and brand
- Navigation links
- User menu
- Theme toggle
- Responsive (hidden on mobile)

**MobileNav.tsx**:
- Fixed bottom navigation
- Icon-based links
- Active state indicator
- Touch-friendly targets
- Only visible on mobile/tablet

**Footer.tsx**:
- Quick links
- Social media
- Copyright info
- Responsive columns

---

### `/components/pages/`

**Purpose**: Full-page components (route-level)

```
/components/pages/
├── CreateEventPage.tsx   # Create/edit event form
├── EventDetailsPage.tsx  # Single event view
├── EventsPage.tsx        # Events listing
├── LandingPage.tsx       # Homepage
├── LoginPage.tsx         # Login form
├── SignupPage.tsx        # Registration form
└── UserDashboard.tsx     # User dashboard
```

#### **CreateEventPage.tsx**
- Multi-step form (3 steps)
- Step 1: Basic info (title, description, category)
- Step 2: Date & location
- Step 3: Capacity & image
- Real-time validation
- Progress indicator
- AI enhance button (placeholder)

#### **EventDetailsPage.tsx**
- Hero banner with image
- Event details
- RSVP button
- Capacity progress bar
- Organizer card
- Security badge
- Breadcrumb navigation

#### **EventsPage.tsx**
- Search bar
- Category filter
- Availability filter
- Grid/list view toggle
- Event cards grid
- Empty states
- Results counter

#### **LandingPage.tsx**
- Hero section
- Features showcase
- Call-to-action buttons
- Statistics display
- Testimonials (future)

#### **LoginPage.tsx**
- Email/password form
- Remember me checkbox
- Validation
- Error handling
- Sign up link

#### **SignupPage.tsx**
- Name, email, password
- Form validation
- Auto-login after signup
- Login link

#### **UserDashboard.tsx**
- Statistics cards
- Created events tab
- Attending events tab
- Event management (edit/delete)
- Empty states

---

### `/components/ui/`

**Purpose**: Reusable, generic UI components

```
/components/ui/
├── accordion.tsx         # Expandable sections
├── alert-dialog.tsx      # Confirmation dialogs
├── alert.tsx             # Alert messages
├── aspect-ratio.tsx      # Aspect ratio container
├── avatar.tsx            # User avatar
├── badge.tsx             # Status badges
├── breadcrumb.tsx        # Breadcrumb navigation
├── button.tsx            # Button component
├── calendar.tsx          # Date picker
├── card.tsx              # Card container
├── carousel.tsx          # Image carousel
├── chart.tsx             # Chart components
├── checkbox.tsx          # Checkbox input
├── collapsible.tsx       # Collapsible content
├── command.tsx           # Command palette
├── context-menu.tsx      # Right-click menu
├── dialog.tsx            # Modal dialog
├── drawer.tsx            # Side drawer
├── dropdown-menu.tsx     # Dropdown menu
├── form.tsx              # Form components
├── hover-card.tsx        # Hover card
├── input-otp.tsx         # OTP input
├── input.tsx             # Text input
├── label.tsx             # Form label
├── menubar.tsx           # Menu bar
├── navigation-menu.tsx   # Navigation menu
├── pagination.tsx        # Pagination
├── popover.tsx           # Popover
├── progress.tsx          # Progress bar
├── radio-group.tsx       # Radio buttons
├── resizable.tsx         # Resizable panels
├── scroll-area.tsx       # Scrollable area
├── select.tsx            # Select dropdown
├── separator.tsx         # Divider line
├── sheet.tsx             # Side sheet
├── sidebar.tsx           # Sidebar
├── skeleton.tsx          # Loading skeleton
├── slider.tsx            # Slider input
├── sonner.tsx            # Toast notifications
├── switch.tsx            # Toggle switch
├── table.tsx             # Data table
├── tabs.tsx              # Tab navigation
├── textarea.tsx          # Multi-line input
├── toggle-group.tsx      # Toggle button group
├── toggle.tsx            # Toggle button
├── tooltip.tsx           # Tooltip
├── use-mobile.ts         # Mobile detection hook
└── utils.ts              # UI utilities
```

**Based on**: Radix UI + Tailwind CSS  
**Fully typed**: TypeScript support  
**Accessible**: ARIA compliant  
**Themeable**: Dark mode support

---

## 🔌 Contexts Directory

### `/contexts/` Overview

```
/contexts/
├── AuthContext.tsx       # Authentication state
├── EventsContext.tsx     # Events CRUD & state
└── ThemeContext.tsx      # Theme preferences
```

---

### **AuthContext.tsx**

**Purpose**: Manages user authentication state

**State**:
```typescript
{
  user: User | null;
  isAuthenticated: boolean;
}
```

**Methods**:
- `login(email, password)` - Authenticate user
- `signup(userData)` - Register new user
- `logout()` - End session

**Persistence**: localStorage

**Usage**:
```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

---

### **EventsContext.tsx**

**Purpose**: Manages events data and operations

**State**:
```typescript
{
  events: Event[];
  createdEvents: Event[];
  attendingEvents: string[];
}
```

**Methods**:
- `createEvent(data)` - Create new event
- `updateEvent(id, data)` - Update event
- `deleteEvent(id)` - Delete event
- `rsvpToEvent(eventId)` - RSVP to event
- `cancelRsvp(eventId)` - Cancel RSVP

**Persistence**: localStorage with auto-sync

**Usage**:
```typescript
const { events, createEvent, rsvpToEvent } = useEvents();
```

---

### **ThemeContext.tsx**

**Purpose**: Manages application theme

**State**:
```typescript
{
  theme: 'light' | 'dark' | 'system';
}
```

**Methods**:
- `setTheme(theme)` - Change theme

**Persistence**: localStorage

**Usage**:
```typescript
const { theme, setTheme } = useTheme();
```

---

## 📚 Lib Directory

### `/lib/` Overview

```
/lib/
├── mockData.ts           # Development mock data
└── types.ts              # TypeScript interfaces
```

---

### **types.ts**

**Purpose**: Centralized TypeScript type definitions

**Interfaces**:

```typescript
// Event
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
  attending: number;
  image: string;
  organizerId: string;
  organizerName: string;
  organizerAvatar: string;
  attendees: string[];
}

// Event Filters
export interface EventFilters {
  search: string;
  category: string;
  availability: 'all' | 'open' | 'full';
  dateFrom?: string;
  dateTo?: string;
}

// View Mode
export type ViewMode = 'grid' | 'list';

// User Stats
export interface UserStats {
  eventsCreated: number;
  totalRSVPs: number;
  upcomingEvents: number;
}
```

**Usage**: Import types throughout the app

---

### **mockData.ts**

**Purpose**: Development data for testing

**Exports**:
- `mockEvents: Event[]` - Sample events
- `categories: string[]` - Event categories

**Usage**: Initial data for EventsContext

---

## 🎨 Styles Directory

### `/styles/` Overview

```
/styles/
└── globals.css           # Global styles & Tailwind
```

**globals.css**:
- Tailwind CSS imports
- CSS custom properties (colors, spacing)
- Typography defaults
- Dark mode variables
- Global animations
- Utility classes

**Tailwind v4.0**: Direct import, no config file needed

---

## 📖 Docs Directory

### `/docs/` Overview

```
/docs/
├── ARCHITECTURE.md       # System architecture
├── API_INTEGRATION.md    # Backend integration guide
├── FEATURES.md           # Feature documentation
├── FOLDER_STRUCTURE.md   # This file
├── IMPLEMENTATION_SUMMARY.md # Implementation summary
└── README.md             # Documentation index
```

**Purpose**: Comprehensive project documentation

**Target Audience**:
- Developers (architecture, API)
- Recruiters (features, summary)
- Contributors (structure, implementation)

**See**: [README.md](./README.md) for documentation index

---

## 📄 Root Files

### **App.tsx**

**Purpose**: Root React component

**Structure**:
```typescript
ThemeProvider
  └── AuthProvider
      └── EventsProvider
          └── App Layout
              ├── Navbar
              ├── MobileNav
              ├── Pages (conditional rendering)
              ├── Chatbot
              ├── Footer
              └── Toaster
```

**Routing**: Simple state-based routing  
**Navigation**: Via `handleNavigate` function

---

### **Attributions.md**

**Purpose**: Third-party library credits

**Contents**: Licenses and attributions for:
- React
- Tailwind CSS
- Radix UI
- Lucide React
- Other dependencies

---

## 🗂️ File Organization Principles

### 1. **Feature-Based Grouping**
- Related components together
- `/chatbot/` for chatbot feature
- `/events/` for event components
- `/pages/` for page-level components

### 2. **Separation of Concerns**
- `/ui/` for generic, reusable components
- `/pages/` for business logic
- `/contexts/` for state management
- `/lib/` for utilities and types

### 3. **Single Responsibility**
- One component per file
- Clear, descriptive file names
- Focused functionality

### 4. **Scalability**
- Easy to add new features
- Clear where new files go
- Minimal coupling between features

### 5. **TypeScript First**
- `.tsx` for components
- `.ts` for utilities
- Types in `/lib/types.ts`

---

## 📊 File Count Summary

| Directory | Files | Purpose |
|-----------|-------|---------|
| `/components/ui/` | 45+ | Reusable UI components |
| `/components/pages/` | 7 | Page-level components |
| `/components/layout/` | 3 | Layout components |
| `/components/events/` | 3 | Event components |
| `/components/chatbot/` | 1 | Chatbot feature |
| `/contexts/` | 3 | State management |
| `/lib/` | 2 | Types and utilities |
| `/docs/` | 6 | Documentation |
| **Total** | **70+** | **All files** |

---

## 🔍 Finding Files

### To add a new feature:
1. Create component in `/components/[feature]/`
2. Add types to `/lib/types.ts`
3. Add to appropriate page
4. Update context if needed

### To add a new page:
1. Create in `/components/pages/`
2. Import in `App.tsx`
3. Add to navigation
4. Add route handling

### To add a new UI component:
1. Create in `/components/ui/`
2. Follow existing pattern
3. Export from file
4. Import where needed

### To update state management:
1. Edit appropriate context in `/contexts/`
2. Update types in `/lib/types.ts`
3. Update components using context

---

## 🚀 Quick Reference

### Import Paths

```typescript
// UI Components
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';

// Pages
import { EventsPage } from './components/pages/EventsPage';

// Contexts
import { useAuth } from './contexts/AuthContext';
import { useEvents } from './contexts/EventsContext';

// Types
import { Event, EventFilters } from './lib/types';

// Mock Data
import { mockEvents, categories } from './lib/mockData';
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `EventCard.tsx`)
- **Contexts**: PascalCase (e.g., `AuthContext.tsx`)
- **Utils**: camelCase (e.g., `utils.ts`)
- **Types**: camelCase (e.g., `types.ts`)
- **Docs**: UPPERCASE (e.g., `README.md`)

---

## 📝 Notes

### Protected Files
Do not modify: `/components/figma/ImageWithFallback.tsx`

### Auto-generated Files
UI components in `/components/ui/` are based on Radix UI patterns

### Future Additions
- `/services/` - API service layer (when backend is added)
- `/hooks/` - Custom React hooks (if needed)
- `/utils/` - Utility functions (if needed)
- `/constants/` - App constants (if needed)

---

**Last Updated**: December 17, 2025  
**Structure Version**: 1.0.0
