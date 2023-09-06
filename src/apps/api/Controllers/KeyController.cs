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

    // all business
    [HttpGet("allBusiness")]
    public async Task<IActionResult> GetAllBusinessKeys()
    {
        try
        {
            var keys = await _keysRepository.GetAllBusinessKeys();
            return Ok(keys);
        }
        catch (Exception e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    //create key
    [HttpPost("create")]
    public async Task<IActionResult> CreateKey([FromBody] KeyModel keys)
    {
        try
        {
            int suspended = keys.suspended;
            var key = await _keysRepository.CreateKey(keys.owner!, keys.remainingCalls, suspended);
            return Ok(key);
        }
        catch (Exception e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    //create business key
    [HttpPost("createBusiness")]
    public async Task<IActionResult> CreateBusinessKey([FromBody] KeyModel keys)
    {
        try
        {
            int suspended = keys.suspended;
            var key = await _keysRepository.CreateBusinessKey(
                keys.owner!,
                keys.remainingCalls,
                suspended,
                keys.description!,
                keys.location!,
                keys.website!,
                keys.phoneNumber!,
                keys.email!
            );
            return Ok(key);
        }
        catch (Exception e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    //Delete a key
    [HttpDelete]
    [Route("delete/{keyId}")]
    public async Task<IActionResult> DeleteKey([FromRoute] int keyId)
    {
        try
        {
            var data = await _keysRepository.DeleteKeys(keyId);
            if (data == false)
            {
                return StatusCode(404, "Key with id: " + keyId + " does not exist");
            }
            return Ok("Deleted key with id: " + keyId + "");
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //Update a key
    [HttpPatch]
    [Route("update")]
    public async Task<IActionResult> UpdateKey([FromBody] KeyModel key)
    {
        try
        {
            var data = await _keysRepository.UpdateKeys(
                key.keyId,
                key.owner!,
                key.APIKey!,
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

    //Update Business a key
    [HttpPatch]
    [Route("updateBusiness")]
    public async Task<IActionResult> UpdateBusinessKey([FromBody] KeyModel key)
    {
        try
        {
            var data = await _keysRepository.UpdateBusinessKeys(
                key.keyId,
                key.owner!,
                key.APIKey!,
                key.remainingCalls,
                key.suspended,
                key.isBusiness,
                key.description!,
                key.location!,
                key.website!,
                key.phoneNumber!,
                key.email!
            );
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
}
