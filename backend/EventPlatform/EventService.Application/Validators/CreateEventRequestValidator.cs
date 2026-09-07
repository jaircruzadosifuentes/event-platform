using EventService.Application.DTOs;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventService.Application.Validators
{
    
    public class CreateEventRequestValidator: AbstractValidator<CreateEventRequest>
    {
        public CreateEventRequestValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("El nombre es obligatorio.")
                .MaximumLength(200)
                .WithMessage("El nombre no puede superar los 200 caracteres.");

            RuleFor(x => x.Date)
                .Must(date => date > DateTime.UtcNow)
                .WithMessage("La fecha debe ser futura.");

            RuleFor(x => x.Location)
                .NotEmpty()
                .WithMessage("La ubicación es obligatoria.")
                .MaximumLength(300)
                .WithMessage("La ubicación no puede superar los 300 caracteres.");

            RuleFor(x => x.Zones)
                .NotEmpty()
                .WithMessage("Debe existir al menos una zona.");

            RuleForEach(x => x.Zones)
                .SetValidator(new CreateZoneRequestValidator());
        }
    }

    public class CreateZoneRequestValidator: AbstractValidator<CreateZoneRequest>
    {
        public CreateZoneRequestValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("El nombre de la zona es obligatorio.")
                .MaximumLength(200)
                .WithMessage("El nombre de la zona no puede superar los 200 caracteres.");

            RuleFor(x => x.Price)
                .GreaterThanOrEqualTo(0)
                .WithMessage("El precio no puede ser negativo.");

            RuleFor(x => x.Capacity)
                .GreaterThan(0)
                .WithMessage("La capacidad debe ser mayor a 0.");
        }
    }
}
