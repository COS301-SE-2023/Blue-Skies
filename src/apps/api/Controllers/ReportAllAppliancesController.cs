using System.Net;
using Microsoft.AspNetCore.Mvc;
using Api.Repository;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ReportAllApplianceController : ControllerBase
{
    private readonly ReportAllApplianceRepository _reportAllApplianceRepository;

    public ReportAllApplianceController()
    {
        _reportAllApplianceRepository = new ReportAllApplianceRepository();
    }

    [HttpGet]
    [Route("all")]
    public async Task<IActionResult> GetAllReportAll()
    {
        try
        {
            var data = await _reportAllApplianceRepository.GetAllReportAllAppliance();
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //get a reportAllAppliance by reportId
    [HttpGet]
    [Route("getByReportId/{reportId}")]
    public async Task<IActionResult> GetReport([FromRoute] int reportId)
    {
        Console.WriteLine("reportId: " + reportId);
        try
        {
            var data = await _reportAllApplianceRepository.GetReportAllApplianceById(reportId);
            if (data == null)
            {
                return StatusCode(404, "Report with id: " + reportId + " not found");
            }
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

}
