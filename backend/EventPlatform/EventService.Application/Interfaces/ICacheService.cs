using System;
using System.Collections.Generic;
using System.Text;

namespace EventService.Application.Interfaces
{
    public interface ICacheService
    {
        Task<string?> GetAsync(string key, CancellationToken cancellationToken);
        Task SetAsync(string key, string value, TimeSpan expiration, CancellationToken cancellationToken);
        Task RemoveAsync(string key, CancellationToken cancellationToken);
    }
}
