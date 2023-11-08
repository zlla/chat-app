using System.ComponentModel.DataAnnotations;

namespace ChatApp.Models
{
    public class RefreshToken
    {
        [Key]
        public long Id { get; set; }
        [Required]
        public required string Value { get; set; }
        public required long UserId { get; set; }
        public required DateTime ExpirationDate { get; set; }
        public required bool Revoked { get; set; } = false;

        public virtual User? User { get; set; }
        public virtual AccessToken? AccessToken { get; set; }
    }
}

