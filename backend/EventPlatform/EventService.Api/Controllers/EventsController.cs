using EventPlataform.Contracts;
using EventService.Application.DTOs;
using EventService.Application.Interfaces;
using EventService.Domain;
using FluentValidation;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Text.Json;
using Event = EventService.Domain.Event;

namespace EventService.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableRateLimiting("api")]
    public class EventsController : ControllerBase
    {
        private readonly IEventRepository _eventRepository;
        private readonly IPublishEndpoint _publishEndpoint;
        private readonly ICacheService _cacheService;
        private readonly IValidator<CreateEventRequest> _validator;

        public EventsController(IEventRepository eventRepository, IPublishEndpoint publishEndpoint, 
            ICacheService cacheService, IValidator<CreateEventRequest> validator)
        {
            _eventRepository = eventRepository;
            _publishEndpoint = publishEndpoint;
            _cacheService = cacheService;
            _validator = validator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            const string cacheKey = "events:all";

            var cachedEvents = await _cacheService.GetAsync(cacheKey, cancellationToken);

            if (!string.IsNullOrEmpty(cachedEvents))
            {
                var cachedResponse = JsonSerializer.Deserialize<List<EventResponse>>(cachedEvents);
                Console.WriteLine("EVENTS: CACHE HINT");
                return Ok(cachedResponse);
            }

            Console.WriteLine("EVENTS: CACHE MISS");
            var events = await _eventRepository.GetAllAsync(cancellationToken);

            var response = events.Select(e => new EventResponse
            {
                Id = e.Id,
                Name = e.Name,
                Date = e.Date,
                Location = e.Location,
                Status = e.Status.ToString(),
                Zones = e.Zones.Select(z => new ZoneResponse
                {
                    Id = z.Id,
                    Name = z.Name,
                    Price = z.Price,
                    Capacity = z.Capacity
                }).ToList()
            }).ToList();

            var serializedResponse = JsonSerializer.Serialize(response);
            await _cacheService.SetAsync(cacheKey, serializedResponse, TimeSpan.FromMinutes(5), cancellationToken);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var eventItem = await _eventRepository.GetByIdAsync(id, cancellationToken);

            if (eventItem == null)
                return NotFound();

            var response = new EventResponse
            {
                Id = eventItem.Id,
                Name = eventItem.Name,
                Date = eventItem.Date,
                Location = eventItem.Location,
                Status = eventItem.Status.ToString(),

                Zones = eventItem.Zones.Select(z => new ZoneResponse
                {
                    Id = z.Id,
                    Name = z.Name,
                    Price = z.Price,
                    Capacity = z.Capacity
                }).ToList()
            };

            return Ok(response);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateEventRequest request, CancellationToken cancellationToken)
        {
            var validationResult = await _validator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
            {
                return BadRequest(new
                {
                    message = "Los datos enviados no son válidos.",
                    errors = validationResult.Errors.Select(error => new
                    {
                        field = error.PropertyName,
                        message = error.ErrorMessage
                    })
                });
            }
           
            var eventId = Guid.NewGuid();

            var eventItem = new Event(
                eventId,
                request.Name,
                request.Date,
                request.Location);

            foreach (var zoneRequest in request.Zones)
            {
                var zone = new Zone(
                    Guid.NewGuid(),
                    eventId,
                    zoneRequest.Name,
                    zoneRequest.Price,
                    zoneRequest.Capacity);

                eventItem.AddZone(zone);
            }

            await _eventRepository.AddAsync(eventItem, cancellationToken);
            await _eventRepository.SaveChangesAsync(cancellationToken);

            var message = new EventCreated
            {
                MessageId = Guid.NewGuid(),
                EventId = eventItem.Id,
                Name = eventItem.Name,
                OccurredAt = DateTime.UtcNow,
                CorrelationId = Guid.NewGuid(),
                Version = 1
            };
            await _cacheService.RemoveAsync("events:all", cancellationToken);

            await _publishEndpoint.Publish(message, cancellationToken);

            var response = new EventResponse
            {
                Id = eventItem.Id,
                Name = eventItem.Name,
                Date = eventItem.Date,
                Location = eventItem.Location,
                Status = eventItem.Status.ToString(),

                Zones = eventItem.Zones.Select(z => new ZoneResponse
                {
                    Id = z.Id,
                    Name = z.Name,
                    Price = z.Price,
                    Capacity = z.Capacity
                }).ToList()
            };

            return CreatedAtAction(nameof(GetById), new { id = eventItem.Id }, response);
           
        }
    }
}