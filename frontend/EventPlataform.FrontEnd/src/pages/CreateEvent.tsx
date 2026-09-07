import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import type {CreateEventRequest} from '../model/eventModel'

import EventForm from '../components/EventForm'
import eventService from '../services/eventService'

function CreateEvent() {
  const navigate = useNavigate()

  const [successMessage, setSuccessMessage] = useState('')

  const [errorMessage, setErrorMessage] = useState('')

  const handleCreateEvent = async (
    event: CreateEventRequest
  ) => {
    try {
      setSuccessMessage('')
      setErrorMessage('')

      await eventService.create(event)

      setSuccessMessage(
        'Evento registrado correctamente.'
      )

      setTimeout(() => {
        navigate('/events')
      }, 1000)

    } catch (error) {
      console.error(
        'Error al registrar el evento:',
        error
      )

      if (axios.isAxiosError(error)) {
        const data = error.response?.data

        if (
          data?.errors &&
          Array.isArray(data.errors)
        ) {
          const messages =
            data.errors
              .map(
                (item: {
                  field: string
                  message: string
                }) => item.message
              )
              .join(' ')

          setErrorMessage(messages)
          return
        }

        if (data?.message) {
          setErrorMessage(data.message)
          return
        }

        if (
          error.response?.status === 403
        ) {
          setErrorMessage(
            'No tienes permisos para crear eventos.'
          )
          return
        }

        if (
          error.response?.status === 401
        ) {
          setErrorMessage(
            'Tu sesión ha expirado. Inicia sesión nuevamente.'
          )
          return
        }

        setErrorMessage(
          `No se pudo registrar el evento. Código: ${
            error.response?.status ?? 'desconocido'
          }.`
        )

        return
      }

      setErrorMessage(
        'Ocurrió un error al registrar el evento.'
      )
    }
  }

  return (
    <div className="relative">

      {successMessage && (
        <div className="fixed right-5 top-5 z-50 rounded-lg border border-green-200 bg-green-50 px-5 py-4 shadow-lg">
          <p className="text-sm font-medium text-green-700">
            {successMessage}
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="fixed right-5 top-5 z-50 max-w-md rounded-lg border border-red-200 bg-red-50 px-5 py-4 shadow-lg">
          <p className="text-sm font-medium text-red-700">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={() =>
              setErrorMessage('')
            }
            className="mt-2 text-xs font-semibold text-red-600 underline"
          >
            Cerrar
          </button>
        </div>
      )}

      <EventForm
        onSubmit={handleCreateEvent}
      />

    </div>
  )
}

export default CreateEvent