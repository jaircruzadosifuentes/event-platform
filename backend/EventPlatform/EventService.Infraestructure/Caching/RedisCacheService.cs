using EventService.Application.Interfaces;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventService.Infraestructure.Caching
{
    public class RedisCacheService : ICacheService
    {
        private readonly IConnectionMultiplexer _redis;

        public RedisCacheService(IConnectionMultiplexer redis)
        {
            _redis = redis;
        }

        public async Task<string?> GetAsync(string key, CancellationToken cancellationToken)
        {
            var database = _redis.GetDatabase();
            var value = await database.StringGetAsync(key);

            return value.HasValue
                ? value.ToString()
                : null;
        }

        public async Task SetAsync(string key, string value, TimeSpan expiration, CancellationToken cancellationToken)
        {
            var database = _redis.GetDatabase();

            await database.StringSetAsync(
                key,
                value,
                expiration);
        }

        public async Task RemoveAsync(string key, CancellationToken cancellationToken)
        {
            var database = _redis.GetDatabase();

            await database.KeyDeleteAsync(key);
        }
    }
}
