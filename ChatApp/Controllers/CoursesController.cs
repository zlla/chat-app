using ChatApp.Helpers;
using ChatApp.Models;
using ChatApp.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        public async Task<IActionResult> GetAllCourses(int page, int pageSize)
        {
            int startIndex = (page - 1) * pageSize;

            List<EducationalCourseDTO>? courses = new();
            List<EducationalCourse>? coursesFromDb = await _db.EducationalCourses
                .Skip(startIndex)
                .Take(pageSize)
                .ToListAsync();

            foreach (EducationalCourse ec in coursesFromDb)
            {
                EducationalCourseDTO temp = new()
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
                };
                courses.Add(temp);
            }

            return Ok(courses);
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