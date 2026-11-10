const API_BASE_URL = 'http://127.0.0.1:8000'

async function getJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`)
  if (!response.ok) throw new Error(`La API respondió con el estado ${response.status}.`)
  const payload = await response.json()
  if (payload.success === false) throw new Error(payload.message || 'La API indicó que la solicitud no fue exitosa.')
  return payload
}

export async function fetchDashboardData() {
  try {
    const [health, transactionsResponse, executionsResponse, logsResponse] = await Promise.all([
      getJson('/api/health'),
      getJson('/api/transacciones?account=800002'),
      getJson('/api/ejecuciones'),
      getJson('/api/logs?account=800002&limite=500'),
    ])
    return {
      health,
      transactions: Array.isArray(transactionsResponse.datos) ? transactionsResponse.datos : [],
      executions: Array.isArray(executionsResponse.datos) ? executionsResponse.datos : [],
      logs: Array.isArray(logsResponse.datos) ? logsResponse.datos : [],
    }
  } catch (error) {
    if (error instanceof TypeError) throw new Error('No se pudo acceder a FastAPI. Verifica que el backend esté ejecutándose y permita solicitudes CORS.', { cause: error })
    throw error
  }
}
