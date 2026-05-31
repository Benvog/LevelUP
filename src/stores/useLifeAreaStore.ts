import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LifeArea } from '../types'
import { v4 as uuidv4 } from 'uuid'

interface LifeAreaState {
  lifeAreas: LifeArea[]
  addLifeArea: (name: string, icon: string, color: string) => void
  updateLifeArea: (id: string, updates: Partial<LifeArea>) => void
  archiveLifeArea: (id: string) => void
  restoreLifeArea: (id: string) => void
  deleteLifeArea: (id: string) => void
  getActiveLifeAreas: () => LifeArea[]
  getArchivedLifeAreas: () => LifeArea[]
}

export const useLifeAreaStore = create<LifeAreaState>()(
  persist(
    (set, get) => ({
      lifeAreas: [],

      addLifeArea: (name, icon, color) => {
        const newArea: LifeArea = {
          id: uuidv4(),
          name,
          icon,
          color,
          isArchived: false,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          lifeAreas: [...state.lifeAreas, newArea],
        }))
      },

      updateLifeArea: (id, updates) => {
        set((state) => ({
          lifeAreas: state.lifeAreas.map((area) =>
            area.id === id ? { ...area, ...updates } : area
          ),
        }))
      },

      archiveLifeArea: (id) => {
        set((state) => ({
          lifeAreas: state.lifeAreas.map((area) =>
            area.id === id ? { ...area, isArchived: true } : area
          ),
        }))
      },

      restoreLifeArea: (id) => {
        set((state) => ({
          lifeAreas: state.lifeAreas.map((area) =>
            area.id === id ? { ...area, isArchived: false } : area
          ),
        }))
      },

      deleteLifeArea: (id) => {
        set((state) => ({
          lifeAreas: state.lifeAreas.filter((area) => area.id !== id),
        }))
      },

      getActiveLifeAreas: () => {
        return get().lifeAreas.filter((area) => !area.isArchived)
      },

      getArchivedLifeAreas: () => {
        return get().lifeAreas.filter((area) => area.isArchived)
      },
    }),
    {
      name: 'levelup-lifeareas',
    }
  )
)
