using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class UserInformation
    {
        public long? Id { get; set; }
        public string? Email { get; set; }
        public string? Username { get; set; }
    }
}

