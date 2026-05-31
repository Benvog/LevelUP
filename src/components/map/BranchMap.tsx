import { useRef, useEffect, useState } from 'react'
import { useTemporalTaskStore, useGeneralTaskStore } from '../../stores'
import { TemporalTaskNode, GeneralTaskNode, DualTaskNode } from './TaskNode'
import { Clock, Infinity, ChevronLeft, ChevronRight } from 'lucide-react'

interface BranchMapProps {
  lifeAreaId: string
  areaName: string
  areaColor: string
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

function addDays(date: string, days: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export function BranchMap({ lifeAreaId, areaName, areaColor }: BranchMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [viewDate, setViewDate] = useState(getTodayString())
  const [currentTime, setCurrentTime] = useState(new Date())

  const { 
    getTasksForDate, 
    getTasksByLifeArea,
    completeTask,
    checkAndUpdateStatuses,
    tasks: allTemporalTasks 
  } = useTemporalTaskStore()

  const { 
    getTasksByLifeArea: getGeneralTasks,
    getProgress,
    incrementProgress,
    completeTask: completeGeneralTask 
  } = useGeneralTaskStore()

  // Get tasks for current view date
  const temporalTasks = getTasksForDate(lifeAreaId, viewDate)
  const allGeneralTasks = getGeneralTasks(lifeAreaId)
  const allTemporal = getTasksByLifeArea(lifeAreaId)

  // Check for dual-nature tasks (tasks that appear in both systems)
  // For now, we'll treat them separately but positioned to show connection

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const { width, height } = svgRef.current.parentElement.getBoundingClientRect()
        setDimensions({ width, height: Math.max(500, height) })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Clock timer - updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Poll every 10 seconds to check for time-based status updates
  useEffect(() => {
    checkAndUpdateStatuses() // Check immediately on mount
    
    const interval = setInterval(() => {
      checkAndUpdateStatuses()
    }, 10000) // 10 seconds
    
    return () => clearInterval(interval)
  }, [checkAndUpdateStatuses])

  // Navigation
  const goToPreviousDay = () => setViewDate(prev => addDays(prev, -1))
  const goToNextDay = () => setViewDate(prev => addDays(prev, 1))
  const goToToday = () => setViewDate(getTodayString())

  const isToday = viewDate === getTodayString()
  const displayDate = new Date(viewDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })

  // Layout calculations
  const centerX = dimensions.width / 2
  const originY = 100
  const branchOffset = Math.min(180, dimensions.width * 0.22) // Distance from center to branch
  const nodeSpacing = 100 // Vertical space between nodes

  // Calculate node positions
  const temporalPositions = temporalTasks.map((task, index) => ({
    task,
    x: centerX - branchOffset,
    y: originY + 80 + (index * nodeSpacing)
  }))

  const generalPositions = allGeneralTasks.map((task, index) => ({
    task,
    progress: getProgress(task.id),
    x: centerX + branchOffset,
    y: originY + 80 + (index * nodeSpacing)
  }))

  // Handle task completion
  const handleTemporalComplete = (taskId: string) => {
    completeTask(taskId)
  }

  const handleGeneralIncrement = (taskId: string) => {
    incrementProgress(taskId)
  }

  return (
    <div className="relative w-full h-full min-h-[600px]">
      {/* Clock - Top Left */}
      <div className="absolute top-4 left-4 z-20">
        <div className="flex flex-col items-start">
          <div className="text-3xl font-mono font-bold text-accent-cyan tabular-nums drop-shadow-lg">
            {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            })}
          </div>
          <div className="text-sm text-gray-500">
            {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Date Navigation - Center Top */}
      <div className="flex items-center justify-center gap-4 mb-4 pt-2">
        <button 
          onClick={goToPreviousDay}
          className="p-2 rounded-lg bg-dark-800/80 hover:bg-dark-700 text-gray-400 hover:text-white transition-colors backdrop-blur"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="text-center min-w-[140px]">
          <h3 className="text-lg font-semibold text-white">{displayDate}</h3>
          {!isToday && (
            <button 
              onClick={goToToday}
              className="text-xs text-accent-cyan hover:text-white hover:underline transition-colors"
            >
              Back to Today
            </button>
          )}
        </div>
        
        <button 
          onClick={goToNextDay}
          className="p-2 rounded-lg bg-dark-800/80 hover:bg-dark-700 text-gray-400 hover:text-white transition-colors backdrop-blur"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* SVG Connections */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMin meet"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Vertical timeline from origin */}
        <line
          x1={centerX}
          y1={originY}
          x2={centerX}
          y2={dimensions.height}
          stroke="#334155"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* Temporal branch connections */}
        {temporalPositions.map(({ task, x, y }, index) => {
          const prevY = index === 0 ? originY : temporalPositions[index - 1].y
          return (
            <g key={task.id}>
              {/* Connector from center line */}
              <path
                d={`M ${centerX} ${y} Q ${centerX - branchOffset/2} ${y} ${x + 40} ${y}`}
                stroke={areaColor}
                strokeWidth="2"
                fill="none"
                opacity="0.4"
              />
              {/* Vertical connector to previous node */}
              {index > 0 && (
                <line
                  x1={x}
                  y1={prevY + 40}
                  x2={x}
                  y2={y - 40}
                  stroke={areaColor}
                  strokeWidth="2"
                  opacity="0.3"
                />
              )}
            </g>
          )
        })}

        {/* General branch connections */}
        {generalPositions.map(({ task, x, y }, index) => {
          const prevY = index === 0 ? originY : generalPositions[index - 1].y
          return (
            <g key={task.id}>
              {/* Connector from center line */}
              <path
                d={`M ${centerX} ${y} Q ${centerX + branchOffset/2} ${y} ${x - 40} ${y}`}
                stroke="#8B5CF6"
                strokeWidth="2"
                fill="none"
                opacity="0.4"
              />
              {/* Vertical connector */}
              {index > 0 && (
                <line
                  x1={x}
                  y1={prevY + 50}
                  x2={x}
                  y2={y - 50}
                  stroke="#8B5CF6"
                  strokeWidth="2"
                  opacity="0.3"
                />
              )}
            </g>
          )
        })}

        {/* Origin node */}
        <g>
          <circle
            cx={centerX}
            cy={originY}
            r="30"
            fill={`${areaColor}30`}
            filter="url(#glow)"
          />
          <circle
            cx={centerX}
            cy={originY}
            r="25"
            fill="#0F172A"
            stroke={areaColor}
            strokeWidth="2"
          />
          <text
            x={centerX}
            y={originY + 4}
            textAnchor="middle"
            fill={areaColor}
            fontSize="12"
            fontWeight="bold"
          >
            NOW
          </text>
        </g>

        {/* Branch headers */}
        <text
          x={centerX - branchOffset}
          y={originY + 50}
          textAnchor="middle"
          fill="#06B6D4"
          fontSize="11"
          fontWeight="500"
        >
          ⏰ SCHEDULED
        </text>
        <text
          x={centerX + branchOffset}
          y={originY + 50}
          textAnchor="middle"
          fill="#8B5CF6"
          fontSize="11"
          fontWeight="500"
        >
          ∞ ONGOING
        </text>
      </svg>

      {/* HTML Overlay - Task Nodes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Origin */}
        <div
          className="absolute pointer-events-auto"
          style={{
            left: `${(centerX / dimensions.width) * 100}%`,
            top: `${(originY / dimensions.height) * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div 
            className="w-[50px] h-[50px] rounded-full flex items-center justify-center text-xs font-bold"
            style={{ 
              backgroundColor: `${areaColor}20`,
              border: `2px solid ${areaColor}`,
              boxShadow: `0 0 20px ${areaColor}40`,
              color: areaColor
            }}
          >
            NOW
          </div>
        </div>

        {/* Temporal nodes */}
        {temporalPositions.map(({ task, x, y }) => (
          <div
            key={task.id}
            className="absolute pointer-events-auto"
            style={{
              left: `${(x / dimensions.width) * 100}%`,
              top: `${(y / dimensions.height) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <TemporalTaskNode
              task={task}
              onClick={() => {/* Open task detail modal */}}
              onComplete={() => handleTemporalComplete(task.id)}
            />
          </div>
        ))}

        {/* General nodes */}
        {generalPositions.map(({ task, x, y, progress }) => (
          <div
            key={task.id}
            className="absolute pointer-events-auto"
            style={{
              left: `${(x / dimensions.width) * 100}%`,
              top: `${(y / dimensions.height) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <GeneralTaskNode
              task={task}
              progress={progress}
              onClick={() => {/* Open task detail modal */}}
              onIncrement={() => handleGeneralIncrement(task.id)}
            />
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-6 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-cyan-400" /> Time-based
        </span>
        <span className="flex items-center gap-1">
          <Infinity className="w-3 h-3 text-violet-400" /> Ongoing goals
        </span>
      </div>
    </div>
  )
}

export default BranchMap
