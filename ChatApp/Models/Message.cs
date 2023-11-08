using System.ComponentModel.DataAnnotations;

namespace ChatApp.Models
{
    public class Message
    {
        [Key]
        public long Id { get; set; }
        public long RoomId { get; set; }
        public long SenderId { get; set; }
        public required string Content { get; set; }
        public required DateTime SentAt { get; set; }
        public required string MessageType { get; set; }

        public virtual User? Sender { get; set; }
        public virtual ChatRoom? Room { get; set; }
    }
}