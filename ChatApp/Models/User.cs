using System.ComponentModel.DataAnnotations;

namespace ChatApp.Models
{
    public class User
    {
        [Key]
        public long Id { get; set; }
        [Required]
        public required string Email { get; set; }
        [Required]
        public required string Username { get; set; }
        [Required]
        public required string Password { get; set; }
        public virtual ICollection<RefreshToken>? RefreshToken { get; set; }
        public virtual ICollection<UserChatRoomMembership>? Memberships { get; set; }
        public virtual ICollection<Message>? SentMessages { get; set; }
        public virtual ICollection<SignalRConnectionId>? SignalRConnectionIds { get; set; }
    }
}

