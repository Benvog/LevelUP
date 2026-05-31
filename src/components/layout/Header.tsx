import { Zap, Settings } from 'lucide-react'

function Header() {
  return (
    <header className="relative z-20 mx-4 mt-4 px-6 py-4">
      <div className="glass-panel flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Zap className="w-6 h-6 text-accent-cyan" />
            <div className="absolute inset-0 w-6 h-6 bg-accent-cyan/30 blur-lg rounded-full" />
          </div>
          <h1 className="text-xl font-bold text-gradient tracking-wide">
            LevelUp
          </h1>
        </div>
        
        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}

export default Header
