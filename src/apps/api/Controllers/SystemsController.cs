using Microsoft.AspNetCore.Mvc;
using Api.Repository;
namespace Api.Controllers;


[ApiController]
[Route("[controller]")]
public class SystemsController : ControllerBase
{
  private readonly SystemsRepository _systemsRepository;

  public SystemsController()
  {
    _systemsRepository = new SystemsRepository();
  }

  [HttpGet(Name = "all")]
  public async Task<IActionResult> GetAllSystems()
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