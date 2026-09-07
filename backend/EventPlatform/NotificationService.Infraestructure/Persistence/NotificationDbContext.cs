using MediatR;
using Microsoft.EntityFrameworkCore;
using NotificationService.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace NotificationService.Infraestructure.Persistence
{
    public class NotificationDbContext : DbContext
    {
        public NotificationDbContext(
            DbContextOptions<NotificationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Notification> Notifications => Set<Notification>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(
                typeof(NotificationDbContext).Assembly);

            base.OnModelCreating(modelBuilder);
        }
    }
}
