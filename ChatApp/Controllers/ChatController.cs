// using ChatApp.Helpers;
// using ChatApp.Models;
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;

// namespace ChatApp.Controllers
// {
//     [Authorize]
//     [ApiController]
//     [Route("api/[controller]")]
//     public class ChatController : Controller
//     {
//         private readonly ApplicationDbContext _db;

//         public ChatController(ApplicationDbContext db)
//         {
//             _db = db;
//         }

//         [AllowAnonymous]
//         [HttpPost("getFriendList")]
//         public async Task<IActionResult> GetFriendList()
//         {
//             List<UserConnection>? userConnections = await _db.UserConnections.ToListAsync();

//             if (userConnections.Count > 0)
//             {
//                 return Ok(userConnections);
//             }

//             return NoContent();
//         }
//     }
// }