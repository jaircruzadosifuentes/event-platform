using EventService.Application.DTOs;
using EventService.Application.Interfaces;
using EventService.Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventService.Application.UseCases.CreateEvent
{
    public class CreateEventHandler : IRequestHandler<CreateEventCommand, EventResponse>
    {
        private readonly IEventRepository _eventRepository;

        public CreateEventHandler(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public async Task<EventResponse> Handle(
            CreateEventCommand request,
            CancellationToken cancellationToken)
        {
            var eventEntity = new Event(
                Guid.NewGuid(),
                request.Name,
                request.Date,
                request.Location);

            foreach (var zoneRequest in request.Zones)
            {
                var zone = new Zone(
                    Guid.NewGuid(),
                    eventEntity.Id,
                    zoneRequest.Name,
                    zoneRequest.Price,
                    zoneRequest.Capacity);

                eventEntity.AddZone(zone);
            }

            await _eventRepository.AddAsync(
                eventEntity,
                cancellationToken);

            await _eventRepository.SaveChangesAsync(
                cancellationToken);

            return new EventResponse
            {
                Id = eventEntity.Id,
                Name = eventEntity.Name,
                Date = eventEntity.Date,
                Location = eventEntity.Location,
                Status = eventEntity.Status.ToString(),
                Zones = eventEntity.Zones
                    .Select(z => new ZoneResponse
                    {
                        Id = z.Id,
                        Name = z.Name,
                        Price = z.Price,
                        Capacity = z.Capacity
                    })
                    .ToList()
            };
        }
    }
}
