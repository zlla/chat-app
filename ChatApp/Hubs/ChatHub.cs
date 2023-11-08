using ChatApp.AuthLib;
using ChatApp.Helpers;
using ChatApp.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.JsonWebTokens;

namespace SignalRChat.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _db;
        private readonly AuthLibrary _authLibrary;

        public ChatHub(ApplicationDbContext db, AuthLibrary authLibrary)
        {
            _db = db;
            _authLibrary = authLibrary;
        }

        private async void HandleAccessToken(string? token)
        {
            if (string.IsNullOrEmpty(token))
            {
                await Clients.Caller.SendAsync("ReceiveMessage", "Unauthorize");
                Context.Abort();
                return;
            }

            if (_authLibrary.Validate(token, true) == null)
            {
                await Clients.Caller.SendAsync("ReceiveMessage", "Token Expired");
                Context.Abort();
                return;
            }
        }

        public override async Task OnConnectedAsync()
        {
            string? token = Context.GetHttpContext()?.Request.Query["access_token"];
            SignalRConnectionId srci;

            HandleAccessToken(token);

            if (!string.IsNullOrEmpty(token))
            {
                var principal = _authLibrary.Validate(token);
                string? email = principal?.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Name)?.Value;
                User user = _db.Users.Where(u => u.Email == email).First();
                srci = new SignalRConnectionId
                {
                    UserId = user.Id,
                    Value = Context.ConnectionId
                };
                _db.Update(srci);
                _db.SaveChanges();
            }

            await Clients.All.SendAsync("ReceiveMessage", "");
        }

        public async Task SendMessageToAll(string message)
        {
            string? token = Context.GetHttpContext()?.Request.Query["access_token"];
            string userEmail = "";

            HandleAccessToken(token);

            if (!string.IsNullOrEmpty(token))
            {
                var principal = _authLibrary.Validate(token);
                string? email = principal?.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Name)?.Value;
                userEmail = _db.Users.Where(u => u.Email == email).First().Email;
            }

            await Clients.All.SendAsync("ReceiveMessage", $"{userEmail}: {message}");
        }

        public async Task SendPrivateMessage(string connectionId, string message)
        {
            string? token = Context.GetHttpContext()?.Request.Query["access_token"];
            ChatRoom? chatRoom;

            HandleAccessToken(token);

            if (!string.IsNullOrEmpty(token))
            {
                var principal = _authLibrary.Validate(token);
                string? email = principal?.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Name)?.Value;
                long senderId = _db.Users.Where(u => u.Email == email).First().Id;
                long? receiverId = _db.SignalRConnectionIds.Where(srci => srci.Value == connectionId).First().UserId;

                if (receiverId != null)
                {
                    chatRoom = _db.ChatRooms
                        .Where(cr => cr.RoomName == "duo" &&
                            cr.Memberships != null &&
                            cr.Memberships.Any(ms => ms.UserId == receiverId) &&
                            cr.Memberships.Any(ms => ms.UserId == senderId))
                        .FirstOrDefault();

                    if (chatRoom != null)
                    {
                        Message messageModel = new()
                        {
                            RoomId = chatRoom.Id,
                            SenderId = senderId,
                            Content = message,
                            SentAt = DateTime.Now,
                            MessageType = "text"
                        };

                        _db.Messages.Add(messageModel);
                        _db.SaveChanges();
                    }
                }
            }

            await Clients.Client(connectionId).SendAsync("ReceiveMessage", message);
        }
    }
}
