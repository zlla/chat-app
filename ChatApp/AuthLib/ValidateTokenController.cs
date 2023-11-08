using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ChatApp.AuthLib;

namespace ChatApp.Controllers
{
    [ApiController]
    [Route("api/auth/validate-token")]
    [Authorize]
    public class ValidateTokenController : Controller
    {
        private readonly AuthLibrary _authLibrary;

        public ValidateTokenController(AuthLibrary authLibrary)
        {
            _authLibrary = authLibrary;
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Validate([FromBody] AccessTokenRequest? request)
        {
            if (request == null)
            {
                return Unauthorized();
            }

            if (!string.IsNullOrEmpty(request.AccessToken))
            {
                if (_authLibrary.Validate(request.AccessToken) != null)
                {
                    return Ok();
                }
            }

            return Unauthorized(request.AccessToken);
        }
    }

    public class AccessTokenRequest
    {
        public required string AccessToken { get; set; }
    }
}
