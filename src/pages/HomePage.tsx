import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import ProgressBar from '../components/ui/ProgressBar'

function HomePage() {
  return (
    <div className="flex flex-col items-center py-8 gap-8">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-accent-purple text-glow mb-4">
          LevelUp
        </h1>
        <p className="text-gray-400 text-lg">
          Gamified Personal Progress Tracker
        </p>
      </div>

      {/* UI Components Showcase */}
      <Card className="w-full max-w-md" padding="lg">
        <h2 className="text-xl font-semibold text-white mb-6">UI Components</h2>
        
        {/* Buttons */}
        <div className="space-y-4 mb-6">
          <p className="text-sm text-gray-500 font-medium">Buttons</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </div>

        {/* Input */}
        <div className="space-y-4 mb-6">
          <p className="text-sm text-gray-500 font-medium">Input</p>
          <Input 
            placeholder="Enter your goal..." 
            helperText="This is helper text"
          />
        </div>

        {/* Progress */}
        <div className="space-y-4">
          <p className="text-sm text-gray-500 font-medium">Progress</p>
          <ProgressBar current={3} total={8} color="cyan" />
          <ProgressBar current={5} total={10} color="teal" />
        </div>
      </Card>

      {/* Card Variants */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        <Card variant="default" padding="md">
          <p className="text-sm text-gray-400">Default Card</p>
        </Card>
        <Card variant="glass" padding="md">
          <p className="text-sm text-gray-400">Glass Card</p>
        </Card>
        <Card variant="solid" padding="md">
          <p className="text-sm text-gray-400">Solid Card</p>
        </Card>
      </div>
    </div>
  )
}

export default HomePage
