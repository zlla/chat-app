using System.ComponentModel.DataAnnotations;

namespace ChatApp.Models
{
    public class EducationalCourse
    {
        [Key]
        public required long CourseId { get; set; }
        public required string CourseName { get; set; }
        public required string Description { get; set; }
        public required string Instructor { get; set; }
        public required int Duration { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public required decimal Price { get; set; }
        public required string CourseCategory { get; set; }
        public int? SelectedByAdmin { get; set; }
        public string? LinkImage { get; set; }

        public virtual ICollection<UserCourseEnrollment>? UserCourseEnrollments { get; set; }
    }
}