using System.ComponentModel.DataAnnotations;

namespace ChatApp.Models
{
    public class UserChatRoomMembership
    {
        [Key]
        public long Id;
        [Required]
        public long UserId { get; set; }
        [Required]
        public long RoomId { get; set; }
        public string? Role { get; set; }
        public DateTime JoinedAt { get; set; }

        public virtual User? User { get; set; }
        public virtual ChatRoom? Room { get; set; }
    }
}