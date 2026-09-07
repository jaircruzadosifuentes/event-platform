export interface Zone {
  name: string
  price: number
  capacity: number
}

export interface Event {
  id?: string
  name: string
  date: string
  location: string
  status?: string
  zones: Zone[]
}

export interface CreateEventRequest {
  name: string
  date: string
  location: string
  zones: Zone[]
  status: Number
}

export interface EventResponse {
  id: string
  name: string
  date: string
  location: string
  status: string
  zones: Zone[]
}