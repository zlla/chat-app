using System.ComponentModel.DataAnnotations;

namespace ChatApp.Models
{
    public class SignalRConnectionId
    {
        [Key]
        public long Id { get; set; }
        [Required]
        public long UserId { get; set; }
        [Required]
        public required string Value { get; set; }

        public virtual User? User { get; set; }
    }
}