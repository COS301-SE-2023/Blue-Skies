using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class authController : ControllerBase
{


  [HttpGet("register", Name = "auth")]
  public async Task<IEnumerable<Auth>> GetAsync()
  {
    var client = new HttpClient();
    var request = new HttpRequestMessage(HttpMethod.Get, "http://localhost:3333/api/user/all");
    var response = await client.SendAsync(request);
    response.EnsureSuccessStatusCode();
    Console.WriteLine(await response.Content.ReadAsStringAsync());
    return Enumerable.Range(1, 5).Select(index => new Auth
    {
      email = "email",
      password = "password"
    })
    .ToArray();
  }
  //make a register post request to the api
}

