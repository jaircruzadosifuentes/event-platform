using System;
using System.Collections.Generic;
using System.Text;

namespace NotificationService.Application.Interfaces
{
    public interface IEmailSender
    {
        Task SendEventCreatedAsync(string eventName, Guid eventId, CancellationToken cancellationToken);
    }
}
