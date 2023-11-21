namespace Server.Helpers;

using Server.Models;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<AccessToken> AccessTokens { get; set; }
    public DbSet<ChatRoom> ChatRooms { get; set; }
    public DbSet<UserChatRoomMembership> Memberships { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<SignalRConnectionId> SignalRConnectionIds { get; set; }

    public DbSet<EducationalCourse> EducationalCourses { get; set; }
    public DbSet<JobOpportunity> JobOpportunities { get; set; }
    public DbSet<UserCourseEnrollment> UserCourseEnrollments { get; set; }
    public DbSet<UserJobApplication> UserJobApplications { get; set; }
    public DbSet<Skill> Skills { get; set; }
    public DbSet<UserSkill> UserSkills { get; set; }
    public DbSet<UserConnection> UserConnections { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique();
        modelBuilder.Entity<User>()
            .HasMany(u => u.RefreshToken).WithOne(rt => rt.User).HasForeignKey(rt => rt.UserId);
        modelBuilder.Entity<User>()
            .HasMany(u => u.SignalRConnectionIds).WithOne(srci => srci.User).HasForeignKey(srci => srci.UserId);
        modelBuilder.Entity<User>().HasMany(u => u.UserCourseEnrollments).WithOne(uce => uce.User).HasForeignKey(uce => uce.UserID);
        modelBuilder.Entity<User>().HasMany(u => u.UserJobApplications).WithOne(uja => uja.User).HasForeignKey(uja => uja.UserID);
        modelBuilder.Entity<User>().HasMany(u => u.UserSkills).WithOne(us => us.User).HasForeignKey(u => u.UserID);

        modelBuilder.Entity<RefreshToken>()
            .HasOne(rt => rt.AccessToken).WithOne(at => at.RefreshToken).HasForeignKey<AccessToken>(at => at.RtId);

        modelBuilder.Entity<UserChatRoomMembership>()
                .HasKey(ucrm => ucrm.Id);

        modelBuilder.Entity<UserChatRoomMembership>()
            .HasOne(ucrm => ucrm.User)
            .WithMany(u => u.Memberships)
            .HasForeignKey(ucrm => ucrm.UserId);

        modelBuilder.Entity<UserChatRoomMembership>()
            .HasOne(ucrm => ucrm.Room)
            .WithMany(r => r.Memberships)
            .HasForeignKey(ucrm => ucrm.RoomId);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany(u => u.SentMessages)
            .HasForeignKey(m => m.SenderId);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Room)
            .WithMany(r => r.Messages)
            .HasForeignKey(m => m.RoomId);

        modelBuilder.Entity<EducationalCourse>().HasMany(ec => ec.UserCourseEnrollments).WithOne(uce => uce.Course).HasForeignKey(uce => uce.CourseID);
        modelBuilder.Entity<JobOpportunity>().HasMany(jo => jo.UserJobApplications).WithOne(uja => uja.JobOpportunity).HasForeignKey(uja => uja.JobID);

        modelBuilder.Entity<Skill>().HasMany(s => s.UserSkills).WithOne(us => us.Skill).HasForeignKey(s => s.SkillID);

        modelBuilder.Entity<UserConnection>()
            .HasOne(uc => uc.User1)
            .WithMany(u => u.Connections1)
            .HasForeignKey(uc => uc.UserID1)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<UserConnection>()
            .HasOne(uc => uc.User2)
            .WithMany(u => u.Connections2)
            .HasForeignKey(uc => uc.UserID2)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

