namespace Server.Models
{
    public class Skill
    {
        public long SkillID { get; set; }
        public required string SkillName { get; set; }

        public virtual ICollection<UserSkill>? UserSkills { get; set; }
    }
}