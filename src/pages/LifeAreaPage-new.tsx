import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Zap, Target, TrendingUp, Award, Clock, Infinity, Calendar, TrendingUp as TrendIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLifeAreaStore, useTemporalTaskStore, useGeneralTaskStore } from '../stores'
import BranchMap from '../components/map/BranchMap'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'

const ICONS: Record<string, React.ComponentType<{className?: string; color?: string}>> = {
  zap: Zap,
  target: Target,
  trending: TrendingUp,
  award: Award,
}

const COLORS: Record<string, string> = {
  cyan: '#06B6D4',
  teal: '#14B8A6',
  blue: '#3B82F6',
  amber: '#F59E0B',
  purple: '#8B5CF6',
  pink: '#EC4899',
}

function LifeAreaPage() {
  const { areaId } = useParams<{ areaId: string }>()
  const { lifeAreas } = useLifeAreaStore()
  const { addTemporalTask, getTasksByLifeArea: getTemporalTasks } = useTemporalTaskStore()
  const { addGeneralTask, getTasksByLifeArea: getGeneralTasks } = useGeneralTaskStore()
  
  // Form states
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showTemporalForm, setShowTemporalForm] = useState(false)
  const [showGeneralForm, setShowGeneralForm] = useState(false)
  
  // Temporal form fields
  const [tempName, setTempName] = useState('')
  const [tempTime, setTempTime] = useState('08:00')
  const [tempDate, setTempDate] = useState(new Date().toISOString().split('T')[0])
  const [tempRecurring, setTempRecurring] = useState(false)
  
  // General form fields
  const [genName, setGenName] = useState('')
  const [genTarget, setGenTarget] = useState(1)
  const [genDeadline, setGenDeadline] = useState('')
  const [genPriority, setGenPriority] = useState<'low' | 'medium' | 'high'>('medium')

  const area = lifeAreas.find(a => a.id === areaId)
  
  // Get stats for display
  const temporalTasks = areaId ? getTemporalTasks(areaId) : []
  const generalTasks = areaId ? getGeneralTasks(areaId) : []
  const completedTemporal = temporalTasks.filter(t => t.status === 'completed').length
  const activeStreaks = temporalTasks.filter(t => t.streak > 0).length

  if (!area) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h2 className="text-2xl font-bold text-white mb-4">Life Area Not Found</h2>
        <Link to="/" className="text-accent-cyan hover:underline">
          ← Back to World Map
        </Link>
      </div>
    )
  }

  const Icon = ICONS[area.icon] || Zap
  const colorValue = COLORS[area.color] || '#06B6D4'

  // Handlers
  const handleAddTemporal = () => {
    if (!tempName.trim() || !areaId) return
    addTemporalTask({
      lifeAreaId: areaId,
      name: tempName,
      scheduledDate: tempDate,
      scheduledTime: tempTime,
      isRecurring: tempRecurring,
      recurrencePattern: tempRecurring ? 'daily' : undefined,
    })
    setTempName('')
    setShowTemporalForm(false)
    setShowAddMenu(false)
  }

  const handleAddGeneral = () => {
    if (!genName.trim() || !areaId) return
    addGeneralTask({
      lifeAreaId: areaId,
      name: genName,
      targetCount: genTarget,
      priority: genPriority,
      softDeadline: genDeadline || undefined,
      isRecurring: false,
    })
    setGenName('')
    setGenTarget(1)
    setShowGeneralForm(false)
    setShowAddMenu(false)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-dark-950">
      {/* Ambient Orb with area color */}
      <div 
        className="ambient-orb w-[500px] h-[500px] -top-40 -right-40 animate-float"
        style={{ 
          background: `radial-gradient(circle, ${colorValue}30 0%, transparent 60%)`,
          filter: 'blur(80px)'
        }}
      />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to World Map
        </Link>

        {/* Area Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div 
              className="p-3 rounded-2xl"
              style={{ backgroundColor: `${colorValue}20` }}
            >
              <Icon className="w-8 h-8" color={colorValue} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{area.name}</h1>
              <p className="text-gray-400 text-sm">
                {temporalTasks.length} scheduled • {generalTasks.length} ongoing
              </p>
            </div>
          </div>
          
          {/* Stats Mini-Panel */}
          <div className="flex gap-4">
            <div className="text-center px-4 py-2 rounded-xl bg-dark-800/50">
              <div className="text-2xl font-bold" style={{ color: colorValue }}>
                {completedTemporal}
              </div>
              <div className="text-[10px] text-gray-500 uppercase">Done Today</div>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-dark-800/50">
              <div className="text-2xl font-bold text-amber-400">
                {activeStreaks}
              </div>
              <div className="text-[10px] text-gray-500 uppercase">Active Streaks</div>
            </div>
          </div>
        </div>

        {/* Branch Map - Main Visualization */}
        <div className="h-[550px] relative rounded-2xl overflow-hidden border border-dark-700/50 bg-dark-900/30">
          {areaId && (
            <BranchMap 
              lifeAreaId={areaId}
              areaName={area.name}
              areaColor={colorValue}
              areaIcon={area.icon}
            />
          )}
        </div>

        {/* Floating Add Button */}
        <div className="fixed bottom-8 right-8 z-50">
          {!showAddMenu ? (
            <Button 
              size="lg" 
              className="rounded-full w-14 h-14 p-0 shadow-2xl"
              style={{ 
                backgroundColor: colorValue,
                boxShadow: `0 0 30px ${colorValue}50`
              }}
              onClick={() => setShowAddMenu(true)}
            >
              <Plus className="w-6 h-6" />
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowTemporalForm(true)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-dark-800 text-white hover:bg-dark-700 transition-colors shadow-lg"
              >
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-sm">Scheduled Task</span>
              </button>
              <button
                onClick={() => setShowGeneralForm(true)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-dark-800 text-white hover:bg-dark-700 transition-colors shadow-lg"
              >
                <Infinity className="w-4 h-4 text-violet-400" />
                <span className="text-sm">Ongoing Goal</span>
              </button>
              <button
                onClick={() => setShowAddMenu(false)}
                className="w-10 h-10 rounded-full bg-dark-700 text-gray-400 hover:text-white mx-auto"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Temporal Task Form Modal */}
        {showTemporalForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <Card variant="glass" className="w-full max-w-md mx-4" padding="lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Add Scheduled Task
              </h3>
              
              <div className="space-y-4">
                <Input
                  label="Task Name"
                  placeholder="e.g., Gym, Morning Meditation, Check Charts"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  autoFocus
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Time</label>
                    <input
                      type="time"
                      value={tempTime}
                      onChange={(e) => setTempTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-white focus:border-accent-cyan focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                    <input
                      type="date"
                      value={tempDate}
                      onChange={(e) => setTempDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-white focus:border-accent-cyan focus:outline-none"
                    />
                  </div>
                </div>
                
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={tempRecurring}
                    onChange={(e) => setTempRecurring(e.target.checked)}
                    className="rounded border-dark-600"
                  />
                  Repeat daily (build streak)
                </label>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={handleAddTemporal}
                    disabled={!tempName.trim()}
                    className="flex-1"
                    style={{ backgroundColor: colorValue }}
                  >
                    Add Task
                  </Button>
                  <Button variant="ghost" onClick={() => setShowTemporalForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* General Task Form Modal */}
        {showGeneralForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <Card variant="glass" className="w-full max-w-md mx-4" padding="lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Infinity className="w-5 h-5 text-violet-400" />
                Add Ongoing Goal
              </h3>
              
              <div className="space-y-4">
                <Input
                  label="Goal Name"
                  placeholder="e.g., Read Books, Practice Coding, Build Network"
                  value={genName}
                  onChange={(e) => setGenName(e.target.value)}
                  autoFocus
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Target Count</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={genTarget}
                      onChange={(e) => setGenTarget(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-white focus:border-violet-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                    <select
                      value={genPriority}
                      onChange={(e) => setGenPriority(e.target.value as 'low' | 'medium' | 'high')}
                      className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-white focus:border-violet-400 focus:outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Soft Deadline (optional)
                  </label>
                  <input
                    type="date"
                    value={genDeadline}
                    onChange={(e) => setGenDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-white focus:border-violet-400 focus:outline-none"
                  />
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={handleAddGeneral}
                    disabled={!genName.trim()}
                    className="flex-1"
                    style={{ backgroundColor: '#8B5CF6' }}
                  >
                    Add Goal
                  </Button>
                  <Button variant="ghost" onClick={() => setShowGeneralForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default LifeAreaPage
