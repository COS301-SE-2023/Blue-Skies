using System.Net;
using Microsoft.AspNetCore.Mvc;
using Api.Repository;



namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class SolarScoreController : ControllerBase
{
    private readonly SolarScoreRepository _solarScoreRepository;

    public SolarScoreController()
    {
        _solarScoreRepository = new SolarScoreRepository();
    }

    [HttpGet]
    [Route("mapboxkey")]
    public async Task<IActionResult> GetMapBoxKey()
    {
        try
        {
            var key = await _solarScoreRepository.GetMapBoxApiKey();
            return Ok(key);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
    [HttpGet]
    [Route("googlemapskey")]
    public async Task<IActionResult> GetGoogleMapsKey()
    {
        try
        {
            var key = await _solarScoreRepository.GetGoogleMapsKey();
            return Ok(key);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }


    [HttpGet]
    [Route("getsuntimes")]
    public async Task<IActionResult> GetSumTimes([FromBody] Coordinates cord)
    {
        try
        {
            string sumTimes = await _solarScoreRepository.GetSunTimes(cord);
            return Ok(sumTimes);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

}
