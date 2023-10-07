using System.Net;
using Microsoft.AspNetCore.Mvc;
using Api.Repository;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class BusinessBestSolarPanelsController : ControllerBase
{
    private readonly BusinessBestSolarPanelsRepository _businessBestSolarPanelsRepository;
     private readonly KeysRepository _keysRepository;

    public BusinessBestSolarPanelsController()
    {
        _businessBestSolarPanelsRepository = new BusinessBestSolarPanelsRepository();
        _keysRepository = new KeysRepository();
    }
    
    [HttpPost("post")]
    public async Task<IActionResult> CreateBusinessBestSolarPanels([FromBody] BestSolarPanelsInput bestSolarPanelsInput)
    {
        try
        {
            if(bestSolarPanelsInput.key == null)
            {
                return StatusCode((int)HttpStatusCode.Unauthorized, "API key field left blank");
            }
            List<KeyModel> keys = await _keysRepository.GetAllKeys();
            
            foreach(KeyModel key in keys)
            {
                if(bestSolarPanelsInput.key.Equals(key.APIKey))
                {
                    var data = await _businessBestSolarPanelsRepository.GetProcessedDataAsync(bestSolarPanelsInput);
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