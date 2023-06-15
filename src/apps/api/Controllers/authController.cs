using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class authController : ControllerBase
{

  [HttpPost("register", Name = "auth")]
  public async Task<Response> PostAsync(Auth user)
  {
    var client = new HttpClient();
    var request = new HttpRequestMessage(HttpMethod.Get, "http://localhost:3333/api/auth/checkemail");
    var content = new StringContent("{\r\n    \"email\" : \"" + user.email + "\"\r\n}", null, "application/json");
    request.Content = content;
    var response = await client.SendAsync(request);
    if (response.StatusCode == HttpStatusCode.OK)
    {
      var ans = new Response { message = "Email already exists", details = "Please login or use another email" };
      return ans;
    }
    return new Response { message = "User has successfuly registered", details = "Please login" };
  }
}

