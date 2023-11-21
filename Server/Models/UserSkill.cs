namespace Server.Models
{
    public class UserSkill
    {
        public long UserSkillID { get; set; }
        public long UserID { get; set; }
        public long SkillID { get; set; }

        public virtual User? User { get; set; }
        public virtual Skill? Skill { get; set; }
    }
}