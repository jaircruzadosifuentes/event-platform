using System;
using System.Collections.Generic;
using System.Text;

namespace EventService.Domain
{
    public class Zone
    {
        public Guid Id { get; private set; }

        public Guid EventId { get; private set; }

        public string Name { get; private set; } = string.Empty;

        public decimal Price { get; private set; }

        public int Capacity { get; private set; }

        private Zone()
        {
        }

        public Zone(
            Guid id,
            Guid eventId,
            string name,
            decimal price,
            int capacity)
        {
            Id = id;
            EventId = eventId;
            Name = name;
            Price = price;
            Capacity = capacity;
        }
    }
}
