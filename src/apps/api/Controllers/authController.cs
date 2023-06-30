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
      if (user.email == null || user.password == null || user.repassword == null)
      {

        return BadRequest("Please enter all Fields");
      }
      string email = user.email;
      string password = user.password;
      string repassword = user.repassword;
      Console.WriteLine("email: " + email);
      string emailPattern = @"^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$";
      if (!Regex.IsMatch(email, emailPattern))
      {
        return BadRequest("Invalid Email");
      }
      //check if email is already registered
      var checkemail = await _authRepository.checkemail(email);
      if (checkemail == false)
      {
        return BadRequest("Email is already registered");
      }
      if (password != repassword)
      {
        return BadRequest("Passwords do not match");
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

  //Login
  [HttpGet]
  [Route("login")]
  public async Task<IActionResult> Login([FromBody] Auth user)
  {
    try
    {
      //check if email and password is not null
      if (user.email == null || user.password == null)
      {
        return BadRequest("Please enter all Fields");
      }
      //check if email is registered
      var checkemail = await _authRepository.checkemail(user.email);
      if (checkemail == true)
      {
        return BadRequest("Email is not registered");
      }
      //login user
      Users LoggedInuser = await _authRepository.login(user.email, user.password);
      return Ok("UserRole = " + LoggedInuser.userRole + " UserId = ");
    }
    catch (Exception e)
    {
      return StatusCode(500, "Internal Server Error. Please contact support. " + "Error: " + e.Message);
    }
  }

}

