export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const RETRY_COUNT = 2
const RETRY_DELAY_MS = 1000

class ApiError extends Error {
  constructor(message, status, options) {
    super(message, options)
    this.name = 'ApiError'
    this.status = status
  }
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

async function getJson(path) {
  let lastError
  for (let attempt = 0; attempt <= RETRY_COUNT; attempt += 1) {
    try {
      const response = await fetch(`${API_BASE_URL}${path}`)
      const responseText = await response.text()
      if (!response.ok) {
        throw new ApiError(
          `La API respondió con el estado ${response.status} ${response.statusText}: ${responseText || 'sin detalles'}.`,
          response.status,
        )
      }
      const payload = JSON.parse(responseText)
      if (payload.success === false) throw new ApiError(payload.message || 'La API indicó que la solicitud no fue exitosa.', response.status)
      return payload
    } catch (error) {
      lastError = error instanceof ApiError
        ? error
        : new ApiError('No se pudo acceder a la API.', undefined, { cause: error })
      if (attempt < RETRY_COUNT) await wait(RETRY_DELAY_MS)
    }
  }
  throw lastError
}

export async function fetchDashboardData() {
  let health = null
  let healthError = null
  try {
    health = await getJson('/api/health')
  } catch (error) {
    healthError = error
  }

  const endpointResults = await Promise.allSettled([
    getJson('/api/transacciones?account=800002'),
    getJson('/api/ejecuciones'),
    getJson('/api/logs?account=800002&limite=500'),
  ])
  const endpointError = endpointResults.find((result) => result.status === 'rejected')?.reason
  if (endpointError) {
    endpointError.healthError = healthError
    endpointError.healthOk = Boolean(health)
    throw endpointError
  }

  return {
    health,
    healthError,
    transactions: Array.isArray(endpointResults[0].value.datos) ? endpointResults[0].value.datos : [],
    executions: Array.isArray(endpointResults[1].value.datos) ? endpointResults[1].value.datos : [],
    logs: Array.isArray(endpointResults[2].value.datos) ? endpointResults[2].value.datos : [],
  }
}
