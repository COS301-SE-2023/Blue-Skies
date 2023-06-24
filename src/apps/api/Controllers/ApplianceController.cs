using Microsoft.AspNetCore.Mvc;
using Api.Repository;
namespace Api.Controllers;


[ApiController]
[Route("[controller]")]
public class ApplianceController : ControllerBase
{

  [HttpGet]
  [Route("all")]
  public async Task<IActionResult> GetAllAppliances()
  {
    
  }
}