using ChatApp.Helpers;
using ChatApp.Models;
using ChatApp.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _db;
        public HomeController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        [Route("hot_trend_courses")]
        public async Task<IActionResult> GetHotTrendCourses()
        {
            List<CategoryCount> categoryCounts = await _db.EducationalCourses
                   .GroupBy(course => course.CourseCategory)
                   .Select(group => new CategoryCount
                   {
                       Category = group.Key,
                       Count = group.Count(c => c.SelectedByAdmin != 0)
                   })
                   .OrderByDescending(x => x.Count)
                   .Take(5)
                   .ToListAsync();

            List<EducationalCourseDTO>? courses = new();
            foreach (CategoryCount ccc in categoryCounts)
            {
                List<EducationalCourse>? coursesFromDb = await _db.EducationalCourses.Where(ec => ec.CourseCategory == ccc.Category).Take(10).ToListAsync();
                foreach (EducationalCourse ec in coursesFromDb)
                {
                    EducationalCourseDTO temp = new()
                    {
                        CourseId = ec.CourseId,
                        CourseName = ec.CourseName,
                        CourseCategory = ec.CourseCategory,
                        Instructor = ec.Instructor,
                        Price = ec.Price,
                        Duration = ec.Duration,
                        LinkImage = ec.LinkImage
                    };
                    courses.Add(temp);
                }
            }

            HotTrendCourses hotTrendCourses = new()
            {
                CategoryCount = categoryCounts,
                EducationalCourseDTO = courses
            };

            return Ok(hotTrendCourses);
        }

        [HttpGet]
        [Route("hot_trend_jobs")]
        public async Task<IActionResult> GetHotTrendJobs()
        {
            List<CategoryCount> categoryCounts = await _db.JobOpportunities
                   .GroupBy(job => job.IndustryType)
                   .Select(group => new CategoryCount
                   {
                       Category = group.Key,
                       Count = group.Count(c => c.SelectedByAdmin != 0)
                   })
                   .OrderByDescending(x => x.Count)
                   .Take(5)
                   .ToListAsync();

            List<JobOpportunityDTO>? jobs = new();
            foreach (CategoryCount cc in categoryCounts)
            {
                List<JobOpportunity>? jobsFromDb = await _db.JobOpportunities.Where(jo => jo.IndustryType == cc.Category).Take(10).ToListAsync();
                foreach (JobOpportunity jo in jobsFromDb)
                {
                    JobOpportunityDTO temp = new()
                    {
                        JobID = jo.JobID,
                        JobTitle = jo.JobTitle,
                        IndustryType = jo.IndustryType,
                        Salary = jo.Salary,
                        PostingDate = jo.PostingDate,
                        LinkImage = jo.LinkImage
                    };
                    jobs.Add(temp);
                }
            }

            HotTrendJobs hotTrendCourses = new()
            {
                CategoryCount = categoryCounts,
                JobOpportunityDTO = jobs
            };

            return Ok(hotTrendCourses);
        }

        public class CategoryCount
        {
            public required string Category { get; set; }
            public int Count { get; set; }
        }

        public class HotTrendCourses
        {
            public required List<CategoryCount> CategoryCount { get; set; }
            public required List<EducationalCourseDTO> EducationalCourseDTO { get; set; }
        }

        public class HotTrendJobs
        {
            public required List<CategoryCount> CategoryCount { get; set; }
            public required List<JobOpportunityDTO> JobOpportunityDTO { get; set; }
        }
    }
}