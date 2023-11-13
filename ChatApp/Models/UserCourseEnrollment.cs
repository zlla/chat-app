using System.ComponentModel.DataAnnotations;

namespace ChatApp.Models
{
    public class UserCourseEnrollment
    {
        [Key]
        public long EnrollmentID { get; set; }
        public long UserID { get; set; }
        public long CourseID { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public required string Status { get; set; }

        public virtual User? User { get; set; }
        public virtual EducationalCourse? Course { get; set; }
    }
}