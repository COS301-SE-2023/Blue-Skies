using System.Net;
using Microsoft.AspNetCore.Mvc;
using Api.Repository;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class SolarScoreController : ControllerBase
{
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
}
