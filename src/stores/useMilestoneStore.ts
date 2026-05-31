import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Milestone, MilestoneStatus } from '../types'
import { v4 as uuidv4 } from 'uuid'

interface MilestoneState {
  milestones: Milestone[]
  addMilestone: (lifeAreaId: string, name: string, description?: string, difficulty?: 'easy' | 'medium' | 'hard') => void
  updateMilestone: (id: string, updates: Partial<Milestone>) => void
  completeMilestone: (id: string) => void
  deleteMilestone: (id: string) => void
  getMilestonesByLifeArea: (lifeAreaId: string) => Milestone[]
  getActiveMilestone: (lifeAreaId: string) => Milestone | undefined
  getNextMilestone: (lifeAreaId: string) => Milestone | undefined
  unlockNextMilestone: (completedMilestoneId: string) => void
  reorderMilestones: (lifeAreaId: string, newOrder: string[]) => void
}

export const useMilestoneStore = create<MilestoneState>()(
  persist(
    (set, get) => ({
      milestones: [],

      addMilestone: (lifeAreaId, name, description, difficulty = 'medium') => {
        const areaMilestones = get().milestones.filter(m => m.lifeAreaId === lifeAreaId)
        const hasActive = areaMilestones.some(m => m.status === 'active')
        
        const newMilestone: Milestone = {
          id: uuidv4(),
          lifeAreaId,
          name,
          description,
          status: hasActive ? 'locked' : 'active',
          order: areaMilestones.length,
          difficulty,
          createdAt: new Date().toISOString(),
        }
        
        set((state) => ({
          milestones: [...state.milestones, newMilestone],
        }))
      },

      updateMilestone: (id, updates) => {
        set((state) => ({
          milestones: state.milestones.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        }))
      },

      completeMilestone: (id) => {
        const milestone = get().milestones.find(m => m.id === id)
        if (!milestone) return

        set((state) => ({
          milestones: state.milestones.map((m) =>
            m.id === id 
              ? { ...m, status: 'completed' as MilestoneStatus, completedAt: new Date().toISOString() } 
              : m
          ),
        }))

        // Auto-unlock next milestone
        get().unlockNextMilestone(id)
      },

      deleteMilestone: (id) => {
        set((state) => ({
          milestones: state.milestones.filter((m) => m.id !== id),
        }))
      },

      getMilestonesByLifeArea: (lifeAreaId) => {
        return get()
          .milestones
          .filter((m) => m.lifeAreaId === lifeAreaId)
          .sort((a, b) => a.order - b.order)
      },

      getActiveMilestone: (lifeAreaId) => {
        return get().milestones.find(
          (m) => m.lifeAreaId === lifeAreaId && m.status === 'active'
        )
      },

      getNextMilestone: (lifeAreaId) => {
        const areaMilestones = get()
          .milestones
          .filter((m) => m.lifeAreaId === lifeAreaId)
          .sort((a, b) => a.order - b.order)
        
        return areaMilestones.find((m) => m.status === 'locked')
      },

      unlockNextMilestone: (completedMilestoneId) => {
        const completed = get().milestones.find(m => m.id === completedMilestoneId)
        if (!completed) return

        const nextMilestone = get()
          .milestones
          .filter(m => m.lifeAreaId === completed.lifeAreaId && m.status === 'locked')
          .sort((a, b) => a.order - b.order)[0]

        if (nextMilestone) {
          set((state) => ({
            milestones: state.milestones.map((m) =>
              m.id === nextMilestone.id ? { ...m, status: 'active' as MilestoneStatus } : m
            ),
          }))
        }
      },

      reorderMilestones: (lifeAreaId, newOrder) => {
        set((state) => ({
          milestones: state.milestones.map((m) => {
            if (m.lifeAreaId !== lifeAreaId) return m
            const newIndex = newOrder.indexOf(m.id)
            return newIndex >= 0 ? { ...m, order: newIndex } : m
          }),
        }))
      },
    }),
    {
      name: 'levelup-milestones',
    }
  )
)
