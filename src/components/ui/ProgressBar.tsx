import { cn } from '../../utils/cn'

interface ProgressBarProps {
  current: number
  total: number
  size?: 'sm' | 'md' | 'lg'
  color?: 'purple' | 'teal' | 'blue' | 'green'
  showLabel?: boolean
  className?: string
}

function ProgressBar({
  current,
  total,
  size = 'md',
  color = 'purple',
  showLabel = true,
  className,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.min(100, (current / total) * 100) : 0
  
  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }
  
  const colors = {
    purple: 'bg-accent-purple',
    teal: 'bg-accent-teal',
    blue: 'bg-accent-blue',
    green: 'bg-green-500',
  }

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">
            Progress
          </span>
          <span className="text-sm font-medium text-white">
            {current} / {total}
          </span>
        </div>
      )}
      <div className={cn('w-full bg-dark-700 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', colors[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
