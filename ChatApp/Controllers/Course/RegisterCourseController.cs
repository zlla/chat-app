using ChatApp.AuthLib;
using ChatApp.Helpers;
using ChatApp.Models;
using ChatApp.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;

namespace ChatApp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class RegisterCourseController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly AuthLibrary _authLibrary;

        public RegisterCourseController(ApplicationDbContext db, AuthLibrary authLibrary)
        {
            _db = db;
            _authLibrary = authLibrary;
        }

        [HttpPost("isRegistered")]
        public async Task<IActionResult> IsRegistered([FromBody] IsRegisteredRequest request)
        {
            if (request == null)
            {
                return BadRequest("The courseId field is required.");
            }
            string? accessToken = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            if (string.IsNullOrEmpty(accessToken))
            {
                return BadRequest("Access token is required");
            }
            var principal = _authLibrary.Validate(accessToken);
            if (principal == null)
            {
                return BadRequest("Invalid access token");
            }
            string? userName = principal.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Name)?.Value;
            if (string.IsNullOrEmpty(userName))
            {
                return BadRequest("Invalid user");
            }
            User? user = await _db.Users.FirstOrDefaultAsync(u => u.Username == userName);

            if (user != null)
            {
                List<UserCourseEnrollment>? userCourseEnrollments = await _db.UserCourseEnrollments.Where(
                    uce => uce.UserID == user.Id && uce.CourseID == request.CourseId && uce.Status == "active"
                ).ToListAsync();

                if (userCourseEnrollments.Count > 0) return Ok(true);
            }

            return Ok(false);
        }

        [HttpGet("getCoursesRegistered")]
        public async Task<IActionResult> GetCoursesRegistered(string enrollmentStatus)
        {
            if (string.IsNullOrEmpty(enrollmentStatus)) BadRequest("Invalid Enrollment Status");
            string? accessToken = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            // Check if the access token is null or empty
            if (string.IsNullOrEmpty(accessToken))
            {
                return BadRequest("Access token is required");
            }
            var principal = _authLibrary.Validate(accessToken);
            if (principal == null)
            {
                return BadRequest("Invalid access token");
            }
            string? userName = principal.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Name)?.Value;
            if (string.IsNullOrEmpty(userName))
            {
                return BadRequest("Invalid user");
            }
            User? user = _db.Users.FirstOrDefault(u => u.Username == userName);
            if (user == null)
            {
                return BadRequest("User not found");
            }

            var enrollments = await _db.UserCourseEnrollments
                .Where(e => e.UserID == user.Id && e.Status == enrollmentStatus)
                .Include(e => e.Course)
                .Select(e => new UserCourseEnrollmentDTO
                {
                    EnrollmentID = e.EnrollmentID,
                    UserID = e.UserID,
                    CourseID = e.CourseID,
                    CourseName = e.Course != null ? e.Course.CourseName : "",
                    Instructor = e.Course != null ? e.Course.Instructor : "",
                    EnrollmentDate = e.EnrollmentDate,
                    Status = e.Status
                })
                .ToListAsync();

            return Ok(enrollments);
        }

        public class IsRegisteredRequest
        {
            public required long CourseId { get; set; }
        }
    }
}