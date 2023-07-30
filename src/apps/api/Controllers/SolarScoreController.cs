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
    [Route("getsolarscore")]
    public async Task<IActionResult> GetSolarScore([FromBody] Coordinates cord)
    {
        try
        {
            var score = await _solarScoreRepository.GetSolarScore(cord);
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
    public async Task<IActionResult> GetSolarScoreFromImage()
    {
        try
        {
            var pred = await _solarScoreRepository.GetSolarScoreFromImage("assets/-33.451-18.734-2022_06_24-111.03205300743699.png");
            return Ok(pred);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }



}
