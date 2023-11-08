namespace ChatApp.Helpers;

using ChatApp.Models;
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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasMany(u => u.RefreshToken).WithOne(rt => rt.User).HasForeignKey(rt => rt.UserId);

        modelBuilder.Entity<User>()
            .HasMany(u => u.SignalRConnectionIds).WithOne(srci => srci.User).HasForeignKey(srci => srci.UserId);

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
    }
}

