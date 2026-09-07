using System;
using System.Collections.Generic;
using System.Text;

namespace EventService.Domain
{
    public class Event
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; } = string.Empty;
        public DateTime Date { get; private set; }
        public string Location { get; private set; } = string.Empty;
        public EventStatus Status { get; private set; }

        private readonly List<Zone> _zones = new();

        public IReadOnlyCollection<Zone> Zones => _zones.AsReadOnly();

        private Event()
        {
        }

        public Event(Guid id, string name, DateTime date, string location)
        {
            Id = id;
            Name = name;
            Date = date;
            Location = location;
            Status = EventStatus.Published;
        }

        public void AddZone(Zone zone)
        {
            _zones.Add(zone);
        }
        public void Publish()
        {
            Status = EventStatus.Published;
        }

    }
}
