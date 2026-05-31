// LevelUp Type Definitions

export interface LifeArea {
  id: string;
  name: string;
  icon: string;
  color: string;
  isArchived: boolean;
  createdAt: string;
}

export type MilestoneStatus = 'locked' | 'active' | 'completed';

export interface Milestone {
  id: string;
  lifeAreaId: string;
  name: string;
  description?: string;
  status: MilestoneStatus;
  order: number;
  difficulty: 'easy' | 'medium' | 'hard';
  completedAt?: string;
  createdAt: string;
}

export type TaskType = 'checkbox' | 'habit' | 'dated' | 'journal';

interface BaseTask {
  id: string;
  milestoneId: string;
  name: string;
  type: TaskType;
  order: number;
  createdAt: string;
}

export interface CheckboxTask extends BaseTask {
  type: 'checkbox';
  isCompleted: boolean;
  completedAt?: string;
}

export interface HabitTask extends BaseTask {
  type: 'habit';
  streak: number;
  lastCompleted?: string;
  completions: string[]; // ISO dates
}

export interface DatedTask extends BaseTask {
  type: 'dated';
  dueDate: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface JournalTask extends BaseTask {
  type: 'journal';
  content: string;
  entries: JournalEntry[];
}

export interface JournalEntry {
  id: string;
  content: string;
  createdAt: string;
}

export type Task = CheckboxTask | HabitTask | DatedTask | JournalTask;

// Store state interfaces
export interface AppState {
  isOnboarded: boolean;
  lastVisited: string;
}

// Form data types
export interface LifeAreaFormData {
  name: string;
  icon: string;
  color: string;
}

export interface MilestoneFormData {
  name: string;
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TaskFormData {
  name: string;
  type: TaskType;
  dueDate?: string;
  initialContent?: string;
}
