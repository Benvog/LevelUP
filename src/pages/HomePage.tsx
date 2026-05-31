import { Zap, TrendingUp, Target, Award } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import ProgressBar from '../components/ui/ProgressBar'

function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient Background Orbs */}
      <div className="ambient-orb ambient-orb-cyan w-96 h-96 -top-48 -left-48 animate-float" />
      <div className="ambient-orb ambient-orb-blue w-80 h-80 top-1/3 -right-40 animate-float-delayed" />
      <div className="ambient-orb ambient-orb-teal w-64 h-64 bottom-20 left-1/4 animate-float" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center py-12 px-4 gap-12">
        
        {/* Hero Section */}
        <div className="text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800 border border-accent-cyan/30 mb-6">
            <Zap className="w-4 h-4 text-accent-cyan" />
            <span className="text-sm text-gray-300">Make locking in feel like leveling up</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gradient mb-6 leading-tight">
            LevelUp
          </h1>
          
          <p className="text-xl text-gray-400 leading-relaxed max-w-lg mx-auto">
            Track your progress across multiple life areas with a gamified map experience. 
            Complete milestones, build habits, and unlock your next level.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Button size="lg" className="glow-cyan">
              <TrendingUp className="w-5 h-5 mr-2" />
              Start Your Journey
            </Button>
            <Button variant="ghost" size="lg">
              Learn More
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {[
            { icon: Target, label: 'Milestones', value: '0', color: 'text-accent-cyan' },
            { icon: Zap, label: 'Tasks Done', value: '0', color: 'text-accent-teal' },
            { icon: TrendingUp, label: 'Habit Streak', value: '0', color: 'text-accent-blue' },
            { icon: Award, label: 'Completed', value: '0', color: 'text-accent-amber' },
          ].map((stat, i) => (
            <Card key={i} className="text-center group hover:scale-105 transition-transform" padding="md">
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Component Showcase */}
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-semibold text-white text-center mb-8">Design System</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buttons Card */}
            <Card className="glass-card" padding="lg">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-cyan" />
                Buttons
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </Card>

            {/* Input Card */}
            <Card className="glass-card" padding="lg">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-teal" />
                Input Fields
              </h3>
              <Input 
                placeholder="Enter your milestone..." 
                helperText="Helper text appears here"
              />
            </Card>

            {/* Progress Card */}
            <Card className="glass-card md:col-span-2" padding="lg">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-blue" />
                Progress Tracking
              </h3>
              <div className="space-y-4">
                <ProgressBar current={3} total={8} color="cyan" />
                <ProgressBar current={7} total={10} color="teal" />
                <ProgressBar current={5} total={5} color="green" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
