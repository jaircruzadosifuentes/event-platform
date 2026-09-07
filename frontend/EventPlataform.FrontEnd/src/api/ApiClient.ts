import axios, {
  HttpStatusCode,
  type AxiosError,
  type AxiosRequestConfig,
} from 'axios'

interface RequestMetadata {
  startTime?: number
}

interface CustomAxiosRequestConfig
  extends AxiosRequestConfig {
  metadata?: RequestMetadata
}

const ApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

ApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    const customConfig =
      config as CustomAxiosRequestConfig

    customConfig.metadata = {
      startTime: performance.now(),
    }

    return config
  },
  (error) => Promise.reject(error),
)

ApiClient.interceptors.response.use(
  (response) => {
    const config =
      response.config as CustomAxiosRequestConfig

    const startTime =
      config.metadata?.startTime

    if (startTime) {
      const durationMs =
        performance.now() - startTime

      console.log(
        `API ${response.config.method?.toUpperCase()} ${response.config.url} - ${durationMs.toFixed(0)}ms`,
      )
    }

    return response
  },
  async (error: AxiosError) => {
    if (
      error.response?.status ===
      HttpStatusCode.Unauthorized
    ) {
      localStorage.removeItem('authToken')

      window.location.href = '/'
    }

    if (error.code === 'ECONNABORTED') {
      window.dispatchEvent(
        new CustomEvent('api:timeout', {
          detail: {
            message:
              'El servidor está tardando demasiado en responder.',
          },
        }),
      )
    }

    if (!error.response) {
      window.dispatchEvent(
        new CustomEvent('api:offline', {
          detail: {
            message:
              'No se pudo conectar con el servidor.',
          },
        }),
      )
    }

    return Promise.reject(error)
  },
)

export default ApiClient