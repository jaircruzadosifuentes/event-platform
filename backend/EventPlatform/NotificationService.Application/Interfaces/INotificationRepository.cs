using NotificationService.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace NotificationService.Application.Interfaces
{
    public interface INotificationRepository
    {
        Task<Notification?> GetByMessageIdAsync(Guid messageId, CancellationToken cancellationToken);
        Task AddAsync(Notification notification, CancellationToken cancellationToken);
        Task SaveChangesAsync(CancellationToken cancellationToken);
    }
}
