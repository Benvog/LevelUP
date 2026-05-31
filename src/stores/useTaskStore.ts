import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, TaskType, CheckboxTask, HabitTask, DatedTask, JournalTask, JournalEntry } from '../types'
import { v4 as uuidv4 } from 'uuid'
import { format, parseISO, subDays } from 'date-fns'

interface TaskMetadata {
  dueDate?: string
  content?: string
}

interface TaskState {
  tasks: Task[]
  addTask: (milestoneId: string, name: string, type: TaskType, metadata?: TaskMetadata) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleCheckboxTask: (id: string) => void
  completeHabitTask: (id: string) => void
  addJournalEntry: (taskId: string, content: string) => void
  getTasksByMilestone: (milestoneId: string) => Task[]
  getTasksStats: (milestoneId: string) => { total: number; completed: number; percentage: number }
  resetDailyHabits: () => void
  checkOverdueTasks: () => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (milestoneId, name, type, metadata = {}) => {
        const baseTask = {
          id: uuidv4(),
          milestoneId,
          name,
          type,
          order: get().tasks.filter(t => t.milestoneId === milestoneId).length,
          createdAt: new Date().toISOString(),
        }

        let newTask: Task

        switch (type) {
          case 'checkbox':
            newTask = { ...baseTask, type: 'checkbox', isCompleted: false } as CheckboxTask
            break
          case 'habit':
            newTask = { 
              ...baseTask, 
              type: 'habit', 
              streak: 0, 
              lastCompleted: undefined, 
              completions: [] 
            } as HabitTask
            break
          case 'dated':
            newTask = { 
              ...baseTask, 
              type: 'dated', 
              dueDate: (metadata as TaskMetadata).dueDate || format(new Date(), 'yyyy-MM-dd'), 
              isCompleted: false 
            } as DatedTask
            break
          case 'journal':
            newTask = { 
              ...baseTask, 
              type: 'journal', 
              content: (metadata as TaskMetadata).content || '', 
              entries: [] 
            } as JournalTask
            break
          default:
            newTask = baseTask as Task
        }

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }))
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } as Task : t
          ),
        }))
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }))
      },

      toggleCheckboxTask: (id) => {
        const task = get().tasks.find(t => t.id === id) as CheckboxTask | undefined
        if (!task || task.type !== 'checkbox') return

        const newStatus = !task.isCompleted
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id 
              ? { ...t, isCompleted: newStatus, completedAt: newStatus ? new Date().toISOString() : undefined } as CheckboxTask
              : t
          ),
        }))
      },

      completeHabitTask: (id) => {
        const task = get().tasks.find(t => t.id === id) as HabitTask | undefined
        if (!task || task.type !== 'habit') return

        const today = format(new Date(), 'yyyy-MM-dd')
        const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')
        
        // Check if already completed today
        if (task.completions.includes(today)) return

        // Calculate streak
        let newStreak = task.streak
        if (task.lastCompleted === yesterday || !task.lastCompleted) {
          newStreak = task.streak + 1
        } else if (task.lastCompleted !== today) {
          newStreak = 1 // Reset streak if missed a day
        }

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id 
              ? { 
                  ...t, 
                  streak: newStreak, 
                  lastCompleted: today,
                  completions: [...task.completions, today]
                } as HabitTask
              : t
          ),
        }))
      },

      addJournalEntry: (taskId, content) => {
        const task = get().tasks.find(t => t.id === taskId) as JournalTask | undefined
        if (!task || task.type !== 'journal') return

        const entry: JournalEntry = {
          id: uuidv4(),
          content,
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId 
              ? { 
                  ...t, 
                  entries: [entry, ...task.entries],
                  content: content
                } as JournalTask
              : t
          ),
        }))
      },

      getTasksByMilestone: (milestoneId) => {
        return get()
          .tasks
          .filter((t) => t.milestoneId === milestoneId)
          .sort((a, b) => a.order - b.order)
      },

      getTasksStats: (milestoneId) => {
        const milestoneTasks = get().tasks.filter((t) => t.milestoneId === milestoneId)
        const total = milestoneTasks.length
        
        const completed = milestoneTasks.filter((t) => {
          if (t.type === 'checkbox' || t.type === 'dated') {
            return (t as CheckboxTask | DatedTask).isCompleted
          }
          if (t.type === 'habit') {
            const today = format(new Date(), 'yyyy-MM-dd')
            return (t as HabitTask).completions.includes(today)
          }
          if (t.type === 'journal') {
            return (t as JournalTask).entries.length > 0
          }
          return false
        }).length

        return {
          total,
          completed,
          percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        }
      },

      resetDailyHabits: () => {
        // Habits reset automatically based on date checking
        // This is called at midnight or app startup
      },

      checkOverdueTasks: () => {
        const today = new Date()
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.type !== 'dated') return t
            const datedTask = t as DatedTask
            const dueDate = parseISO(datedTask.dueDate)
            if (!datedTask.isCompleted && dueDate < today) {
              return { ...datedTask, isOverdue: true }
            }
            return t
          }),
        }))
      },
    }),
    {
      name: 'levelup-tasks',
    }
  )
)
