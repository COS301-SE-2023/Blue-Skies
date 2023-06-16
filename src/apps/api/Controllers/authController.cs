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
    try
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
      if (!email.Contains("@"))
      {
        //return with error code 400
        var ans = new Response { message = "Email is not valid", details = "Please enter a valid email" };
        return BadRequest(ans.ToString());
      }
      //check if email is already registered
      var checkemail = await _authRepository.checkemail(email);
      if (checkemail)
      {
        //return with error code 400
        var ans = new Response { message = "Email is already registered", details = "Please enter a different email" };
        return BadRequest(ans.ToString());
      }

      var ans2 = new Response { message = "User registered successfully", details = "Please login" };
      return Ok(ans2.ToString());
    }
    catch (System.Exception)
    {
      return StatusCode(500, "Internal Server Error. Please contact support.");
      throw;
    }
  }

}

