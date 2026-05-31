import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Lock, CheckCircle2, Circle, Zap, Target, TrendingUp, Award } from 'lucide-react'
import { useLifeAreaStore, useMilestoneStore } from '../stores'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useState } from 'react'
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
  const { addMilestone, completeMilestone, getMilestonesByLifeArea } = useMilestoneStore()
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMilestoneName, setNewMilestoneName] = useState('')
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('')

  const area = lifeAreas.find(a => a.id === areaId)
  const areaMilestones = areaId ? getMilestonesByLifeArea(areaId) : []

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

  const handleAddMilestone = () => {
    if (!newMilestoneName.trim() || !areaId) return
    addMilestone(areaId, newMilestoneName, newMilestoneDesc)
    setNewMilestoneName('')
    setNewMilestoneDesc('')
    setShowAddForm(false)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-dark-950">
      {/* Ambient Orbs with area color */}
      <div 
        className="ambient-orb w-[500px] h-[500px] -top-40 -right-40 animate-float"
        style={{ 
          background: `radial-gradient(circle, ${colorValue}40 0%, transparent 60%)`,
          filter: 'blur(80px)'
        }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to World Map
        </Link>

        {/* Area Header */}
        <div className="flex items-center gap-4 mb-8">
          <div 
            className="p-4 rounded-2xl"
            style={{ backgroundColor: `${colorValue}20` }}
          >
            <Icon className="w-8 h-8" color={colorValue} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">{area.name}</h1>
            <p className="text-gray-400">{areaMilestones.length} milestones • {area.color} branch</p>
          </div>
        </div>

        {/* Add Milestone Button */}
        {!showAddForm && (
          <Button 
            onClick={() => setShowAddForm(true)} 
            className="mb-6"
            style={{ 
              backgroundColor: colorValue,
              boxShadow: `0 0 30px ${colorValue}40`
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Milestone
          </Button>
        )}

        {/* Add Milestone Form */}
        {showAddForm && (
          <Card variant="glass" className="mb-6" padding="lg">
            <h3 className="text-lg font-semibold text-white mb-4">New Milestone</h3>
            <div className="space-y-4">
              <Input
                label="Milestone Name"
                placeholder="e.g., Complete 100 trades, Run 5km, Build portfolio"
                value={newMilestoneName}
                onChange={(e) => setNewMilestoneName(e.target.value)}
                autoFocus
              />
              <Input
                label="Description (optional)"
                placeholder="What needs to be done to complete this?"
                value={newMilestoneDesc}
                onChange={(e) => setNewMilestoneDesc(e.target.value)}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleAddMilestone}
                  disabled={!newMilestoneName.trim()}
                  style={{ backgroundColor: colorValue }}
                >
                  Create Milestone
                </Button>
                <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Milestones List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Milestones</h2>
          
          {areaMilestones.length === 0 ? (
            <Card variant="glass" className="text-center py-12" padding="lg">
              <p className="text-gray-500">No milestones yet. Create your first one!</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {areaMilestones.map((milestone, index) => (
                <Card 
                  key={milestone.id} 
                  variant={milestone.status === 'completed' ? 'default' : 'glass'}
                  className={`relative ${milestone.status === 'locked' ? 'opacity-60' : ''}`}
                  padding="md"
                >
                  <div className="flex items-center gap-4">
                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {milestone.status === 'completed' && (
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      )}
                      {milestone.status === 'active' && (
                        <Circle className="w-6 h-6 animate-pulse" color={colorValue} />
                      )}
                      {milestone.status === 'locked' && (
                        <Lock className="w-6 h-6 text-gray-600" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">#{index + 1}</span>
                        <h3 className={`font-semibold ${
                          milestone.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'
                        }`}>
                          {milestone.name}
                        </h3>
                      </div>
                      {milestone.description && (
                        <p className="text-sm text-gray-500 mt-1">{milestone.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          milestone.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          milestone.status === 'active' ? 'bg-accent-cyan/20 text-accent-cyan' :
                          'bg-gray-700 text-gray-400'
                        }`}>
                          {milestone.status}
                        </span>
                        {milestone.difficulty && (
                          <span className="text-xs text-gray-500 capitalize">
                            {milestone.difficulty}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {milestone.status === 'active' && (
                      <Button 
                        size="sm"
                        onClick={() => completeMilestone(milestone.id)}
                        style={{ backgroundColor: colorValue }}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-8 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Circle className="w-4 h-4 text-accent-cyan" /> Active
          </span>
          <span className="flex items-center gap-1">
            <Lock className="w-4 h-4" /> Locked
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-green-400" /> Completed
          </span>
        </div>
      </div>
    </div>
  )
}

export default LifeAreaPage
