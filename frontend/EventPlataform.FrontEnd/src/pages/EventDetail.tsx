import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import eventService from '../services/eventService'
import type { EventResponse } from '../model/eventModel'

function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [event, setEvent] =
    useState<EventResponse | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {

    const loadEvent = async () => {

      if (!id) {
        setError('Evento no encontrado.')
        setLoading(false)
        return
      }

      try {

        setLoading(true)
        setError('')

        const response =
          await eventService.getById(id)

        setEvent(response)

      } catch (error) {

        console.error(
          'Error al obtener detalle:',
          error
        )

        setError(
          'No se pudo cargar el evento.'
        )

      } finally {

        setLoading(false)

      }
    }

    loadEvent()

  }, [id])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString(
      'es-PE',
      {
        dateStyle: 'full',
        timeStyle: 'short',
      }
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-10">

        <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 text-center shadow">

          <p className="text-sm text-gray-500">
            Cargando evento...
          </p>

        </div>

      </main>
    )
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-10">

        <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 text-center shadow">

          <h1 className="text-xl font-semibold text-gray-900">
            Evento no encontrado
          </h1>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate('/events')}
            className="mt-6 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Volver a eventos
          </button>

        </div>

      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">

      <div className="mx-auto max-w-4xl">

        <button
          type="button"
          onClick={() => navigate('/events')}
          className="mb-5 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Volver a eventos
        </button>

        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">

          <div className="border-b border-gray-200 p-6 md:p-8">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

              <div>

                <h1 className="text-3xl font-bold text-gray-900">
                  {event.name}
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  ID: {event.id}
                </p>

              </div>

              <span className="w-fit rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700">
                {event.status}
              </span>

            </div>

          </div>

          <div className="space-y-8 p-6 md:p-8">

            <section>

              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Información del evento
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div className="rounded-lg bg-gray-50 p-4">

                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Fecha
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatDate(event.date)}
                  </p>

                </div>

                <div className="rounded-lg bg-gray-50 p-4">

                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Ubicación
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {event.location}
                  </p>

                </div>

              </div>

            </section>

            <section>

              <div className="mb-4 flex items-center justify-between">

                <div>

                  <h2 className="text-lg font-semibold text-gray-900">
                    Zonas
                  </h2>

                  <p className="text-sm text-gray-500">
                    {event.zones.length} zonas configuradas
                  </p>

                </div>

              </div>

              <div className="space-y-4">

                {event.zones.map((zone) => (
                  <div
                    key={zone.name}
                    className="rounded-xl border border-gray-200 p-5"
                  >

                    <div className="mb-4">

                      <h3 className="text-base font-semibold text-gray-900">
                        {zone.name}
                      </h3>

                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                      <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          Precio
                        </p>

                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          S/ {zone.price.toFixed(2)}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          Capacidad
                        </p>

                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {zone.capacity}
                        </p>

                      </div>

                    </div>

                  </div>
                ))}

              </div>

            </section>

          </div>

        </div>

      </div>

    </main>
  )
}

export default EventDetail