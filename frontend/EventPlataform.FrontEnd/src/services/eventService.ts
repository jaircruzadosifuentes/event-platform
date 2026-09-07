import ApiClient from '../api/ApiClient'
import type {
  CreateEventRequest,
  EventResponse,
} from '../model/eventModel'

const eventService = {
  create: async (
    request: CreateEventRequest
  ): Promise<EventResponse> => {
    const response =
      await ApiClient.post<EventResponse>(
        '/events',
        request,
      )

    return response.data
  },

  getAll: async (): Promise<EventResponse[]> => {
    const response =
      await ApiClient.get<EventResponse[]>(
        '/events',
      )

    return response.data
  },

  getById: async (
    id: string
  ): Promise<EventResponse> => {
    const response =
      await ApiClient.get<EventResponse>(
        `/events/${id}`,
      )

    return response.data
  },
}

export default eventService