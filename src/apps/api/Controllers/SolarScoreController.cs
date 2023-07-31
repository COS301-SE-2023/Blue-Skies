using System.Net;
using Microsoft.AspNetCore.Mvc;
using Api.Repository;


public class solarScore
{
    public string imgName { get; set; }
    public string solarScoreId { get; set; }
    public string base64Image { get; set; }
}

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
            // Decode base64 image back to binary data
            byte[] imageBytes = Convert.FromBase64String(ss.base64Image);

            // Create a temporary file to save the image
            string tempImagePath = Path.GetTempFileName();

            // Save the image to the temporary file
            System.IO.File.WriteAllBytes(tempImagePath, imageBytes);

            // Call ImageClassifier to get the prediction
            var prediction = await _solarScoreRepository.GetSolarScoreFromImage(tempImagePath);

            // Delete the temporary image file
            File.Delete(tempImagePath);

            Console.WriteLine(prediction);
            return Ok(prediction);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }


}