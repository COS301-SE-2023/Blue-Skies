using System.Net;
using Microsoft.AspNetCore.Mvc;
using Api.Repository;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]

public class BusinessRequestDataController : ControllerBase
{
    private readonly BusinessRequestDataRepository _businessRequestDataRepository;

    public BusinessRequestDataController()
    {
        _businessRequestDataRepository = new BusinessRequestDataRepository();
    }

    [HttpPost("post")]
    public async Task<IActionResult> CreateBusinessRequestData([FromBody] BusinessRequestData businessRequestData)
    {
        try
        {
            var data = await _businessRequestDataRepository.GetProcessedDataAsync(businessRequestData);
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

}