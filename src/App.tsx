import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LifeAreaPage from './pages/LifeAreaPage'
import MilestonePage from './pages/MilestonePage'
import Header from './components/layout/Header'

function App() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/area/:areaId" element={<LifeAreaPage />} />
          <Route path="/milestone/:milestoneId" element={<MilestonePage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
