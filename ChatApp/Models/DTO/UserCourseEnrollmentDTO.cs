namespace ChatApp.Models.DTO
{
    public class UserCourseEnrollmentDTO
    {
        public long EnrollmentID { get; set; }
        public long UserID { get; set; }
        public long CourseID { get; set; }
        public string? CourseName { get; set; }
        public string? Instructor { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public required string Status { get; set; }
    }
}