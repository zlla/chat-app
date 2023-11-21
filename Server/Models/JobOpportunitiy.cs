using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class JobOpportunity
    {
        [Key]
        public long JobID { get; set; }
        public required string JobTitle { get; set; }
        public required string JobDescription { get; set; }
        public required string JobRequirements { get; set; }
        public required decimal Salary { get; set; }
        public DateTime PostingDate { get; set; }
        public DateTime ApplicationDeadline { get; set; }
        public string? JobLocation { get; set; }
        public required string IndustryType { get; set; }
        public int? SelectedByAdmin { get; set; }
        public string? LinkImage { get; set; }

        public virtual ICollection<UserJobApplication>? UserJobApplications { get; set; }
    }
}