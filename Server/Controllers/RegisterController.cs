using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Helpers;
using Server.AuthLib;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class RegisterController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly AuthLibrary _generateToken;

        public RegisterController(ApplicationDbContext db, AuthLibrary authLibrary)
        {
            _db = db;
            _generateToken = authLibrary;
        }

        [HttpPost]
        public IActionResult Register([FromBody] User user)
        {
            // Validate user
            if (user == null)
            {
                return BadRequest();
            }

            // Check exist User
            User? existingUser = _db.Users.Where(u => u.Email == user.Email).FirstOrDefault();
            if (existingUser != null)
            {
                return BadRequest("This account has already exist!");
            }

            string passwordHashed = BCrypt.Net.BCrypt.HashPassword(user.Password);

            User userToDb = new()
            {
                Email = user.Email,
                Username = user.Username,
                Password = passwordHashed,
                Role = "user",
                Name = user.Username,
                Address = "",
                PhoneNumber = "",
                AccountCreationDate = DateTime.Now,
                Nationality = ""
            };

            // Add user to Db
            _db.Users.Add(userToDb);
            _db.SaveChanges();

            User userFromDb = _db.Users.Where(u => u.Email == user.Email).First();

            (string accessTokenValue, string refreshTokenValue) = _generateToken.Generate(userFromDb);

            RefreshToken refreshToken = new()
            {
                Value = refreshTokenValue,
                UserId = userFromDb.Id,
                ExpirationDate = DateTime.Now.AddDays(7),
                Revoked = false,
            };
            _db.RefreshTokens.Add(refreshToken);
            _db.SaveChanges();

            RefreshToken refreshTokenFromDb = _db.RefreshTokens.Where(r => r.Value == refreshTokenValue).First();

            var accessToken = new AccessToken()
            {
                Value = accessTokenValue,
                RtId = refreshTokenFromDb.Id,
                ExpirationDate = DateTime.Now.AddMinutes(1),
                Revoked = false,
            };
            _db.AccessTokens.Add(accessToken);
            _db.SaveChanges();

            // Assign refresh token for cookies
            Response.Cookies.Append("refreshToken", refreshTokenValue, new CookieOptions()
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.Now.AddDays(7)
            });

            ReturnToken returnToken = new()
            {
                AccessToken = accessTokenValue.ToString(),
                RefreshToken = refreshTokenValue.ToString(),
            };

            // Return token
            return Ok(returnToken);
        }
    }
}

