using System.Net;
using System.Text.RegularExpressions;
using Api.Repository;
using Microsoft.AspNetCore.Mvc;
namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
  private readonly AuthRepository _authRepository;

  //Constructor
  public AuthController()
  {
    _authRepository = new AuthRepository();
  }

  [HttpPost]
  [Route("register")]
  public async Task<IActionResult> Register(Auth user)
  {
    try
    {
      //check if email and password is not null
      if (user.email == null || user.password == null)
      {

        return BadRequest("Please enter all Fields");
      }
      string email = user.email;
      string password = user.password;
      Console.WriteLine("email: " + email);
      string emailPattern = @"^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$";
      if (!Regex.IsMatch(email, emailPattern))
      {
        return BadRequest("Invalid Email");
      }
      //check if email is already registered
      var checkemail = await _authRepository.checkemail(email);
      if (checkemail)
      {
        return BadRequest("Email is already registered");
      }

      //register user
      var register = await _authRepository.register(email, password);
      if (!register)
      {
        return BadRequest("Could not register user");
      }

      return Ok("User registered successfully");
    }
    catch (Exception e)
    {
      return StatusCode(500, "Internal Server Error. Please contact support. " + "Error: " + e.Message);
    }
  }

}

