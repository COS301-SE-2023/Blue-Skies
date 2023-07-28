using System.Net;
using Microsoft.AspNetCore.Mvc;
using Api.Repository;

//using IronPython.Hosting;
// using Microsoft.Scripting.Hosting;

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
    [Route("getSolarScore")]
    public async Task<IActionResult> testImage([FromBody] Coordinates cord)
    {
        //Load sample data
        var imageBytes = System.IO.File.ReadAllBytes(
            @"C:\Users\naido\Downloads\image-classifier-assets\assets\images\Broccoli\broccoli.jpg"
        );
        MLModel.ModelInput sampleData = new MLModel.ModelInput() { ImageSource = imageBytes, };

        //Load model and predict output
        var result = MLModel.Predict(sampleData);
        Console.WriteLine(result);

        return Ok(result);
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
}
