namespace ChatApp.Models.DTO
{
    public class EducationalCourseDTO
    {
        public long? CourseId { get; set; }
        public string? CourseName { get; set; }
        public string? Description { get; set; }
        public string? Instructor { get; set; }
        public int? Duration { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal? Price { get; set; }
        public string? CourseCategory { get; set; }
        public string? LinkImage { get; set; }
    }
}