using System.Net;
using Microsoft.AspNetCore.Mvc;
using Api.Repository;
namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class authController : ControllerBase
{
  private readonly AuthRepository _authRepository;
  public authController(AuthRepository authRepository)
  {
    _authRepository = authRepository;
  }
  [HttpPost]
  [Route("register")]
  public async Task<IActionResult> Register(Auth user)
  {
    //check if email and password is not null
    if (user.email == null || user.password == null || user.userRole == null)
    {
      //return with error code 400
      var ans = new Response { message = "Email or password is null", details = "Please enter email and password" };
      return BadRequest(ans.ToString());
    }
    string email = user.email;
    string password = user.password;
    string userRole = user.userRole;
    //check if email is valid
    if (!email.Contains("@") || !email.Contains("."))
    {
      //return with error code 400
      var ans = new Response { message = "Email is not valid", details = "Please enter a valid email" };
      return BadRequest(ans.ToString());
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
      // return BadRequest(ans.ToString());
      return StatusCode(400, ans.ToString());
    }
    var request2 = new HttpRequestMessage(HttpMethod.Post, "http://localhost:3333/api/auth/register");
    var content2 = new StringContent("{\r\n    \"email\" : \"" + email + "\",\r\n    \"password\" : \"" + password + "\",\r\n    \"userRole\" : " + userRole + "\r\n}", null, "application/json");
    request2.Content = content2;
    var response2 = await client.SendAsync(request2);
    Console.WriteLine(response2.StatusCode);
    Console.WriteLine(await response2.Content.ReadAsStringAsync());

    var ans2 = new Response { message = "User registered successfully", details = "Please login" };
    return Ok(ans2.ToString());
  }

}

