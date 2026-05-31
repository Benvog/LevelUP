import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'solid'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'glass', padding = 'md', children, ...props }, ref) => {
    const baseStyles = 'rounded-xl border transition-all duration-200'
    
    const variants = {
      default: 'bg-dark-800 border-dark-600',
      glass: 'bg-dark-800/80 backdrop-blur-sm border-dark-600/50',
      solid: 'bg-dark-800 border-dark-700',
    }
    
    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    }

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], paddings[padding], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
