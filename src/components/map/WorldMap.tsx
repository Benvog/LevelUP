import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLifeAreaStore, useMilestoneStore } from '../../stores'
import { 
  Zap, Target, TrendingUp, Award, Plus,
  Dumbbell, BookOpen, Briefcase, Heart, Music, Code, Coffee, Moon,
  Sun, DollarSign, Gamepad2, Plane, ShoppingBag, Camera, PenTool,
  MessageCircle, Brain, Sparkles, Flame, Anchor
} from 'lucide-react'
import Button from '../ui/Button'

const ICONS: Record<string, React.ComponentType<{className?: string; color?: string}>> = {
  zap: Zap,
  target: Target,
  trending: TrendingUp,
  award: Award,
  dumbbell: Dumbbell,
  book: BookOpen,
  briefcase: Briefcase,
  heart: Heart,
  music: Music,
  code: Code,
  coffee: Coffee,
  moon: Moon,
  sun: Sun,
  dollar: DollarSign,
  game: Gamepad2,
  plane: Plane,
  shopping: ShoppingBag,
  camera: Camera,
  pen: PenTool,
  message: MessageCircle,
  brain: Brain,
  sparkles: Sparkles,
  flame: Flame,
  anchor: Anchor,
}

const COLORS: Record<string, string> = {
  cyan: '#06B6D4',
  teal: '#14B8A6',
  emerald: '#10B981',
  green: '#22C55E',
  blue: '#3B82F6',
  indigo: '#6366F1',
  violet: '#8B5CF6',
  purple: '#A855F7',
  fuchsia: '#D946EF',
  pink: '#EC4899',
  rose: '#F43F5E',
  red: '#EF4444',
  orange: '#F97316',
  amber: '#F59E0B',
  yellow: '#EAB308',
  lime: '#84CC16',
  sky: '#0EA5E9',
  slate: '#64748B',
}

interface WorldMapProps {
  onAddArea: () => void
}

function WorldMap({ onAddArea }: WorldMapProps) {
  const { getActiveLifeAreas } = useLifeAreaStore()
  const { getMilestonesByLifeArea } = useMilestoneStore()
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  const lifeAreas = getActiveLifeAreas()

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const { width, height } = svgRef.current.parentElement.getBoundingClientRect()
        setDimensions({ width, height: Math.max(400, height) })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const getIconComponent = (iconName: string) => ICONS[iconName] || Zap
  const getColorValue = (colorName: string) => COLORS[colorName] || '#06B6D4'

  // Calculate positions for life areas (branching from center)
  const centerX = dimensions.width / 2
  const centerY = 100
  const branchLength = Math.min(280, dimensions.width * 0.35)
  const maxAngle = Math.min(160, 80 + lifeAreas.length * 20)

  const areaPositions = lifeAreas.map((area, index) => {
    const angle = lifeAreas.length === 1 
      ? 90 
      : 90 - maxAngle/2 + (maxAngle / (lifeAreas.length - 1 || 1)) * index
    const radian = (angle * Math.PI) / 180
    return {
      area,
      x: centerX + Math.cos(radian) * branchLength,
      y: centerY + Math.sin(radian) * (branchLength * 0.6),
      angle,
    }
  })

  return (
    <div className="relative w-full h-full min-h-[600px]">
      {/* SVG Map */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMin meet"
      >
        {/* Glow filter */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="strong-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connecting lines from center to each area */}
        {areaPositions.map(({ area, x, y }, index) => {
          const color = getColorValue(area.color)
          return (
            <g key={area.id}>
              {/* Path line with glow */}
              <path
                d={`M ${centerX} ${centerY} Q ${centerX} ${centerY + 50} ${x} ${y}`}
                stroke={color}
                strokeWidth="3"
                fill="none"
                filter="url(#glow)"
                opacity="0.6"
                className="animate-pulse"
                style={{ animationDelay: `${index * 0.2}s` }}
              />
              <path
                d={`M ${centerX} ${centerY} Q ${centerX} ${centerY + 50} ${x} ${y}`}
                stroke={color}
                strokeWidth="1"
                fill="none"
                opacity="0.3"
              />
            </g>
          )
        })}

        {/* Central Origin Node - Just for SVG background effect */}
        <g>
          <circle
            cx={centerX}
            cy={centerY}
            r="35"
            fill={`${COLORS.cyan}30`}
            filter="url(#strong-glow)"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r="30"
            fill="#0F172A"
            stroke={COLORS.cyan}
            strokeWidth="3"
          />
        </g>

        {/* Life Area Nodes */}
        {areaPositions.map(({ area, x, y }) => {
          const color = getColorValue(area.color)
          const milestones = getMilestonesByLifeArea(area.id)
          const completedCount = milestones.filter(m => m.status === 'completed').length
          const progress = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0

          return (
            <g key={area.id}>
              {/* Area circle with glow */}
              <circle
                cx={x}
                cy={y}
                r="40"
                fill={`${color}20`}
                stroke={color}
                strokeWidth="2"
                filter="url(#glow)"
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
              
              {/* Progress ring */}
              <circle
                cx={x}
                cy={y}
                r="36"
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeDasharray={`${progress * 2.26} 226`}
                strokeLinecap="round"
                transform={`rotate(-90 ${x} ${y})`}
                opacity="0.8"
              />

              {/* Icon placeholder - will be rendered as HTML overlay */}
            </g>
          )
        })}
      </svg>

      {/* HTML Overlay for interactive elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Central Origin */}
        <div
          className="absolute pointer-events-auto cursor-pointer"
          style={{
            left: '50%',
            top: `${(centerY / dimensions.height) * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-[60px] h-[60px] rounded-full bg-dark-900 border-2 border-accent-cyan flex items-center justify-center glow-cyan">
            <span className="text-xs font-bold text-accent-cyan">YOU</span>
          </div>
        </div>

        {/* Life Area Cards */}
        {areaPositions.map(({ area, x, y }) => {
          const color = getColorValue(area.color)
          const Icon = getIconComponent(area.icon)
          const milestones = getMilestonesByLifeArea(area.id)
          const completed = milestones.filter(m => m.status === 'completed').length
          const total = milestones.length

          return (
            <Link
              key={area.id}
              to={`/area/${area.id}`}
              className="absolute pointer-events-auto group"
              style={{
                left: `${(x / dimensions.width) * 100}%`,
                top: `${(y / dimensions.height) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div 
                className="w-28 h-28 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ 
                  backgroundColor: `${color}20`,
                  border: `2px solid ${color}`,
                  boxShadow: `0 0 40px ${color}40`,
                }}
              >
                <Icon className="w-7 h-7 mb-1" color={color} />
                <span 
                  className="text-[11px] font-medium text-white text-center px-2 leading-tight truncate max-w-[90%]"
                  title={area.name}
                >
                  {area.name.length > 10 ? area.name.slice(0, 10) + '...' : area.name}
                </span>
                {total > 0 && (
                  <span className="text-[9px] text-gray-400 mt-1">
                    {completed}/{total}
                  </span>
                )}
              </div>
            </Link>
          )
        })}

        {/* Add Area Button */}
        {lifeAreas.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <Button onClick={onAddArea} size="lg" className="glow-cyan">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Life Area
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default WorldMap
