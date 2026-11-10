import { RefreshCw } from 'lucide-react'

function LoadingState() {
  return <div className="loading-state"><RefreshCw className="spin" size={25} /><span>Consultando datos de FastAPI...</span></div>
}

export default LoadingState
