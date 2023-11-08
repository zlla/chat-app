using System.ComponentModel.DataAnnotations;

namespace ChatApp.Models
{
    public class ReturnToken
    {
        [Required]
        public required string AccessToken { get; set; }
        [Required]
        public required string RefreshToken { get; set; }
    }
}

