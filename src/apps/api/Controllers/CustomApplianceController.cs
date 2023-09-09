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
            return StatusCode(500, e.Message);
        }
    }
}