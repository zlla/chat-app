using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ChatApp.AuthLib;
using ChatApp.Models;
using ChatApp.Helpers;

namespace ChatApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class LoginController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly AuthLibrary _authLibrary;

        public LoginController(ApplicationDbContext db, IConfiguration configuration)
        {
            _db = db;
            _authLibrary = new AuthLibrary(configuration);
        }

        [HttpPost]
        public IActionResult LoginPost([FromBody] User user)
        {
            if (user != null)
            {
                if (!user.Email.IsNullOrEmpty() && !user.Password.IsNullOrEmpty())
                {
                    User? userFromDb = _db.Users.Where(u => u.Email == user.Email).FirstOrDefault();

                    if (userFromDb == null)
                    {
                        return NotFound();
                    }
                    else if (userFromDb.Email != user.Email || !BCrypt.Net.BCrypt.Verify(user.Password, userFromDb.Password))
                    {
                        return Unauthorized();
                    }
                    else
                    {
                        (string accessTokenValue, string refreshTokenValue) = _authLibrary.Generate(userFromDb);

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

                        AccessToken accessToken = new()
                        {
                            Value = accessTokenValue,
                            RtId = refreshTokenFromDb.Id,
                            ExpirationDate = DateTime.Now.AddMinutes(1),
                            Revoked = false,
                        };
                        _db.AccessTokens.Add(accessToken);
                        _db.SaveChanges();

                        Response.Cookies.Append("refreshToken", refreshTokenValue, new CookieOptions()
                        {
                            Domain = "localhost:5173",
                            Path = "/",
                            HttpOnly = false,
                            Secure = false,
                            SameSite = SameSiteMode.None,
                            Expires = DateTime.Now.AddDays(7)
                        });

                        ReturnToken returnToken = new()
                        {
                            AccessToken = accessTokenValue.ToString(),
                            RefreshToken = refreshTokenValue.ToString()
                        };

                        return Ok(returnToken);
                    }
                }
            }

            return BadRequest();
        }
    }
}
