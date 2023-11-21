using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class UserConnection
    {
        [Key]
        public long ConnectionID { get; set; }
        public long UserID1 { get; set; }
        public long UserID2 { get; set; }
        public string? ConnectionType { get; set; }

        public User? User1 { get; set; }
        public User? User2 { get; set; }
    }
}