using Server.AuthLib;
using Server.Helpers;
using Server.Models;
using Server.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Text.RegularExpressions;
using System.Security.Claims;
using Server.Models.ControllerModels;

namespace Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public partial class RegisterCourseController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly AuthLibrary _authLibrary;

        public RegisterCourseController(ApplicationDbContext db, AuthLibrary authLibrary)
        {
            _db = db;
            _authLibrary = authLibrary;
        }

        private bool IsValidCreditCardNumber(string creditCardNumber, string paymentMethod)
        {
            // Validate based on payment method
            return paymentMethod.ToLower() switch
            {
                "visa" => IsValidVisaCreditCard(creditCardNumber),
                "mastercard" => IsValidMasterCardCreditCard(creditCardNumber),
                _ => false,// Unsupported payment method
            };
        }

        private static bool IsValidVisaCreditCard(string creditCardNumber)
        {
            // Visa card pattern: Starts with 4 and is 16 digits long
            return VisaRegex().IsMatch(creditCardNumber);
        }

        private static bool IsValidMasterCardCreditCard(string creditCardNumber)
        {
            // MasterCard pattern: Starts with 51, 52, 53, 54, or 55 and is 16 digits long
            return MasterCardRegex().IsMatch(creditCardNumber);
        }

        private bool IsValidCVV(string cvv)
        {
            // CVV should be a 3 or 4-digit number
            return CVVRegex().IsMatch(cvv);
        }

        private bool IsValidExpirationDate(DateTime expirationDate)
        {
            // Expiration date should be in the future
            return expirationDate > DateTime.Now;
        }

        private async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        [HttpPost("isRegistered")]
        public async Task<IActionResult> IsRegistered([FromBody] IsRegisteredRequest request)
        {
            if (request == null || request.CourseId <= 0)
            {
                return BadRequest("Invalid course ID");
            }

            string? accessToken = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            if (string.IsNullOrEmpty(accessToken))
            {
                return BadRequest("Access token is required");
            }

            ClaimsPrincipal? principal = _authLibrary.Validate(accessToken);
            if (principal == null)
            {
                return BadRequest("Invalid access token");
            }

            string? userName = principal.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Name)?.Value;
            if (string.IsNullOrEmpty(userName))
            {
                return BadRequest("Invalid user");
            }

            var user = await GetUserByUsernameAsync(userName);
            if (user == null)
            {
                return BadRequest("User not found");
            }

            List<UserCourseEnrollment> userCourseEnrollments = await _db.UserCourseEnrollments
                .Where(uce => uce.UserID == user.Id && uce.CourseID == request.CourseId && uce.Status == "active")
                .ToListAsync();

            return Ok(userCourseEnrollments.Count > 0);
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

            ClaimsPrincipal? principal = _authLibrary.Validate(accessToken);
            if (principal == null)
            {
                return BadRequest("Invalid access token");
            }

            string? userName = principal.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Name)?.Value;
            if (string.IsNullOrEmpty(userName))
            {
                return BadRequest("Invalid user");
            }

            User? user = await GetUserByUsernameAsync(userName);
            if (user == null)
            {
                return BadRequest("User not found");
            }

            List<UserCourseEnrollmentDTO> enrollments = await _db.UserCourseEnrollments
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

        [HttpPost("RegisterCourse")]
        public async Task<IActionResult> RegisterCourse([FromBody] RegisterCourseRequest request)
        {
            RegisterWithCCErrors registerWithCCErrors = new();

            if (request.CourseId <= 0)
            {
                return BadRequest("The courseId must be greater than 0");
            }
            if (string.IsNullOrEmpty(request.PaymentMethod))
            {
                registerWithCCErrors.PaymentMethodError = "The payment method field is required.";
            }
            if (string.IsNullOrEmpty(request.CreditCardNumber) || !IsValidCreditCardNumber(request.CreditCardNumber, request.PaymentMethod))
            {
                registerWithCCErrors.CreditCardNumberError = "Invalid credit card number";
            }
            if (string.IsNullOrEmpty(request.CVV) || !IsValidCVV(request.CVV))
            {
                registerWithCCErrors.CVVError = "Invalid CVV";
            }
            if (!IsValidExpirationDate(request.ExpiredDate))
            {
                registerWithCCErrors.ExpiredDateError = "Invalid expiration date";
            }
            if (!string.IsNullOrEmpty(registerWithCCErrors.PaymentMethodError) ||
                !string.IsNullOrEmpty(registerWithCCErrors.CreditCardNumberError) ||
                !string.IsNullOrEmpty(registerWithCCErrors.CVVError) ||
                !string.IsNullOrEmpty(registerWithCCErrors.ExpiredDateError))
            {
                return BadRequest(registerWithCCErrors);
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
            User? user = await GetUserByUsernameAsync(userName);
            if (user == null)
            {
                return BadRequest("User not found");
            }
            EducationalCourse? educationalCourse = await _db.EducationalCourses.FirstOrDefaultAsync(ec => ec.CourseId == request.CourseId);
            if (educationalCourse == null)
            {
                return BadRequest("Invalid CourseId");
            }
            UserCourseEnrollment? checkRegisterBefore = await _db.UserCourseEnrollments.Where(uce => uce.UserID == user.Id && uce.CourseID == educationalCourse.CourseId).FirstOrDefaultAsync();
            if (checkRegisterBefore != null)
            {
                return BadRequest("You was registered this course.");
            }
            UserCourseEnrollment userCourseEnrollment = new()
            {
                UserID = user.Id,
                CourseID = educationalCourse.CourseId,
                EnrollmentDate = DateTime.Now,
                Status = "active"
            };

            _db.UserCourseEnrollments.Add(userCourseEnrollment);
            _db.SaveChanges();
            return Ok();
        }

        [GeneratedRegex("^5[1-5][0-9]{14}$")]
        private static partial Regex MasterCardRegex();
        [GeneratedRegex("^4[0-9]{15}$")]
        private static partial Regex VisaRegex();
        [GeneratedRegex("^[0-9]{3,4}$")]
        private static partial Regex CVVRegex();
    }
}