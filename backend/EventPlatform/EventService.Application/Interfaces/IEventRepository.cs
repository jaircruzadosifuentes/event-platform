using EventService.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventService.Application.Interfaces
{
    public interface IEventRepository
    {
        Task AddAsync(Event eventEntity, CancellationToken cancellationToken);
        Task<IReadOnlyCollection<Event>> GetAllAsync(CancellationToken cancellationToken);
        Task<Event?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
        Task SaveChangesAsync(CancellationToken cancellationToken);
    }
}
