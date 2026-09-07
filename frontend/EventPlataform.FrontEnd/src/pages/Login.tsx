import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'

function Login() {
  const navigate = useNavigate()
  const [role, setRole] = useState<'Admin' | 'User'>('Admin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const handleLogin = async () => {
    try {
      setLoading(true)
      setError('')

      await authService.login(role)

      navigate('/events')
    } catch (error) {
      console.error('Error de autenticación:', error)
      setError('No se pudo iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Event Platform
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Inicia sesión para continuar
          </p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="role"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Rol
          </label>

          <select
            id="role"
            value={role}
            onChange={(e) =>
              setRole(
                e.target.value as
                  | 'Admin'
                  | 'User'
              )
            }
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
          >
            <option value="Admin">
              Administrador
            </option>

            <option value="User">
              Usuario
            </option>
          </select>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? 'Iniciando sesión...'
            : 'Iniciar sesión'}
        </button>

      </div>
    </main>
  )
}

export default Login