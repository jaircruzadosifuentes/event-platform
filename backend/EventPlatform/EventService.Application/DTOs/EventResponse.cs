using System;
using System.Collections.Generic;
using System.Text;

namespace EventService.Application.DTOs
{
    public class EventResponse
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public DateTime Date { get; set; }

        public string Location { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public List<ZoneResponse> Zones { get; set; } = new();
    }

    public class ZoneResponse
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public int Capacity { get; set; }
    }
}
