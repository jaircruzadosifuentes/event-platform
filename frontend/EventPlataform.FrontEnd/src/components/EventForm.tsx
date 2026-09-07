import { useState } from 'react'
import ZoneForm from './ZoneForm'
import type {
  CreateEventRequest,
  Zone,
} from '../model/eventModel'

interface EventFormProps {
  onSubmit: (
    event: CreateEventRequest
  ) => Promise<void>
}

function EventForm({
  onSubmit,
}: EventFormProps) {

  const [event, setEvent] = useState<CreateEventRequest>({
    name: '',
    date: '',
    location: '',
    status: 2,
    zones: [
      {
        name: '',
        price: 0,
        capacity: 1,
      },
    ],
  })

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const handleEventChange = (
    field: keyof Omit<CreateEventRequest, 'zones'>,
    value: string
  ) => {
    setEvent((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleZoneChange = (
    index: number,
    field: keyof Zone,
    value: string
  ) => {
    setEvent((previous) => {
      const updatedZones = [...previous.zones]

      updatedZones[index] = {
        ...updatedZones[index],
        [field]:
          field === 'name'
            ? value
            : Number(value),
      }

      return {
        ...previous,
        zones: updatedZones,
      }
    })
  }

  const addZone = () => {
    setEvent((previous) => ({
      ...previous,
      zones: [
        ...previous.zones,
        {
          name: '',
          price: 0,
          capacity: 1,
        },
      ],
    }))
  }

  const removeZone = (index: number) => {
    setEvent((previous) => {

      if (previous.zones.length === 1) {
        return previous
      }

      return {
        ...previous,
        zones: previous.zones.filter(
          (_, zoneIndex) =>
            zoneIndex !== index
        ),
      }
    })
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (isSubmitting) {
      return
    }

    try {
      setIsSubmitting(true)

      await onSubmit(event)

    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">

      <div className="mx-auto max-w-4xl">

        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">

          <div className="border-b border-gray-200 px-6 py-6 md:px-8">

            <h1 className="text-2xl font-bold text-gray-900">
              Registrar Evento
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Completa la información del evento y sus zonas.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8 px-6 py-6 md:px-8"
          >

            {/* INFORMACIÓN DEL EVENTO */}

            <section>

              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Información del evento
              </h2>

              <div className="space-y-5">

                <div>

                  <label
                    htmlFor="event-name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Nombre del evento
                  </label>

                  <input
                    id="event-name"
                    type="text"
                    value={event.name}
                    onChange={(e) =>
                      handleEventChange(
                        'name',
                        e.target.value
                      )
                    }
                    placeholder="Ej. Conferencia de Tecnología 2026"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                <div>

                  <label
                    htmlFor="event-date"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Fecha
                  </label>

                  <input
                    id="event-date"
                    type="datetime-local"
                    value={event.date}
                    onChange={(e) =>
                      handleEventChange(
                        'date',
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                <div>

                  <label
                    htmlFor="event-location"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Ubicación
                  </label>

                  <input
                    id="event-location"
                    type="text"
                    value={event.location}
                    onChange={(e) =>
                      handleEventChange(
                        'location',
                        e.target.value
                      )
                    }
                    placeholder="Ej. Trujillo"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

            </section>

            {/* ZONAS */}

            <section>

              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <h2 className="text-lg font-semibold text-gray-900">
                    Zonas
                  </h2>

                  <p className="text-sm text-gray-500">
                    Define las zonas, precios y capacidades.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={addZone}
                  className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  + Agregar zona
                </button>

              </div>

              <div className="space-y-4">

                {event.zones.map(
                  (zone, index) => (
                    <ZoneForm
                      key={index}
                      zone={zone}
                      index={index}
                      totalZones={
                        event.zones.length
                      }
                      onChange={
                        handleZoneChange
                      }
                      onRemove={
                        removeZone
                      }
                    />
                  )
                )}

              </div>

            </section>

            {/* BOTÓN */}

            <div className="border-t border-gray-200 pt-6">

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isSubmitting
                  ? 'Registrando evento...'
                  : 'Registrar Evento'}
              </button>

            </div>

          </form>

        </div>

      </div>

    </main>
  )
}

export default EventForm