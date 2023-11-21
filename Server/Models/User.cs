using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class User
    {
        [Key]
        public long Id { get; set; }
        [Required]
        public required string Username { get; set; }
        [Required]
        public required string Email { get; set; }
        [Required]
        public required string Password { get; set; }
        public string? Role { get; set; }
        public string? Name { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? AccountCreationDate { get; set; }
        public string? Nationality { get; set; }

        public virtual ICollection<RefreshToken>? RefreshToken { get; set; }
        public virtual ICollection<UserChatRoomMembership>? Memberships { get; set; }
        public virtual ICollection<Message>? SentMessages { get; set; }
        public virtual ICollection<SignalRConnectionId>? SignalRConnectionIds { get; set; }
        public virtual ICollection<UserCourseEnrollment>? UserCourseEnrollments { get; set; }
        public virtual ICollection<UserJobApplication>? UserJobApplications { get; set; }
        public virtual ICollection<UserSkill>? UserSkills { get; set; }
        public ICollection<UserConnection>? Connections1 { get; set; }
        public ICollection<UserConnection>? Connections2 { get; set; }
    }
}

