using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChatApp.Models
{
    public class AccessToken
    {
        [Key]
        public long Id { get; set; }
        [Required]
        public required long RtId { get; set; }
        public required string Value { get; set; }
        public required DateTime ExpirationDate { get; set; }
        public required bool Revoked { get; set; } = false;

        public virtual RefreshToken? RefreshToken { get; set; }
    }
}

