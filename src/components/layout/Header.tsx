import { Zap } from 'lucide-react'

function Header() {
  return (
    <header className="glass-panel mx-4 mt-4 px-6 py-4">
      <div className="flex items-center gap-3">
        <Zap className="w-6 h-6 text-accent-cyan" />
        <h1 className="text-xl font-bold text-white tracking-wide">
          LevelUp
        </h1>
      </div>
    </header>
  )
}

export default Header
