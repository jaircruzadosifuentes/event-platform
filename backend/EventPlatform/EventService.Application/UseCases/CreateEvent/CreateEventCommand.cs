using EventService.Application.DTOs;
using MediatR;

namespace EventService.Application.UseCases.CreateEvent
{
    public record CreateEventCommand(
        string Name,
        DateTime Date,
        string Location,
        List<CreateZoneRequest> Zones
    ) : IRequest<EventResponse>;
}
