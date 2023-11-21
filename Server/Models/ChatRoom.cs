using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class ChatRoom
    {
        [Key]
        public long Id { get; set; }
        public string? RoomName { get; set; }
        public DateTime CreatedAt { get; set; }

        public virtual ICollection<UserChatRoomMembership>? Memberships { get; set; }
        public virtual ICollection<Message>? Messages { get; set; }
    }
}