using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ChatApp.AuthLib;
using ChatApp.Models;
using ChatApp.Helpers;

namespace ChatApp.Controllers
{
    [ApiController]
    [Route("api/auth/refresh-token")]
    [Authorize]
    public class RefreshTokenController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly AuthLibrary _authLibrary;

        public RefreshTokenController(ApplicationDbContext db, IConfiguration configuration)
        {
            _db = db;
            _authLibrary = new AuthLibrary(configuration);
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult RefreshToken()
        {
            string? refreshToken = Request.Headers["refreshToken"];
            // Check if the refresh token is null or empty
            if (string.IsNullOrEmpty(refreshToken))
            {
                return BadRequest("Refresh token is required");
            }

            // Get the access token from the authorization header
            string? accessToken = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            // Check if the access token is null or empty
            if (string.IsNullOrEmpty(accessToken))
            {
                return BadRequest("Access token is required");
            }

            // Validate the access token
            var principal = _authLibrary.Validate(accessToken);
            if (principal == null)
            {
                return BadRequest("Invalid access token");
            }

            // Get the user's email from the access token claims
            string? userName = principal.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Name)?.Value;
            // Check if the user's email is null or empty
            if (string.IsNullOrEmpty(userName))
            {
                return BadRequest("Invalid user");
            }

            // Get the user from the database by email
            User? user = _db.Users.FirstOrDefault(u => u.Username == userName);
            // Check if the user exists
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Get the refresh token from the database by value
            RefreshToken? oldRefreshToken = _db.RefreshTokens.FirstOrDefault(r => r.Value == refreshToken);
            // Check if the refresh token exists
            if (oldRefreshToken == null)
            {
                return NotFound("Refresh token not found");
            }
            // Check if the refresh token is expired
            if (oldRefreshToken.ExpirationDate < DateTime.Now)
            {
                return BadRequest("Refresh token expired");
            }
            // Check if the refresh token is revoked
            if (oldRefreshToken.Revoked)
            {
                return BadRequest("Refresh token revoked");
            }
            // Check if the refresh token belongs to the same user as the access token
            if (oldRefreshToken.UserId != user.Id)
            {
                return BadRequest("Invalid refresh token");
            }

            // Generate a new access token and a new refresh token for the user
            (string newAccessToken, string newRefreshToken) = _authLibrary.Generate(user);

            // Create a new refresh token entity with the new value and expiration date
            var newRefreshTokenEntity = new RefreshToken()
            {
                Value = newRefreshToken.ToString(),
                UserId = user.Id,
                ExpirationDate = oldRefreshToken.ExpirationDate,
                Revoked = false,
            };

            // Update the database with the new refresh token entity
            _db.RefreshTokens.Add(newRefreshTokenEntity);
            _db.SaveChanges();

            // Update the database with the new access token entity
            RefreshToken newRefreshTokenEntityFromDb = _db.RefreshTokens.Where(r => r.Value == newRefreshToken).First();

            var newAccessTokenEntity = new AccessToken()
            {
                Value = newAccessToken,
                RtId = newRefreshTokenEntityFromDb.Id,
                ExpirationDate = DateTime.Now.AddMinutes(1),
                Revoked = false,
            };

            _db.AccessTokens.Add(newAccessTokenEntity);
            _db.SaveChanges();

            // Revoke the old refresh token and delete it from the database
            oldRefreshToken.Revoked = true;
            _db.RefreshTokens.Remove(oldRefreshToken);
            _db.SaveChanges();

            ReturnToken returnToken = new()
            {
                AccessToken = newAccessToken.ToString(),
                RefreshToken = newRefreshToken.ToString(),
            };

            return Ok(returnToken);
        }
    }
}