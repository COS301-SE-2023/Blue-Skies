using System.Net;
using Microsoft.AspNetCore.Mvc;
using Api.Repository;
namespace Api.Controllers;



[ApiController]
[Route("[controller]")]
public class KeyController : ControllerBase
{

  private readonly KeysRepository _keysRepository;

  public KeyController()
  {
    _keysRepository = new KeysRepository();
  }

  [HttpGet("all")]
  public async Task<IActionResult> GetAllKeys()
  {
    try
    {
      var keys = await _keysRepository.GetAllKeys();
      return Ok(keys);
    }
    catch (Exception e)
    {
      return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
    }
  }

  //create key
  [HttpPost("create")]
  public async Task<IActionResult> CreateKey([FromBody] Keys keys)
  {
    try
    {
      int suspended = keys.suspended ? 1 : 0;
      var key = await _keysRepository.CreateKey(keys.owner, keys.remainingCalls, suspended);
      return Ok(key);
    }
    catch (Exception e)
    {
      return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
    }
  }
}