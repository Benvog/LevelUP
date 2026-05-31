import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TemporalTaskStatus = 'locked' | 'active' | 'in-grace' | 'completed' | 'missed'

export interface TemporalTask {
  id: string
  lifeAreaId: string
  name: string
  description?: string
  scheduledDate: string // ISO date string YYYY-MM-DD
  scheduledTime: string // 24h format HH:MM
  duration?: number // minutes, for visual spacing
  isRecurring: boolean
  recurrencePattern?: 'daily' | 'weekly' | 'custom'
  streak: number
  longestStreak: number
  lastCompletedAt?: string // ISO timestamp
  status: TemporalTaskStatus
  reasonForSkip?: string
  createdAt: string
}

interface TemporalTaskState {
  tasks: TemporalTask[]
  
  // CRUD
  addTemporalTask: (task: Omit<TemporalTask, 'id' | 'streak' | 'longestStreak' | 'status' | 'createdAt'>) => string
  updateTemporalTask: (id: string, updates: Partial<TemporalTask>) => void
  deleteTemporalTask: (id: string) => void
  
  // Business Logic
  completeTask: (id: string) => void
  missTask: (id: string, reason: string) => void
  checkAndUpdateStatuses: () => void // Auto-update based on current time
  
  // Getters
  getTasksByLifeArea: (lifeAreaId: string) => TemporalTask[]
  getTasksForDate: (lifeAreaId: string, date: string) => TemporalTask[]
  getActiveTask: (lifeAreaId: string) => TemporalTask | undefined
  getUpcomingTasks: (lifeAreaId: string, count: number) => TemporalTask[]
  getMissedTasksPendingReason: (lifeAreaId: string) => TemporalTask[]
  
  // Streak
  getCurrentStreak: (taskId: string) => number
  
  // Analytics
  getSkipReasonStats: (lifeAreaId?: string) => Record<string, number>
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

function getCurrentTimeString(): string {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

function isTimePassed(scheduledTime: string): boolean {
  return getCurrentTimeString() >= scheduledTime
}

function isSameDay(date1: string, date2: string): boolean {
  return date1 === date2
}

export const useTemporalTaskStore = create<TemporalTaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTemporalTask: (task) => {
        const now = new Date()
        const today = getTodayString()
        const currentTime = getCurrentTimeString()
        
        // Determine initial status
        let status: TemporalTaskStatus = 'locked'
        if (task.scheduledDate < today) {
          status = 'missed'
        } else if (task.scheduledDate === today) {
          if (currentTime >= task.scheduledTime) {
            status = 'active'
          }
        }

        const newTask: TemporalTask = {
          ...task,
          id: crypto.randomUUID(),
          streak: 0,
          longestStreak: 0,
          status,
          createdAt: now.toISOString(),
        }

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }))

        return newTask.id
      },

      updateTemporalTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }))
      },

      deleteTemporalTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }))
      },

      completeTask: (id) => {
        const task = get().tasks.find((t) => t.id === id)
        if (!task) return

        const now = new Date()
        const today = getTodayString()
        const wasInGrace = task.status === 'in-grace'

        // Check if streak continues (completed same day)
        let newStreak = task.streak + 1
        
        // If task was missed yesterday and completed today, it's a new streak
        // But we're simplifying: any completion on scheduled day or grace = streak continues
        
        const newLongestStreak = Math.max(task.longestStreak, newStreak)

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: 'completed',
                  streak: newStreak,
                  longestStreak: newLongestStreak,
                  lastCompletedAt: now.toISOString(),
                  // Clear skip reason if it was set
                  reasonForSkip: undefined,
                }
              : t
          ),
        }))

        // Unlock next task in sequence
        const areaTasks = get().getTasksByLifeArea(task.lifeAreaId)
        const currentIndex = areaTasks.findIndex((t) => t.id === id)
        if (currentIndex >= 0 && currentIndex < areaTasks.length - 1) {
          const nextTask = areaTasks[currentIndex + 1]
          if (nextTask.status === 'locked' && nextTask.scheduledDate === today) {
            get().updateTemporalTask(nextTask.id, { status: 'active' })
          }
        }
      },

      missTask: (id, reason) => {
        const task = get().tasks.find((t) => t.id === id)
        if (!task) return

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: 'missed',
                  streak: 0, // Reset streak
                  reasonForSkip: reason,
                }
              : t
          ),
        }))
      },

      checkAndUpdateStatuses: () => {
        const today = getTodayString()
        const currentTime = getCurrentTimeString()

        set((state) => ({
          tasks: state.tasks.map((task) => {
            // Skip already completed or missed
            if (task.status === 'completed' || task.status === 'missed') {
              return task
            }

            // If scheduled for today
            if (task.scheduledDate === today) {
              // Time has passed
              if (currentTime >= task.scheduledTime) {
                if (task.status === 'locked') {
                  return { ...task, status: 'active' }
                }
                // If still not completed and day is ending... (handled by caller at day end)
              }
            }

            return task
          }),
        }))
      },

      getTasksByLifeArea: (lifeAreaId) => {
        return get()
          .tasks.filter((t) => t.lifeAreaId === lifeAreaId)
          .sort((a, b) => {
            // Sort by date, then time
            if (a.scheduledDate !== b.scheduledDate) {
              return a.scheduledDate.localeCompare(b.scheduledDate)
            }
            return a.scheduledTime.localeCompare(b.scheduledTime)
          })
      },

      getTasksForDate: (lifeAreaId, date) => {
        return get()
          .tasks.filter((t) => t.lifeAreaId === lifeAreaId && t.scheduledDate === date)
          .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
      },

      getActiveTask: (lifeAreaId) => {
        const today = getTodayString()
        return get().tasks.find(
          (t) => t.lifeAreaId === lifeAreaId && 
                 t.scheduledDate === today && 
                 (t.status === 'active' || t.status === 'in-grace')
        )
      },

      getUpcomingTasks: (lifeAreaId, count) => {
        const today = getTodayString()
        return get()
          .tasks.filter(
            (t) => 
              t.lifeAreaId === lifeAreaId && 
              (t.scheduledDate > today || (t.scheduledDate === today && t.status !== 'completed'))
          )
          .slice(0, count)
      },

      getMissedTasksPendingReason: (lifeAreaId) => {
        const today = getTodayString()
        return get().tasks.filter(
          (t) => 
            t.lifeAreaId === lifeAreaId && 
            t.status === 'missed' && 
            !t.reasonForSkip &&
            t.scheduledDate < today
        )
      },

      getCurrentStreak: (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId)
        return task?.streak || 0
      },

      getSkipReasonStats: (lifeAreaId?) => {
        const tasks = lifeAreaId 
          ? get().tasks.filter((t) => t.lifeAreaId === lifeAreaId)
          : get().tasks

        const stats: Record<string, number> = {}
        tasks.forEach((task) => {
          if (task.reasonForSkip) {
            stats[task.reasonForSkip] = (stats[task.reasonForSkip] || 0) + 1
          }
        })
        return stats
      },
    }),
    {
      name: 'levelup-temporal-tasks',
    }
  )
)
