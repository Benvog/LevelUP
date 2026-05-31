import { useParams } from 'react-router-dom'

function MilestonePage() {
  const { milestoneId } = useParams<{ milestoneId: string }>()
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-bold text-white mb-4">
        Milestone: {milestoneId}
      </h2>
      <p className="text-gray-500">
        Task Board Detail coming soon...
      </p>
    </div>
  )
}

export default MilestonePage
