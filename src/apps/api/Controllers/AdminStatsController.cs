
using Microsoft.AspNetCore.Mvc;
using Api.Repository;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class AdminStatsController : ControllerBase
{
  private readonly AdminStatsRepository _adminStatsRepository;

  public AdminStatsController()
  {
    _adminStatsRepository = new AdminStatsRepository();
  }

  [HttpGet("all")]
  public async Task<ActionResult<List<SystemUsage>>> GetAllSystemUsage()
  {
    try
    {
      var result = await _adminStatsRepository.GetAllSystemUsage();
      return Ok(result);
    }
    catch (Exception e)
    {
      return StatusCode(500, e.Message);
    }
  }

}