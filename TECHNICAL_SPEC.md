# LevelUp Technical Specification
## Dual-Branch LifeArea System

**Version:** 1.0  
**Date:** May 31, 2026  
**Status:** Ready for Implementation

---

## 1. SYSTEM OVERVIEW

### 1.1 Core Concept
Each LifeArea displays a **dual-branch visualization** inside its detail page:
- **Left Branch (Temporal):** Time-sequenced tasks with specific times/dates
- **Right Branch (General):** Flexible tasks with soft deadlines or no deadlines
- **Central Origin:** "NOW" indicator showing current position in time

### 1.2 Visual Metaphor
Users navigate their day/week as a branching path — like a subway map where:
- Left track = scheduled trains (must arrive on time)
- Right track = walking path (go at your own pace)
- Central hub = "You Are Here"

---

## 2. BRANCH SPECIFICATIONS

### 2.1 Temporal Branch (Left)
**Purpose:** Time-critical tasks with specific scheduling

**Visual Design:**
- Clock icon (⏰) on branch header
- Cyan/teal glow for upcoming tasks
- Red pulse for missed tasks in grace period
- Grey/locked for future tasks beyond view window

**Task Properties:**
```typescript
interface TemporalTask {
  id: string
  lifeAreaId: string
  name: string
  scheduledDate: Date        // e.g., "2026-06-01"
  scheduledTime: string      // e.g., "08:00" (24h format)
  duration?: number          // minutes (optional, for visual spacing)
  isRecurring: boolean      // daily, weekly, etc.
  recurrencePattern?: 'daily' | 'weekly' | 'custom'
  streak: number            // consecutive completions
  lastCompletedAt?: Date
  status: 'locked' | 'active' | 'in-grace' | 'completed' | 'missed'
  reasonForSkip?: string    // required if missed
}
```

**Unlock Logic:**
1. **Time-based:** Unlocks when `currentTime >= scheduledTime`
2. **Sequential dependency:** Next task unlocks ONLY after:
   - Previous task marked complete, OR
   - Previous task marked skipped (with reason), OR
   - Day ends (all pending tasks auto-missed at midnight)
3. **Grace Period:** If missed original time, enters "in-grace" (orange pulse) until day ends
4. **Future tasks:** Show greyed out with date/time label

**Streak System:**
- Breaks if task not completed by day end
- Grace period completion saves streak
- Visual indicators:
  - < 3 days: Normal glow
  - 3-6 days: Orange flame border
  - 7+ days: Epic purple fire effect
  - Broken: Grey, sad face, "Start Fresh" button

### 2.2 General Branch (Right)
**Purpose:** Flexible goals with soft deadlines

**Visual Design:**
- Infinity icon (∞) on branch header
- Softer glow (purple/pink tones)
- Progress rings showing completion + time pressure
- Stack vertically by priority or deadline

**Task Properties:**
```typescript
interface GeneralTask {
  id: string
  lifeAreaId: string
  name: string
  targetCount: number        // e.g., "Read 2 books" → 2
  currentCount: number       // e.g., "1 book done" → 1
  softDeadline?: Date      // "by month end"
  priority: 'low' | 'medium' | 'high'
  status: 'active' | 'completed' | 'expired'
  isRecurring: boolean
  recurrencePattern?: 'weekly' | 'monthly'
  subTasks?: SubTask[]      // Optional breakdown
}
```

**Progress Ring Design:**
- **Outer ring:** Time elapsed toward deadline (fills clockwise)
- **Inner ring:** Task completion percentage (fills counter-clockwise)
- **Example:** "Read 2 books by June 30"
  - June 15 (50% of month) → Outer ring 50% full
  - 1 book done → Inner ring 50% full
  - Combined visual shows urgency vs progress

**Unlock Logic:**
- Purely completion-based
- Previous task completion unlocks next
- Can work on multiple simultaneously
- Never blocks temporal branch

### 2.3 Dual-Nature Tasks
**Definition:** Tasks appearing on BOTH branches

**Visual:**
- One physical node centered between branches
- Two connector lines (left to temporal, right to general)
- Dual icon: Clock + Infinity combined

**Example:** "Gym 8am (Workout 4x/week)"
- On temporal: Must complete at 8am to keep daily streak
- On general: Counts toward "4 workouts this week" goal
- Completing temporal auto-increments general counter
- Missing temporal (even with makeup) breaks temporal streak but still counts for general

---

## 3. ACCOUNTABILITY SYSTEM

### 3.1 Missed Task Flow
```
Current time: 11:00am
Task "Gym 8am" status: MISSED (not completed, day not over)

[Modal Opens - Blocking Interaction]
┌──────────────────────────────────────┐
│  ⚠️ MISSED TASK                      │
│                                      │
│  "Gym 8am" is incomplete             │
│                                      │
│  Why did you miss this?              │
│                                      │
│  ○ Overslept                         │
│  ○ Emergency/crisis                    │
│  ○ Not motivated                     │
│  ○ Forgot                            │
│  ○ Other: [Text input]               │
│                                      │
│  [Mark as Missed & Continue]         │
│                                      │
│  🔥 Current Streak: 5 days → 0       │
└──────────────────────────────────────┘
```

### 3.2 Grace Period Mode
**Trigger:** Current time > scheduled time, but same day
**Visual:** Orange pulsing border on task node
**Behavior:**
- Can still complete task to save streak
- MUST provide reason for being late
- Shows countdown: "Grace ends in 6 hours 23 mins"
- At midnight: Auto-converts to MISSED

### 3.3 Multiple Missed Tasks
**User Choice:** Cumulative vs Cascading

**Cumulative Mode:**
- All missed tasks shown in one modal with checklist
- Single reason can apply to all, or each gets own reason
- After submitting, all unlock simultaneously

**Cascading Mode:**
- Must address tasks in chronological order
- Gym 8am → Cold Shower 9am → Breakfast 10am → etc.
- Each gets its own modal
- Next task unlocks only after previous reason submitted

---

## 4. CALENDAR & GLOBAL VIEW

### 4.1 Global Calendar
**Access:** Click calendar icon in header → opens overlay
**Scope:** Cross-life-area view of ALL scheduled tasks
**Range:** Full month view (default current month)
**Navigation:** Month toggle arrows, jump to today

**Visual Design:**
- Grid calendar (7 columns x ~5 rows)
- Dots on dates with tasks
- Color-coded by life area (cyan for Fitness, blue for Trading, etc.)
- Temporal tasks show time
- Click date → shows all tasks for that day

### 4.2 Weekly Mini-Map (LifeAreaPage default view)
Shows current week + next week (14 days)

**Visual:**
- Horizontal timeline strip at top
- "Today" marker with glow
- Past days greyed out
- Future days clickable to preview

**Tomorrow Preview:**
- Click "Tomorrow" → temporal branch updates to show tomorrow's schedule
- General branch stays same (week-long goals persist)
- "Today" button to return

---

## 5. STATE MANAGEMENT

### 5.1 New Store: useTemporalTaskStore
```typescript
interface TemporalTaskState {
  tasks: TemporalTask[]
  
  // CRUD
  addTemporalTask: (task: Omit<TemporalTask, 'id' | 'streak' | 'status'>) => void
  updateTemporalTask: (id: string, updates: Partial<TemporalTask>) => void
  deleteTemporalTask: (id: string) => void
  
  // Business Logic
  completeTask: (id: string) => void           // Marks complete, updates streak
  missTask: (id: string, reason: string) => void  // Marks missed, breaks streak
  checkGraceStatus: () => void               // Auto-updates status based on time
  getTasksByLifeArea: (lifeAreaId: string) => TemporalTask[]
  getTasksForDate: (date: Date) => TemporalTask[]  // For calendar view
  getActiveTask: (lifeAreaId: string) => TemporalTask | undefined
  getUpcomingTasks: (lifeAreaId: string, count: number) => TemporalTask[]
  
  // Streak
  getCurrentStreak: (taskId: string) => number
  getLongestStreak: (taskId: string) => number
  
  // Missed reasons analytics
  getSkipReasonStats: (lifeAreaId?: string) => Record<string, number>
}
```

### 5.2 New Store: useGeneralTaskStore
```typescript
interface GeneralTaskState {
  tasks: GeneralTask[]
  
  // CRUD
  addGeneralTask: (task: Omit<GeneralTask, 'id' | 'currentCount' | 'status'>) => void
  updateGeneralTask: (id: string, updates: Partial<GeneralTask>) => void
  deleteGeneralTask: (id: string) => void
  
  // Business Logic
  incrementProgress: (id: string, amount?: number) => void
  completeTask: (id: string) => void
  getTasksByLifeArea: (lifeAreaId: string) => GeneralTask[]
  getTasksByDeadline: (start: Date, end: Date) => GeneralTask[]
  getProgress: (id: string) => { completion: number; timeElapsed: number }
}
```

### 5.3 Persistence Keys
- `levelup-temporal-tasks` - All temporal tasks
- `levelup-general-tasks` - All general tasks  
- `levelup-missed-reasons` - Analytics data (reasons + timestamps)

---

## 6. UI COMPONENTS NEEDED

### 6.1 BranchMap Component (Main)
**Props:**
```typescript
interface BranchMapProps {
  lifeAreaId: string
  areaName: string
  areaColor: string
  areaIcon: string
  viewMode: 'today' | 'tomorrow' | 'week' | 'date'
  selectedDate?: Date
}
```

**Features:**
- SVG-based layout (similar to WorldMap)
- Left branch (temporal) + Right branch (general) + Center origin
- Responsive positioning
- Smooth animations for unlocks/completions

### 6.2 TaskNode Component
**Variants:**
- `temporal-locked` - Grey, clock icon
- `temporal-active` - Color glow, pulsing
- `temporal-grace` - Orange pulse, countdown shown
- `temporal-completed` - Green checkmark
- `temporal-missed` - Red X, broken streak shown
- `general-active` - Soft glow, dual rings
- `general-completed` - Solid fill, checkmark
- `dual` - Split design showing both states

### 6.3 MissedTaskModal Component
**Props:**
```typescript
interface MissedTaskModalProps {
  tasks: TemporalTask[]  // Single or multiple
  mode: 'cumulative' | 'cascading'
  onSubmit: (reasons: Record<string, string>) => void
  onCancel: () => void
}
```

**Features:**
- Reason selection (radio buttons + custom text)
- Streak preview ("Your 5-day streak will reset")
- Cascading mode shows progress: "Task 1 of 3"

### 6.4 CalendarOverlay Component
**Features:**
- Month grid
- Life area filter toggle
- Click date to preview that day's tasks
- "Jump to Today" button

---

## 7. NAVIGATION & ROUTING

### 7.1 Updated Routes
```
/                          → HomePage (World Map)
/area/:areaId              → LifeAreaPage (Dual Branch Map)
/area/:areaId?date=2026-06-15 → LifeAreaPage showing specific date
/calendar                  → Full Calendar View (overlay or new page)
```

### 7.2 LifeAreaPage Sections
1. **Header:** Area icon/name + Back button + Calendar toggle
2. **Mini Timeline:** Today + 6 future days (clickable)
3. **Dual Branch Map:** Main visual (500px+ height)
4. **Add Task Button:** Floating action button (FAB)
5. **Stats Panel:** Streak counts, completion rate, pattern insights

---

## 8. DATA FLOW EXAMPLES

### 8.1 Creating a Temporal Task
```
User: Click "Add Task"
Form: Name="Gym", Time="08:00", Date="Today", Recurring="Daily"
Store: Create task with status="locked" (if future) or "active" (if now)
UI: Node appears on left branch, positioned by time
```

### 8.2 Completing a Task On Time
```
Time: 08:30 (30 mins after scheduled)
User: Click task node → Click "Complete"
Store: status="completed", streak += 1, lastCompletedAt=now
UI: Node turns green, small celebration animation
Next Task: "Cold Shower 9am" unlocks (status="active")
```

### 8.3 Missing a Task (Grace Period)
```
Time: 10:00 (2 hours after Gym 8am)
Status: Task auto-enters "in-grace" (orange pulse)
User: Click task → "Complete" still available
User: Clicks Complete
Modal: "Why were you late?" [Options]
User: Selects reason → Submit
Store: status="completed", streak preserved (grace save)
UI: Node green, "Grace Save!" badge shown briefly
```

### 8.4 Missing a Task (Day Ended)
```
Time: 00:01 (next day)
Auto: All incomplete tasks status="missed"
User: Opens LifeArea tomorrow morning
Modal: "You missed 3 tasks yesterday" [Cumulative/Cascade choice]
User: Addresses each with reasons
Store: streaks reset to 0, reasons logged
UI: Nodes red, streak counters reset
```

---

## 9. EDGE CASES & DECISIONS

| Scenario | Decision |
|----------|----------|
| Task scheduled in past (created late) | Shows as "Add to today?" or schedule future |
| Two tasks same time | Stack vertically, same horizontal position |
| Recurring task on specific days | Checkbox pattern: Mon☑ Tue☐ Wed☑ etc. |
| Timezone change | Store all times in UTC, display in local |
| Daylight saving time shift | Handle in display layer, don't change stored data |
| Device offline | Queue changes, sync on reconnect |
| Duplicate task names | Allowed, distinguished by time/icon |
| Deleting completed task | Archived in analytics, removed from view |
| Editing scheduled time | Allowed if task still locked, warns if active |

---

## 10. IMPLEMENTATION PHASES

### Phase 1: Foundation
- Create new store files (temporal + general)
- Update types/index.ts
- Build TaskNode component (all variants)
- Simple BranchMap layout (no animations)

### Phase 2: Core Logic
- Temporal unlock logic (time-based)
- Grace period detection
- Sequential dependency system
- Streak calculation

### Phase 3: Accountability
- MissedTaskModal component
- Reason tracking
- Streak reset logic
- Analytics basics (count reasons)

### Phase 4: Polish
- Animations (unlock, complete, streak break)
- Dual-nature task support
- Calendar overlay
- Pattern detection insights

### Phase 5: Integration
- Connect to existing World Map
- Mobile responsive layout
- Sync with existing milestone system (decide integration strategy)

---

## 11. OPEN QUESTIONS (Decide During Build)

1. **Milestone vs Task naming:** Keep "Milestone" for general, use "Task" for temporal? Or unify?
2. **Sound effects:** Celebration chime on completion? Sad sound on streak break?
3. **Haptics:** Mobile vibration on task complete?
4. **Sharing:** Share streaks to social media? Accountability partner feature?
5. **Dark mode variations:** Different glow colors for different times of day?

---

## 12. SUCCESS METRICS

**User should feel:**
- Time is visible and manageable (not abstract)
- Accountability without shame (reasons normalize misses)
- Progress is tangible (streaks, rings, visual paths)
- Flexibility exists (general branch, grace periods)
- Control over their schedule (easy add/edit/remove)

**Technical goals:**
- Smooth 60fps animations
- <100ms response time on interactions
- Zero data loss (robust persistence)
- Works offline

---

**Ready to implement?** Start with Phase 1: Foundation
