using EventService.Application.Interfaces;
using EventService.Domain;
using EventService.Infraestructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventService.Infraestructure.Repositories
{
    public class EventRepository: IEventRepository
    {
        private readonly EventDbContext _context;

        public EventRepository(EventDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Event eventEntity, CancellationToken cancellationToken)
        {
            await _context.Events.AddAsync(
                eventEntity,
                cancellationToken);
        }
        public async Task<IReadOnlyCollection<Event>> GetAllAsync(CancellationToken cancellationToken)
        {
            var events = await _context.Events
                .AsNoTracking()
                .Include(x => x.Zones)
                .OrderBy(x => x.Date)
                .ToListAsync(cancellationToken);

            return events;
        }
        public async Task<Event?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _context.Events
                .Include(x => x.Zones)
                .FirstOrDefaultAsync(
                    x => x.Id == id,
                    cancellationToken);
        }

        public async Task SaveChangesAsync(CancellationToken cancellationToken)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }

    }
}
