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
    //check if email and password is not null
    if (user.email == null || user.password == null)
    {
      //return with error code 400
      var ans = new Response { message = "Email or password is null", details = "Please enter email and password" };
      return ans;
    }
    string email = user.email;
    string password = user.password;
    //check if email is valid
    if (!email.Contains("@") || !email.Contains("."))
    {
      //return with error code 400
      var ans = new Response { message = "Email is not valid", details = "Please enter a valid email" };
      return ans;
    }
    var client = new HttpClient();
    var request = new HttpRequestMessage(HttpMethod.Get, "http://localhost:3333/api/auth/checkemail");
    var content = new StringContent("{\r\n    \"email\" : \"" + user.email + "\"\r\n}", null, "application/json");
    request.Content = content;
    var response = await client.SendAsync(request);
    if (response.StatusCode == HttpStatusCode.OK)
    {
      //return with error code 400
      var ans = new Response { message = "Email already exists", details = "Please login or use another email" };
      return ans;
    }


    return new Response { message = "User has successfuly registered", details = "Please login" };
  }
}

