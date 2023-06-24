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
    try
    {
      var data = await _systemsRepository.GetAllSystems();
      return Ok(data);
    }
    catch (Exception e)
    {
      return StatusCode(500, e.Message);
    }
  }
}