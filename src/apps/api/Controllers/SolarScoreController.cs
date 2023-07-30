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
    [Route("getimages/{solarScoreId}")]
    public async Task<IActionResult> GetImages([FromBody] Coordinates cord, [FromRoute] string solarScoreId)
    {
        try
        {
            var score = await _solarScoreRepository.GetImages(cord, solarScoreId);
            return Ok(score);
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

    [HttpGet]
    [Route("GetSolarScoreFromImage")]
    public async Task<IActionResult> GetSolarScoreFromImage([FromBody] solarScore ss)
    {
        try
        {
            var pred = await _solarScoreRepository.GetSolarScoreFromImage("assets/" + ss.imgName + ".png");
            Console.WriteLine(pred);
            return Ok(pred);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }



}
