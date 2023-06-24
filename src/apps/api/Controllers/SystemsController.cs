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
  [HttpGet]
  [Route("all")]
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

  //Create a new system
  [HttpPost]
  [Route("create")]
  public async Task<IActionResult> CreateSystem([FromBody] System system)
  {
    try
    {
      var data = await _systemsRepository.createSystems(system.inverterOutput, system.numberOfPanels, system.batterySize, system.numberOfBatteries, system.solarInput);
      return Ok(data);
    }
    catch (Exception e)
    {
      return StatusCode(500, e.Message);
    }
  }

  //update a system
  [HttpPatch]
  [Route("update")]
  public async Task<IActionResult> UpdateSystem([FromBody] System system)
  {
    try
    {
      var data = await _systemsRepository.updateSystems(system.systemId, system.inverterOutput, system.numberOfPanels, system.batterySize, system.numberOfBatteries, system.solarInput);
      return Ok(data);
    }
    catch (Exception e)
    {
      return StatusCode(500, e.Message);
    }
  }

  //delete a system
  [HttpDelete]
  [Route("delete")]
  public async Task<IActionResult> DeleteSystem([FromBody] System system)
  {
    try
    {
      var data = await _systemsRepository.deleteSystems(system.systemId);
      if(data==false)
      {
        return StatusCode(404, "System with id: " + system.systemId + " not found");
      }
      return Ok("Deleted system with id: " + system.systemId + " successfully");
    }
    catch (Exception e)
    {
      return StatusCode(500, e.Message);
    }
  }

  //get a system by id
  [HttpGet]
  [Route("get")]
  public async Task<IActionResult> GetSystem([FromBody] System system)
  {
    try
    {
      var data = await _systemsRepository.getSystemById(system.systemId);
      if(data==null)
      {
        return StatusCode(404, "System with id: " + system.systemId + " not found");
      }
      return Ok(data);
    }
    catch (Exception e)
    {
      return StatusCode(500, e.Message);
    }
  }
}