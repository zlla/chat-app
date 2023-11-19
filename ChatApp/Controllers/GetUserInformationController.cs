using System.IdentityModel.Tokens.Jwt;
using ChatApp.AuthLib;
using ChatApp.Helpers;
using ChatApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatApp
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GetUserInformationController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly AuthLibrary _authLibrary;

        public GetUserInformationController(ApplicationDbContext db, AuthLibrary authLibrary)
        {
            _db = db;
            _authLibrary = authLibrary;
        }

        [HttpGet]
        public async Task<IActionResult> GetUser()
        {
            string? accessToken = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (!string.IsNullOrEmpty(accessToken))
            {
                var principal = _authLibrary.Validate(accessToken);
                string? userName = principal?.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Name)?.Value;
                if (!string.IsNullOrEmpty(userName))
                {
                    User? user = await _db.Users.FirstOrDefaultAsync(u => u.Username == userName);
                    if (user != null)
                    {
                        UserInformation userInformation = new()
                        {
                            Id = user.Id,
                            Email = user.Email,
                            Username = user.Username
                        };

                        return Ok(userInformation);
                    }
                }
            }

            return BadRequest();
        }
    }
}