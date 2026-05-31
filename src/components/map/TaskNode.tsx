import { Clock, Infinity, CheckCircle2, XCircle, AlertCircle, Flame } from 'lucide-react'
import { TemporalTask, TemporalTaskStatus } from '../../stores/useTemporalTaskStore'
import { GeneralTask } from '../../stores/useGeneralTaskStore'

// Node variants for temporal tasks
interface TemporalNodeProps {
  task: TemporalTask
  onClick: () => void
  onComplete: () => void
}

// Node variants for general tasks
interface GeneralNodeProps {
  task: GeneralTask
  progress: { completionPercent: number; timeElapsedPercent: number | null }
  onClick: () => void
  onIncrement: () => void
}

// Dual-nature task (appears on both branches)
interface DualNodeProps {
  temporalTask: TemporalTask
  generalProgress: { completionPercent: number; timeElapsedPercent: number | null }
  onClick: () => void
}

// Helper to get streak flame color
function getStreakColor(streak: number): string {
  if (streak >= 7) return '#8B5CF6' // Purple fire
  if (streak >= 3) return '#F59E0B' // Orange flame
  return 'transparent'
}

// TEMPORAL TASK NODE
export function TemporalTaskNode({ task, onClick, onComplete }: TemporalNodeProps) {
  const getStatusStyles = (status: TemporalTaskStatus) => {
    switch (status) {
      case 'locked':
        return {
          bg: 'rgba(30, 41, 59, 0.8)',
          border: '#475569',
          glow: 'none',
          icon: Clock,
          iconColor: '#64748B',
        }
      case 'active':
        return {
          bg: 'rgba(6, 182, 212, 0.15)',
          border: '#06B6D4',
          glow: '0 0 20px rgba(6, 182, 212, 0.4)',
          icon: Clock,
          iconColor: '#06B6D4',
        }
      case 'in-grace':
        return {
          bg: 'rgba(245, 158, 11, 0.15)',
          border: '#F59E0B',
          glow: '0 0 20px rgba(245, 158, 11, 0.4)',
          icon: AlertCircle,
          iconColor: '#F59E0B',
        }
      case 'completed':
        return {
          bg: 'rgba(34, 197, 94, 0.15)',
          border: '#22C55E',
          glow: '0 0 15px rgba(34, 197, 94, 0.3)',
          icon: CheckCircle2,
          iconColor: '#22C55E',
        }
      case 'missed':
        return {
          bg: 'rgba(239, 68, 68, 0.15)',
          border: '#EF4444',
          glow: 'none',
          icon: XCircle,
          iconColor: '#EF4444',
        }
    }
  }

  const styles = getStatusStyles(task.status)
  const Icon = styles.icon
  const streakColor = getStreakColor(task.streak)

  return (
    <div
      onClick={onClick}
      className="relative w-36 h-24 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105"
      style={{
        backgroundColor: styles.bg,
        border: `2px solid ${styles.border}`,
        boxShadow: styles.glow,
      }}
    >
      {/* Streak indicator */}
      {task.streak > 0 && (
        <div className="absolute -top-2 -right-2 flex items-center gap-0.5 bg-dark-900 rounded-full px-1.5 py-0.5 border border-dark-700">
          <Flame className="w-3 h-3" style={{ color: streakColor }} />
          <span className="text-[10px] font-bold" style={{ color: streakColor }}>
            {task.streak}
          </span>
        </div>
      )}

      {/* Icon */}
      <Icon className="w-5 h-5 mb-1" style={{ color: styles.iconColor }} />

      {/* Task name */}
      <span className="text-[10px] text-white text-center px-1 leading-tight truncate max-w-[90%]">
        {task.name}
      </span>

      {/* Time */}
      <span className="text-[9px] text-gray-400 mt-0.5">
        {task.scheduledTime}
      </span>

      {/* Grace period countdown */}
      {task.status === 'in-grace' && (
        <span className="text-[8px] text-amber-400 mt-0.5 animate-pulse">
          Grace period
        </span>
      )}

      {/* Complete button for active/grace */}
      {(task.status === 'active' || task.status === 'in-grace') && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onComplete()
          }}
          className="absolute -bottom-2 bg-green-500 hover:bg-green-400 text-white rounded-full p-1 shadow-lg transition-colors"
        >
          <CheckCircle2 className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}

// GENERAL TASK NODE
export function GeneralTaskNode({ task, progress, onClick, onIncrement }: GeneralNodeProps) {
  const isCompleted = task.status === 'completed'
  const isExpired = task.status === 'expired'

  // Calculate ring colors
  const outerRingColor = progress.timeElapsedPercent !== null
    ? progress.timeElapsedPercent > progress.completionPercent
      ? '#EF4444' // Red if behind schedule
      : '#06B6D4' // Cyan if on track
    : '#8B5CF6' // Purple if no deadline

  const innerRingColor = isCompleted ? '#22C55E' : '#F59E0B'

  return (
    <div
      onClick={onClick}
      className="relative w-36 h-28 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105"
      style={{
        backgroundColor: isExpired 
          ? 'rgba(239, 68, 68, 0.1)' 
          : 'rgba(139, 92, 246, 0.15)',
        border: `2px solid ${isExpired ? '#EF4444' : '#8B5CF6'}`,
        boxShadow: isExpired ? 'none' : '0 0 20px rgba(139, 92, 246, 0.3)',
      }}
    >
      {/* Dual progress rings */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Outer ring - time elapsed */}
        {progress.timeElapsedPercent !== null && (
          <>
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#1E293B"
              strokeWidth="3"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={outerRingColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${(progress.timeElapsedPercent / 100) * 264} 264`}
              className="transition-all duration-500"
            />
          </>
        )}
        
        {/* Inner ring - completion */}
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="#1E293B"
          strokeWidth="3"
        />
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke={innerRingColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${(progress.completionPercent / 100) * 220} 220`}
          className="transition-all duration-500"
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <Infinity className="w-5 h-5 mb-1" style={{ 
          color: isExpired ? '#EF4444' : isCompleted ? '#22C55E' : '#8B5CF6' 
        }} />
        
        <span className="text-[10px] text-white text-center px-1 leading-tight truncate max-w-[90%]">
          {task.name}
        </span>
        
        <span className="text-[9px] text-gray-400 mt-0.5">
          {task.currentCount}/{task.targetCount}
        </span>

        {task.softDeadline && (
          <span className="text-[8px] text-gray-500 mt-0.5">
            Due: {new Date(task.softDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}

        {isExpired && (
          <span className="text-[8px] text-red-400 mt-0.5">
            Expired
          </span>
        )}
      </div>

      {/* Increment button if not complete */}
      {!isCompleted && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onIncrement()
          }}
          className="absolute -bottom-2 bg-violet-500 hover:bg-violet-400 text-white rounded-full p-1 shadow-lg transition-colors"
        >
          <span className="text-[10px] font-bold px-1">+</span>
        </button>
      )}
    </div>
  )
}

// DUAL-NATURE TASK NODE (appears on both branches)
export function DualTaskNode({ temporalTask, generalProgress, onClick }: DualNodeProps) {
  const temporalStyles = (() => {
    switch (temporalTask.status) {
      case 'locked': return { border: '#475569', glow: 'none' }
      case 'active': return { border: '#06B6D4', glow: '0 0 20px rgba(6, 182, 212, 0.4)' }
      case 'in-grace': return { border: '#F59E0B', glow: '0 0 20px rgba(245, 158, 11, 0.4)' }
      case 'completed': return { border: '#22C55E', glow: '0 0 15px rgba(34, 197, 94, 0.3)' }
      case 'missed': return { border: '#EF4444', glow: 'none' }
    }
  })()

  const isGeneralComplete = generalProgress.completionPercent >= 100
  const outerRingColor = generalProgress.timeElapsedPercent !== null
    ? generalProgress.timeElapsedPercent > generalProgress.completionPercent
      ? '#EF4444'
      : '#06B6D4'
    : '#8B5CF6'

  return (
    <div
      onClick={onClick}
      className="relative w-40 h-28 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105"
      style={{
        background: `linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)`,
        border: `2px solid ${temporalStyles.border}`,
        boxShadow: temporalStyles.glow,
      }}
    >
      {/* Dual progress rings */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Outer - time pressure (temporal side) */}
        {generalProgress.timeElapsedPercent !== null && (
          <>
            <circle cx="50" cy="50" r="44" fill="none" stroke="#1E293B" strokeWidth="2" />
            <circle
              cx="50" cy="50"
              r="44"
              fill="none"
              stroke={outerRingColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${(generalProgress.timeElapsedPercent / 100) * 276} 276`}
            />
          </>
        )}
        
        {/* Inner - completion (general side) */}
        <circle cx="50" cy="50" r="36" fill="none" stroke="#1E293B" strokeWidth="3" />
        <circle
          cx="50" cy="50"
          r="36"
          fill="none"
          stroke={isGeneralComplete ? '#22C55E' : '#F59E0B'}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${(generalProgress.completionPercent / 100) * 226} 226`}
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Combined icon */}
        <div className="flex items-center gap-1 mb-1">
          <Clock className="w-4 h-4" style={{ color: temporalTask.status === 'completed' ? '#22C55E' : '#06B6D4' }} />
          <span className="text-gray-500 text-[10px]">+</span>
          <Infinity className="w-4 h-4" style={{ color: isGeneralComplete ? '#22C55E' : '#8B5CF6' }} />
        </div>
        
        <span className="text-[10px] text-white text-center px-1 leading-tight truncate max-w-[90%]">
          {temporalTask.name}
        </span>
        
        <span className="text-[9px] text-gray-400 mt-0.5">
          {temporalTask.scheduledTime} • {Math.round(generalProgress.completionPercent)}%
        </span>

        {temporalTask.streak > 0 && (
          <div className="flex items-center gap-0.5 mt-0.5">
            <Flame className="w-3 h-3" style={{ color: getStreakColor(temporalTask.streak) }} />
            <span className="text-[9px]" style={{ color: getStreakColor(temporalTask.streak) }}>
              {temporalTask.streak}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
