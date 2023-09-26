using System.Net;
using Microsoft.AspNetCore.Mvc;
using Api.Repository;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class BusinessRequestDataController : ControllerBase
{
    private readonly BusinessRequestDataRepository _businessRequestDataRepository;
    private readonly KeysRepository _keysRepository;

    public BusinessRequestDataController()
    {
        _businessRequestDataRepository = new BusinessRequestDataRepository();
        _keysRepository = new KeysRepository();
    }

    [HttpPost("post")]
    public async Task<IActionResult> CreateBusinessRequestData([FromBody] BusinessRequestData businessRequestData)
    {
        try
        {
            if(businessRequestData.key == null)
            {
                return StatusCode((int)HttpStatusCode.Unauthorized, "API key field left blank");
            }
            List<KeyModel> keys = await _keysRepository.GetAllKeys();
            foreach(KeyModel key in keys)
            {
                if(businessRequestData.key.Equals(key.APIKey))
                {
                    var data = await _businessRequestDataRepository.GetProcessedDataAsync(businessRequestData);
                    return Ok(data);
                }
            }
            return StatusCode((int)HttpStatusCode.Unauthorized, "Invalid API Key");
        }
        catch (Exception e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }
}