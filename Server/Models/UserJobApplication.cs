using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class UserJobApplication
    {
        [Key]
        public long ApplicationID { get; set; }
        public long UserID { get; set; }
        public long JobID { get; set; }
        public DateTime ApplicationDate { get; set; }
        public required string Status { get; set; }

        public virtual User? User { get; set; }
        public virtual JobOpportunity? JobOpportunity { get; set; }
    }
}