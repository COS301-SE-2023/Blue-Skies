using System.Net;
using Microsoft.AspNetCore.Mvc;
using Api.Repository;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class CustomApplianceController : ControllerBase
{
    private readonly CustomApplianceRepository _customApplianceRepository;

    public CustomApplianceController()
    {
        _customApplianceRepository = new CustomApplianceRepository();
    }

    //Get all custom appliances
    [HttpGet]
    [Route("all")]
    public async Task<IActionResult> GetAllCustomAppliances()
    {
        try
        {
            var data = await _customApplianceRepository.GetAllCustomAppliances();
            return Ok(data);
        }
        catch (Exception e)
        {
            if (e.Message == "Bad Request")
            {
                return BadRequest("Unable to retrieve custom appliances");
            }
            return StatusCode(500, e.Message);
        }
    }

    // Create custom appliance
    [HttpPost]
    [Route("create")]
    public async Task<IActionResult> CreateCustomAppliance([FromBody] CustomAppliance customAppliance)
    {
        try
        {
            var data = await _customApplianceRepository.CreateCustomAppliance(customAppliance.type!, customAppliance.model!, customAppliance.powerUsage);
            if (data == null)
            {
                return BadRequest("Unable to create custom appliance");
            }
            return Ok(data);
        }
        catch (Exception e)
        {
            if (e.Message == "Bad Request")
            {
                return BadRequest("Unable to create custom appliance");
            }
            return StatusCode(500, e.Message);
        }
    }

    // Delete custom appliance
    [HttpDelete]
    [Route("delete/{customApplianceId}")]
    public async Task<IActionResult> DeleteCustomAppliance([FromRoute] int customApplianceId)
    {
        try
        {
            var data = await _customApplianceRepository.DeleteCustomAppliance(customApplianceId);
            if (data == false)
            {
                return BadRequest("Unable to delete custom appliance");
            }
            return Ok("Custom appliance deleted");
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

}