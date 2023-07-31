using System.Net;
using Microsoft.AspNetCore.Mvc;
using Api.Repository;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class BasicCalculationController : ControllerBase
{
    private readonly BasicCalculationRepository _basicCalculationsRepository;

    public BasicCalculationController()
    {
        _basicCalculationsRepository = new BasicCalculationRepository();
    }

    //Get all basic calculations
    [HttpGet("all")]
    public async Task<IActionResult> GetAllBasicCalculations()
    {
        try
        {
            var basicCalculations = await _basicCalculationsRepository.GetAllBasicCalculations();
            return Ok(basicCalculations);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //Create a basic calculation
    [HttpPost("create")]
    public async Task<IActionResult> CreateBasicCalculation(
        [FromBody] BasicCalculation basicCalculation
    )
    {
        try
        {
            Console.WriteLine(basicCalculation.systemId);
            var newBasicCalculation = await _basicCalculationsRepository.CreateBasicCalculation(
                basicCalculation.systemId,
                basicCalculation.daylightHours!,
                basicCalculation.location!,
                basicCalculation.batteryLife
            );
            return Ok(newBasicCalculation);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //Update a basic calculation
    [HttpPatch("update")]
    public async Task<IActionResult> UpdateBasicCalculation(
        [FromBody] BasicCalculation basicCalculation
    )
    {
        try
        {
            Console.WriteLine(basicCalculation.daylightHours);
            var newBasicCalculation = await _basicCalculationsRepository.UpdateBasicCalculation(
                basicCalculation.basicCalculationId,
                basicCalculation.systemId,
                basicCalculation.daylightHours!,
                basicCalculation.location!,
                basicCalculation.batteryLife
            );
            return Ok(newBasicCalculation);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
}
