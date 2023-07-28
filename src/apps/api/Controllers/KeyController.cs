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
            int suspended = keys.suspended ;
            var key = await _keysRepository.CreateKey(keys.owner, keys.remainingCalls, suspended);
            return Ok(key);
        }
        catch (Exception e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    //Delete a key
    [HttpDelete]
    [Route("delete")]
    public async Task<IActionResult> DeleteKey([FromBody] Keys key)
    {
        try
        {
            var data = await _keysRepository.DeleteKeys(key.keyId);
            if (data == false)
            {
                return StatusCode(404, "Key with id: " + key.keyId + " does not exist");
            }
            return Ok("Deleted key with id: " + key.keyId + "");
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //Update a key
    [HttpPatch]
    [Route("update")]
    public async Task<IActionResult> UpdateKey([FromBody] Keys key)
    {
        try
        {
            var data = await _keysRepository.UpdateKeys(
                key.keyId,
                key.owner,
                key.APIKey,
                key.remainingCalls,
                key.suspended
            );
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
}
