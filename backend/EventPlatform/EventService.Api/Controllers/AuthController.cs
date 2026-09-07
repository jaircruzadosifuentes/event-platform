using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EventService.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("token")]
        public IActionResult GenerateToken([FromQuery] string role = "User")
        {
            if (role != "User" && role != "Admin")
            {
                return BadRequest(new
                {
                    message = "El rol debe ser User o Admin."
                });
            }

            var key = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key no está configurada.");
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];
            var expirationMinutes = int.Parse(_configuration["Jwt:ExpirationMinutes"] ?? "120");

            var claims = new List<Claim>
            {
                new Claim(
                    ClaimTypes.Name,
                    "developer"),

                new Claim(
                    ClaimTypes.Role,
                    role)
            };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    expirationMinutes),
                signingCredentials: credentials);

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new
            {
                accessToken = tokenString,
                tokenType = "Bearer",
                expiresInMinutes = expirationMinutes,
                role
            });
        }
    }
}