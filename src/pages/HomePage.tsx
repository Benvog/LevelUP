import { useState } from 'react'
import { 
  Zap, Plus, Archive, RotateCcw, Trash2, TrendingUp, Target, Award,
  Dumbbell, BookOpen, Briefcase, Heart, Music, Code, Coffee, Moon,
  Sun, DollarSign, Gamepad2, Plane, ShoppingBag, Camera, PenTool,
  MessageCircle, Brain, Sparkles, Flame, Anchor, Rocket, Gem, Crown
} from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import WorldMap from '../components/map/WorldMap'
import { useLifeAreaStore } from '../stores'

const ICONS = [
  { name: 'zap', icon: Zap },
  { name: 'target', icon: Target },
  { name: 'trending', icon: TrendingUp },
  { name: 'award', icon: Award },
  { name: 'dumbbell', icon: Dumbbell },
  { name: 'book', icon: BookOpen },
  { name: 'briefcase', icon: Briefcase },
  { name: 'heart', icon: Heart },
  { name: 'music', icon: Music },
  { name: 'code', icon: Code },
  { name: 'coffee', icon: Coffee },
  { name: 'moon', icon: Moon },
  { name: 'sun', icon: Sun },
  { name: 'dollar', icon: DollarSign },
  { name: 'game', icon: Gamepad2 },
  { name: 'plane', icon: Plane },
  { name: 'shopping', icon: ShoppingBag },
  { name: 'camera', icon: Camera },
  { name: 'pen', icon: PenTool },
  { name: 'message', icon: MessageCircle },
  { name: 'brain', icon: Brain },
  { name: 'sparkles', icon: Sparkles },
  { name: 'flame', icon: Flame },
  { name: 'anchor', icon: Anchor },
]

const COLORS = [
  { name: 'cyan', value: '#06B6D4' },
  { name: 'teal', value: '#14B8A6' },
  { name: 'emerald', value: '#10B981' },
  { name: 'green', value: '#22C55E' },
  { name: 'blue', value: '#3B82F6' },
  { name: 'indigo', value: '#6366F1' },
  { name: 'violet', value: '#8B5CF6' },
  { name: 'purple', value: '#A855F7' },
  { name: 'fuchsia', value: '#D946EF' },
  { name: 'pink', value: '#EC4899' },
  { name: 'rose', value: '#F43F5E' },
  { name: 'red', value: '#EF4444' },
  { name: 'orange', value: '#F97316' },
  { name: 'amber', value: '#F59E0B' },
  { name: 'yellow', value: '#EAB308' },
  { name: 'lime', value: '#84CC16' },
  { name: 'sky', value: '#0EA5E9' },
  { name: 'slate', value: '#64748B' },
]

function HomePage() {
  const { 
    lifeAreas, 
    addLifeArea, 
    archiveLifeArea, 
    restoreLifeArea, 
    deleteLifeArea,
    getActiveLifeAreas,
    getArchivedLifeAreas 
  } = useLifeAreaStore()

  const [newAreaName, setNewAreaName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('zap')
  const [selectedColor, setSelectedColor] = useState('cyan')
  const [showArchived, setShowArchived] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const activeAreas = getActiveLifeAreas()
  const archivedAreas = getArchivedLifeAreas()

  const handleAddArea = () => {
    if (!newAreaName.trim()) return
    addLifeArea(newAreaName, selectedIcon, selectedColor)
    setNewAreaName('')
    setShowForm(false)
  }

  const getIconComponent = (iconName: string) => {
    const found = ICONS.find(i => i.name === iconName)
    return found?.icon || Zap
  }

  const getColorValue = (colorName: string) => {
    const found = COLORS.find(c => c.name === colorName)
    return found?.value || '#06B6D4'
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-dark-950">
      {/* Ambient Orbs */}
      <div className="ambient-orb ambient-orb-cyan w-[600px] h-[600px] -top-40 -left-40 animate-float" />
      <div className="ambient-orb ambient-orb-blue w-[500px] h-[500px] top-1/4 -right-60 animate-float-delayed" />
      <div className="ambient-orb ambient-orb-teal w-[400px] h-[400px] bottom-0 left-1/3 animate-float-slow" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center py-12 px-4 gap-8 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gradient mb-4">World Map</h1>
          <p className="text-gray-400">Your journey across different life areas. Click any branch to explore.</p>
        </div>

        {/* Add Area Button */}
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="lg" className="glow-cyan">
            <Plus className="w-5 h-5 mr-2" />
            Add New Life Area
          </Button>
        )}

        {/* Add New Area Form */}
        {showForm && (
        <Card variant="glass" className="w-full max-w-2xl" padding="lg">
          <h2 className="text-xl font-semibold text-white mb-4">Add New Life Area</h2>
          
          <div className="space-y-4">
            <Input 
              label="Area Name"
              placeholder="e.g., Forex Trading, Fitness, Software Development"
              value={newAreaName}
              onChange={(e) => setNewAreaName(e.target.value)}
            />

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
              <div className="flex gap-2">
                {ICONS.map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    onClick={() => setSelectedIcon(name)}
                    className={`p-3 rounded-xl transition-all ${
                      selectedIcon === name 
                        ? 'bg-accent-cyan text-white' 
                        : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Accent Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map(({ name, value }) => (
                  <button
                    key={name}
                    onClick={() => setSelectedColor(name)}
                    className={`w-10 h-10 rounded-xl transition-all ${
                      selectedColor === name 
                        ? 'ring-2 ring-white scale-110' 
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: value }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleAddArea} 
                disabled={!newAreaName.trim()}
                className="flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Life Area
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
        )}

        {/* World Map */}
        <div className="w-full h-[500px] relative">
          {activeAreas.length > 0 ? (
            <WorldMap onAddArea={() => setShowForm(true)} />
          ) : (
            <Card variant="glass" className="h-full flex flex-col items-center justify-center" padding="lg">
              <p className="text-gray-500 mb-4">No life areas yet. Create your first branch!</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Life Area
              </Button>
            </Card>
          )}
        </div>

        {/* Archived Areas Toggle */}
        {archivedAreas.length > 0 && (
          <div className="w-full">
            <button 
              onClick={() => setShowArchived(!showArchived)}
              className="text-sm text-gray-500 hover:text-white mb-4"
            >
              {showArchived ? 'Hide' : 'Show'} Archived ({archivedAreas.length})
            </button>
            
            {showArchived && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {archivedAreas.map((area) => {
                  const Icon = getIconComponent(area.icon)
                  const colorValue = getColorValue(area.color)
                  
                  return (
                    <Card key={area.id} variant="default" className="opacity-60" padding="md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-xl bg-dark-800">
                            <Icon className="w-5 h-5" color={colorValue} />
                          </div>
                          <span className="font-medium text-gray-400">{area.name}</span>
                        </div>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => restoreLifeArea(area.id)}
                            className="p-2 rounded-lg hover:bg-dark-700 text-gray-400 hover:text-white"
                            title="Restore"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteLifeArea(area.id)}
                            className="p-2 rounded-lg hover:bg-red-900/50 text-gray-400 hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default HomePage
