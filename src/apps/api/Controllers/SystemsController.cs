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
  public async Task<List<System>> GetAllSystems()
  {
    return await _systemsRepository.GetAllSystems();
  }
}