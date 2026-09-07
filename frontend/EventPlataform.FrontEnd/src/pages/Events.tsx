import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import eventService from '../services/eventService'
import authService from '../services/authService'
import type { EventResponse } from '../model/eventModel'

function Events() {
  const navigate = useNavigate()

  const [events, setEvents] = useState<EventResponse[]>([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')

  const role = authService.getRole()
  const isAdmin = role === 'Admin'

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await eventService.getAll()

      setEvents(response)
    } catch (error) {
      console.error('Error al obtener eventos:', error)

      setError('No se pudieron cargar los eventos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const handleLogout = () => {
    authService.logout()

    navigate('/login', {
      replace: true,
    })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString(
      'es-PE',
      {
        dateStyle: 'medium',
        timeStyle: 'short',
      }
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Eventos
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Consulta los eventos disponibles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">

            {isAdmin && (
              <button
                type="button"
                onClick={() =>
                  navigate('/events/create')
                }
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Crear evento
              </button>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cerrar sesión
            </button>

          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Cargando eventos...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadEvents}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          events.length === 0 && (
            <div className="rounded-xl bg-white p-10 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                No hay eventos
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Todavía no se han registrado eventos.
              </p>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() =>
                    navigate('/events/create')
                  }
                  className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Crear primer evento
                </button>
              )}
            </div>
          )}

        {/* Events */}
        {!loading &&
          !error &&
          events.length > 0 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
                >

                  <div className="mb-4 flex items-start justify-between gap-3">

                    <h2 className="text-lg font-semibold text-gray-900">
                      {event.name}
                    </h2>

                    {event.status && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        {event.status}
                      </span>
                    )}

                  </div>

                  <div className="space-y-2 text-sm text-gray-600">

                    <p>
                      <span className="font-medium text-gray-800">
                        Fecha:
                      </span>{' '}
                      {formatDate(event.date)}
                    </p>

                    <p>
                      <span className="font-medium text-gray-800">
                        Ubicación:
                      </span>{' '}
                      {event.location}
                    </p>

                    <p>
                      <span className="font-medium text-gray-800">
                        Zonas:
                      </span>{' '}
                      {event.zones.length}
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/events/${event.id}`
                      )
                    }
                    className="mt-6 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Ver detalle
                  </button>

                </div>
              ))}

            </div>
          )}

      </div>
    </main>
  )
}

export default Events