import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LifeAreaPage from './pages/LifeAreaPage'
import MilestonePage from './pages/MilestonePage'
import Header from './components/layout/Header'
import Breadcrumb from './components/layout/Breadcrumb'

function App() {
  return (
    <div className="min-h-screen bg-dark-950">
      <Header />
      <Breadcrumb />
      <main className="pb-12">
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
