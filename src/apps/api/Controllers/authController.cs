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

        return BadRequest("Please enter all Fields");
      }
      string email = user.email;
      string password = user.password;
      string userRole = user.userRole;
      //check if email is valid
      if (!email.Contains("@"))
      {

        return BadRequest("Invalid Email");
      }
      //check if email is already registered
      var checkemail = await _authRepository.checkemail(email);
      if (checkemail)
      {
        return BadRequest("Email is already registered");
      }

      return Ok("User registered successfully");
    }
    catch (System.Exception)
    {
      return StatusCode(500, "Internal Server Error. Please contact support.");
      throw;
    }
  }

}

