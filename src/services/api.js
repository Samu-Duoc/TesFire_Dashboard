export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://test-fire-api-ashen.vercel.app').replace(/\/+$/, '')

const RETRY_COUNT = 2
const RETRY_DELAY_MS = 1000
const REQUEST_TIMEOUT_MS = 8000

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
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    try {
      const response = await fetch(`${API_BASE_URL}${path}`, { signal: controller.signal })
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
        : new ApiError(
          error?.name === 'AbortError'
            ? 'La solicitud a la API superó el tiempo máximo de 8 segundos.'
            : 'No se pudo acceder a la API.',
          undefined,
          { cause: error },
        )
    } finally {
      clearTimeout(timeoutId)
    }
    if (attempt < RETRY_COUNT) {
      await wait(RETRY_DELAY_MS)
    }
  }
  throw lastError
}

export async function fetchDashboardData() {
  const results = await Promise.allSettled([
    getJson('/api/health'),
    getJson('/api/transacciones?account=800002'),
    getJson('/api/ejecuciones'),
    getJson('/api/logs?account=800002&limite=500'),
  ])
  const [healthResult, transactionsResult, executionsResult, logsResult] = results
  const errors = results
    .map((result, index) => result.status === 'rejected' ? { index, error: result.reason } : null)
    .filter(Boolean)

  return {
    health: healthResult.status === 'fulfilled' ? healthResult.value : null,
    healthError: healthResult.status === 'rejected' ? healthResult.reason : null,
    transactions: transactionsResult.status === 'fulfilled' && Array.isArray(transactionsResult.value.datos) ? transactionsResult.value.datos : [],
    executions: executionsResult.status === 'fulfilled' && Array.isArray(executionsResult.value.datos) ? executionsResult.value.datos : [],
    logs: logsResult.status === 'fulfilled' && Array.isArray(logsResult.value.datos) ? logsResult.value.datos : [],
    errors,
  }
}
