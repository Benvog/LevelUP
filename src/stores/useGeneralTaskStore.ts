import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type GeneralTaskStatus = 'active' | 'completed' | 'expired'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface SubTask {
  id: string
  name: string
  isCompleted: boolean
}

export interface GeneralTask {
  id: string
  lifeAreaId: string
  name: string
  description?: string
  targetCount: number // e.g., 2 for "Read 2 books"
  currentCount: number
  softDeadline?: string // ISO date string
  priority: TaskPriority
  status: GeneralTaskStatus
  isRecurring: boolean
  recurrencePattern?: 'weekly' | 'monthly'
  subTasks?: SubTask[]
  createdAt: string
  completedAt?: string
}

interface GeneralTaskState {
  tasks: GeneralTask[]
  
  // CRUD
  addGeneralTask: (task: Omit<GeneralTask, 'id' | 'currentCount' | 'status' | 'createdAt'>) => string
  updateGeneralTask: (id: string, updates: Partial<GeneralTask>) => void
  deleteGeneralTask: (id: string) => void
  
  // Business Logic
  incrementProgress: (id: string, amount?: number) => void
  completeTask: (id: string) => void
  checkExpiredTasks: () => void
  
  // Getters
  getTasksByLifeArea: (lifeAreaId: string) => GeneralTask[]
  getTasksByDeadline: (lifeAreaId: string, start: string, end: string) => GeneralTask[]
  getProgress: (id: string) => { completionPercent: number; timeElapsedPercent: number | null }
  
  // Sub-tasks
  addSubTask: (taskId: string, name: string) => void
  toggleSubTask: (taskId: string, subTaskId: string) => void
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

export const useGeneralTaskStore = create<GeneralTaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addGeneralTask: (task) => {
        const now = new Date()
        
        // Check if already expired
        let status: GeneralTaskStatus = 'active'
        if (task.softDeadline && task.softDeadline < getTodayString()) {
          status = 'expired'
        }

        const newTask: GeneralTask = {
          ...task,
          id: crypto.randomUUID(),
          currentCount: 0,
          status,
          createdAt: now.toISOString(),
        }

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }))

        return newTask.id
      },

      updateGeneralTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }))
      },

      deleteGeneralTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }))
      },

      incrementProgress: (id, amount = 1) => {
        const task = get().tasks.find((t) => t.id === id)
        if (!task || task.status === 'completed') return

        const newCount = Math.min(task.currentCount + amount, task.targetCount)
        const isComplete = newCount >= task.targetCount

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  currentCount: newCount,
                  status: isComplete ? 'completed' : t.status,
                  completedAt: isComplete ? new Date().toISOString() : t.completedAt,
                }
              : t
          ),
        }))
      },

      completeTask: (id) => {
        const now = new Date()
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  currentCount: t.targetCount,
                  status: 'completed',
                  completedAt: now.toISOString(),
                }
              : t
          ),
        }))
      },

      checkExpiredTasks: () => {
        const today = getTodayString()

        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (
              task.status === 'active' &&
              task.softDeadline &&
              task.softDeadline < today
            ) {
              return { ...task, status: 'expired' }
            }
            return task
          }),
        }))
      },

      getTasksByLifeArea: (lifeAreaId) => {
        return get()
          .tasks.filter((t) => t.lifeAreaId === lifeAreaId)
          .sort((a, b) => {
            // Priority order: high > medium > low
            const priorityOrder = { high: 0, medium: 1, low: 2 }
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
              return priorityOrder[a.priority] - priorityOrder[b.priority]
            }
            // Then by deadline (if exists)
            if (a.softDeadline && b.softDeadline) {
              return a.softDeadline.localeCompare(b.softDeadline)
            }
            if (a.softDeadline) return -1
            if (b.softDeadline) return 1
            return 0
          })
      },

      getTasksByDeadline: (lifeAreaId, start, end) => {
        return get().tasks.filter(
          (t) =>
            t.lifeAreaId === lifeAreaId &&
            t.softDeadline &&
            t.softDeadline >= start &&
            t.softDeadline <= end
        )
      },

      getProgress: (id) => {
        const task = get().tasks.find((t) => t.id === id)
        if (!task) return { completionPercent: 0, timeElapsedPercent: null }

        const completionPercent = (task.currentCount / task.targetCount) * 100

        let timeElapsedPercent: number | null = null
        if (task.softDeadline && task.createdAt) {
          const created = new Date(task.createdAt).getTime()
          const deadline = new Date(task.softDeadline).getTime()
          const now = Date.now()
          const totalDuration = deadline - created
          const elapsed = now - created
          timeElapsedPercent = Math.min(100, (elapsed / totalDuration) * 100)
        }

        return { completionPercent, timeElapsedPercent }
      },

      addSubTask: (taskId, name) => {
        const newSubTask: SubTask = {
          id: crypto.randomUUID(),
          name,
          isCompleted: false,
        }

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, subTasks: [...(t.subTasks || []), newSubTask] }
              : t
          ),
        }))
      },

      toggleSubTask: (taskId, subTaskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== taskId) return t
            
            const updatedSubTasks = t.subTasks?.map((st) =>
              st.id === subTaskId ? { ...st, isCompleted: !st.isCompleted } : st
            )

            return { ...t, subTasks: updatedSubTasks }
          }),
        }))
      },
    }),
    {
      name: 'levelup-general-tasks',
    }
  )
)
