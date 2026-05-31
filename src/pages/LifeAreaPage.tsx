import { useParams } from 'react-router-dom'

function LifeAreaPage() {
  const { areaId } = useParams<{ areaId: string }>()
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-bold text-white mb-4">
        Life Area: {areaId}
      </h2>
      <p className="text-gray-500">
        Branch View coming soon...
      </p>
    </div>
  )
}

export default LifeAreaPage
