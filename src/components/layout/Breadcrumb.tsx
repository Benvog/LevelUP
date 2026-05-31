import { ChevronRight, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useLifeAreaStore } from '../../stores'

interface BreadcrumbItem {
  label: string
  path: string
  icon?: React.ReactNode
}

function Breadcrumb() {
  const location = useLocation()
  const { lifeAreas } = useLifeAreaStore()
  
  const pathSegments = location.pathname.split('/').filter(Boolean)
  
  const items: BreadcrumbItem[] = [{ label: 'Home', path: '/', icon: <Home className="w-4 h-4" /> }]
  
  if (pathSegments[0] === 'area' && pathSegments[1]) {
    const area = lifeAreas.find(a => a.id === pathSegments[1])
    items.push({
      label: area?.name || 'Life Area',
      path: `/area/${pathSegments[1]}`
    })
  }
  
  if (pathSegments[0] === 'milestone' && pathSegments[1]) {
    items.push({
      label: 'Milestone',
      path: `/milestone/${pathSegments[1]}`
    })
  }

  // Don't show breadcrumb on home page
  if (location.pathname === '/') return null

  return (
    <nav className="flex items-center gap-2 text-sm px-4 py-3 max-w-6xl mx-auto">
      <Link 
        to="/" 
        className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
      >
        <Home className="w-4 h-4" />
        World Map
      </Link>
      
      {items.slice(1).map((item, index) => (
        <div key={item.path} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <Link
            to={item.path}
            className={`flex items-center gap-1.5 transition-colors ${
              index === items.length - 2
                ? 'text-white font-medium'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  )
}

export default Breadcrumb
