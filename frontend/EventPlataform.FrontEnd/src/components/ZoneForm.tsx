interface Zone {
  name: string
  price: number
  capacity: number
}

interface ZoneFormProps {
  zone: Zone
  index: number
  totalZones: number
  onChange: (
    index: number,
    field: keyof Zone,
    value: string
  ) => void
  onRemove: (index: number) => void
}

function ZoneForm({
  zone,
  index,
  totalZones,
  onChange,
  onRemove,
}: ZoneFormProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">
          Zona {index + 1}
        </h3>

        {totalZones > 1 && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Eliminar
          </button>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor={`zone-name-${index}`}
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Nombre
        </label>

        <input
          id={`zone-name-${index}`}
          type="text"
          value={zone.name}
          onChange={(e) =>
            onChange(index, 'name', e.target.value)
          }
          placeholder="Ej. VIP"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor={`zone-price-${index}`}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Precio
          </label>

          <input
            id={`zone-price-${index}`}
            type="number"
            min="0"
            step="0.01"
            value={zone.price}
            onChange={(e) =>
              onChange(index, 'price', e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor={`zone-capacity-${index}`}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Capacidad
          </label>

          <input
            id={`zone-capacity-${index}`}
            type="number"
            min="1"
            value={zone.capacity}
            onChange={(e) =>
              onChange(index, 'capacity', e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
    </div>
  )
}

export default ZoneForm