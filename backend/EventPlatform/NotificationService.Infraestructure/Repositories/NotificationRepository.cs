using Microsoft.EntityFrameworkCore;
using NotificationService.Application.Interfaces;
using NotificationService.Domain;
using NotificationService.Infraestructure.Persistence;
using System;
using System.Collections.Generic;
using System.Text;

namespace NotificationService.Infraestructure.Repositories
{
    public class NotificationRepository: INotificationRepository
    {
        private readonly NotificationDbContext _context;

        public NotificationRepository(NotificationDbContext context)
        {
            _context = context;
        }
        public async Task<Notification?> GetByMessageIdAsync(Guid messageId, CancellationToken cancellationToken)
        {
            return await _context.Notifications.FirstOrDefaultAsync(x => x.MessageId == messageId, cancellationToken);
        }

        public async Task AddAsync(Notification notification, CancellationToken cancellationToken)
        {
            await _context.Notifications.AddAsync(notification, cancellationToken);
        }
        public async Task SaveChangesAsync(CancellationToken cancellationToken)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
