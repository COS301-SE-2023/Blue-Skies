using System.Net;
using Microsoft.AspNetCore.Mvc;
using Api.Repository;
namespace Api.Controllers;



[ApiController]
[Route("[controller]")]
public class KeysController : ControllerBase
{

  private readonly KeysRepository _keysRepository;

  public KeysController()
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
}