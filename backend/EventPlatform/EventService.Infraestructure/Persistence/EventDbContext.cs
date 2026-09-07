using EventService.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventService.Infraestructure.Persistence
{
    public class EventDbContext: DbContext
    {
        public EventDbContext(DbContextOptions<EventDbContext> options): base(options)
        {
        }
        public DbSet<Event> Events => Set<Event>();

        public DbSet<Zone> Zones => Set<Zone>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(EventDbContext).Assembly);
            base.OnModelCreating(modelBuilder);
        }
    }
}
