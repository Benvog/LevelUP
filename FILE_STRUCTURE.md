# LevelUp File Structure

```
LevelUP/
├── public/
│   └── (static assets, favicon, etc.)
│
├── src/
│   ├── assets/
│   │   ├── icons/              # SVG icons for life areas
│   │   └── sounds/             # Achievement sounds (optional)
│   │
│   ├── components/
│   │   ├── ui/                 # Reusable UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── Tooltip.tsx
│   │   │
│   │   ├── map/                # Map visualization components
│   │   │   ├── WorldMap.tsx      # Main hub with all branches
│   │   │   ├── BranchPath.tsx    # Single life area path
│   │   │   ├── MilestoneNode.tsx # Individual milestone dot
│   │   │   └── PathLine.tsx      # SVG connections between nodes
│   │   │
│   │   ├── tasks/              # Task-related components
│   │   │   ├── TaskItem.tsx
│   │   │   ├── TaskCheckbox.tsx
│   │   │   ├── TaskHabit.tsx
│   │   │   ├── TaskDated.tsx
│   │   │   └── TaskJournal.tsx
│   │   │
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Navigation.tsx
│   │       └── PageTransition.tsx
│   │
│   ├── features/               # Domain-specific logic
│   │   ├── lifeAreas/
│   │   │   ├── LifeAreaForm.tsx
│   │   │   ├── LifeAreaCard.tsx
│   │   │   └── useLifeAreas.ts   # Custom hook for life area CRUD
│   │   │
│   │   ├── milestones/
│   │   │   ├── MilestoneForm.tsx
│   │   │   ├── MilestoneDetail.tsx
│   │   │   └── useMilestones.ts
│   │   │
│   │   └── tasks/
│   │       ├── TaskForm.tsx
│   │       ├── TaskList.tsx
│   │       └── useTasks.ts
│   │
│   ├── stores/                 # State management (Zustand)
│   │   ├── useAppStore.ts      # Main store
│   │   ├── useLifeAreaStore.ts
│   │   ├── useMilestoneStore.ts
│   │   └── useTaskStore.ts
│   │
│   ├── hooks/                  # Shared custom hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useAnimation.ts
│   │   └── useDateUtils.ts
│   │
│   ├── utils/                  # Helper functions
│   │   ├── dateHelpers.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   │
│   ├── styles/
│   │   ├── globals.css         # Tailwind imports + base styles
│   │   ├── animations.css      # Custom keyframes
│   │   └── theme.ts            # Color tokens, spacing scale
│   │
│   ├── pages/                  # Route-level components
│   │   ├── HomePage.tsx        # World Map Hub
│   │   ├── LifeAreaPage.tsx    # Branch view
│   │   └── MilestonePage.tsx   # Task board detail
│   │
│   ├── App.tsx                 # Root component + routing
│   ├── main.tsx                # Entry point
│   └── index.css               # Tailwind directives
│
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## Why This Structure?

- **`components/ui/`** - Reusable building blocks (buttons, cards, inputs)
- **`components/map/`** - Everything related to the visual map (SVG/D3)
- **`features/`** - Business logic grouped by domain (life areas, milestones, tasks)
- **`stores/`** - Zustand stores for global state, one per domain
- **`hooks/`** - Shared logic that doesn't fit in stores
- **`utils/`** - Pure functions for date math, validation, etc.
- **`pages/`** - Top-level route components that compose features

## Build Order (Suggested)

1. **Setup** - Vite + React + Tailwind + dependencies
2. **Theme** - Colors, dark mode base, CSS variables
3. **UI Components** - Button, Card, Input primitives
4. **Data Layer** - Zustand stores + localStorage persistence
5. **World Map** - SVG-based hub with branching paths
6. **Life Area Management** - Add/edit/archive life areas
7. **Milestone System** - Nodes, unlocking logic, paths
8. **Task System** - All 4 task types (checkbox, habit, dated, journal)
9. **Polish** - Animations, transitions, mobile responsiveness

Ready to start with Step 1 (Setup)?
