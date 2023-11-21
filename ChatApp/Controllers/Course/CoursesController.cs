using ChatApp.Helpers;
using ChatApp.Models;
using ChatApp.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ChatApp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : Controller
    {
        private readonly ApplicationDbContext _db;

        public CoursesController(ApplicationDbContext db)
        {
            _db = db;
        }

        [AllowAnonymous]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllCourses(int page = 1, int pageSize = 10, string sortField = "CourseId", string sortOrder = "ASC")
        {
            int startIndex = (page - 1) * pageSize;

            IQueryable<EducationalCourse> query = _db.EducationalCourses;

            var sortExpression = $"{sortField} {sortOrder}";

            query = ApplyOrder(query, sortExpression);

            List<EducationalCourseDTO> courses = await query
                .Skip(startIndex)
                .Take(pageSize)
                .Select(ec => new EducationalCourseDTO
                {
                    CourseId = ec.CourseId,
                    CourseName = ec.CourseName,
                    Description = ec.Description,
                    Instructor = ec.Instructor,
                    Duration = ec.Duration,
                    StartDate = ec.StartDate,
                    EndDate = ec.EndDate,
                    Price = ec.Price,
                    CourseCategory = ec.CourseCategory,
                    LinkImage = ec.LinkImage
                })
                .ToListAsync();

            return Ok(courses);
        }

        private static IQueryable<EducationalCourse> ApplyOrder(IQueryable<EducationalCourse> source, string order)
        {
            var parts = order.Split(' ');
            var property = parts[0];
            var ascending = parts.Length > 1 && string.Equals(parts[1], "ASC", StringComparison.OrdinalIgnoreCase);

            var parameter = Expression.Parameter(typeof(EducationalCourse), "x");
            var propertyAccess = Expression.PropertyOrField(parameter, property);
            var orderExpression = Expression.Lambda(propertyAccess, parameter);

            return ascending ? Queryable.OrderBy(source, (dynamic)orderExpression) : Queryable.OrderByDescending(source, (dynamic)orderExpression);
        }

        [AllowAnonymous]
        [HttpGet("all/{courseId}")]
        public async Task<IActionResult> GetDetailsCourse(int courseId)
        {
            EducationalCourse? courseFromDb = await _db.EducationalCourses.Where(ec => ec.CourseId == courseId).FirstOrDefaultAsync();
            EducationalCourseDTO course;
            if (courseFromDb != null)
            {
                course = new EducationalCourseDTO
                {
                    CourseId = courseFromDb.CourseId,
                    CourseName = courseFromDb.CourseName,
                    Description = courseFromDb.Description,
                    Instructor = courseFromDb.Instructor,
                    Duration = courseFromDb.Duration,
                    StartDate = courseFromDb.StartDate,
                    EndDate = courseFromDb.EndDate,
                    Price = courseFromDb.Price,
                    CourseCategory = courseFromDb.CourseCategory,
                    LinkImage = courseFromDb.LinkImage
                };

                List<UserCourseEnrollment>? userCourseEnrollments = await _db.UserCourseEnrollments.Where(uce => uce.CourseID == courseFromDb.CourseId).ToListAsync();
                List<PeopleInClass>? peopleInClass = new();
                List<User>? users = new();

                userCourseEnrollments.ForEach((userCourseEnrollment) =>
                {
                    User? user = _db.Users.Where(u => u.Id == userCourseEnrollment.UserID).FirstOrDefault();
                    if (user != null) users.Add(user);
                });

                users.ForEach((user) =>
                {
                    peopleInClass.Add(new PeopleInClass
                    {
                        Id = user.Id,
                        Username = user.Username,
                        Email = user.Email
                    });
                });

                DetailsCourse detailsCourse = new()
                {
                    EducationalCourseDTO = course,
                    UsersInClass = peopleInClass,
                };

                return Ok(detailsCourse);
            }

            return NoContent();
        }

        [AllowAnonymous]
        [HttpGet("relatedCourse/")]
        public async Task<IActionResult> GetCourseByInstructor(string instructor)
        {
            List<EducationalCourse>? educationalCourses = await _db.EducationalCourses.Where(ec => ec.Instructor.ToLower().Trim() == instructor.ToLower().Trim()).Take(5).ToListAsync();
            if (educationalCourses.Count > 0)
            {
                List<EducationalCourseDTO> educationalCourseDTOs = new();
                educationalCourses.ForEach((ec) =>
                {
                    educationalCourseDTOs.Add(new EducationalCourseDTO()
                    {
                        CourseId = ec.CourseId,
                        CourseName = ec.CourseName,
                        Description = ec.Description,
                        Price = ec.Price,
                        CourseCategory = ec.CourseCategory,
                        LinkImage = ec.LinkImage
                    });
                });

                return Ok(educationalCourseDTOs);
            }

            return NoContent();
        }
    }

    public class PeopleInClass
    {
        public long Id { get; set; }
        public required string Email { get; set; }
        public required string Username { get; set; }
    }

    public class DetailsCourse
    {
        public required EducationalCourseDTO EducationalCourseDTO { get; set; }
        public required List<PeopleInClass> UsersInClass { get; set; }
    }
}