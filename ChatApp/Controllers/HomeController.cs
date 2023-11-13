using ChatApp.Helpers;
using ChatApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _db;
        public HomeController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public IActionResult GetHotTrendCourses()
        {
            List<EducationalCourseDTO>? courses = new();
            List<EducationalCourse>? coursesFromDb = _db.EducationalCourses.Where(ec => ec.SelectedByAdmin == 1).Take(10).ToList();

            foreach (EducationalCourse item in coursesFromDb)
            {
                EducationalCourseDTO temp = new()
                {
                    CourseId = item.CourseId,
                    CourseName = item.CourseName,
                    Instructor = item.Instructor,
                    Price = item.Price,
                    Duration = item.Duration,
                    LinkImage = item.LinkImage
                };
                courses.Add(temp);
            }

            return Ok(courses);
        }
    }
}