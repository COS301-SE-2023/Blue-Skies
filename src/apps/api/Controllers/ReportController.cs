using System.Net;
using Microsoft.AspNetCore.Mvc;
using Api.Repository;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ReportController : ControllerBase
{
    private readonly ReportsRepository _reportsRepository;

    public ReportController()
    {
        _reportsRepository = new ReportsRepository();
    }

    [HttpGet]
    [Route("all")]
    public async Task<IActionResult> GetAllReports()
    {
        try
        {
            var data = await _reportsRepository.GetAllReports();
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //Create a new report
    [HttpPost]
    [Route("create")]
    public async Task<IActionResult> CreateReport([FromBody] Reports report)
    {
        try
        {
            var data = await _reportsRepository.createReports(
                report.reportName ?? "default",
                report.userId,
                report.basicCalculationId,
                report.solarScore,
                report.runningTime
            );
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //update a report
    [HttpPatch]
    [Route("update")]
    public async Task<IActionResult> UpdateReport([FromBody] Reports report)
    {
        try
        {
            var data = await _reportsRepository.updateReports(
                report.reportId,
                report.reportName ?? "default",
                report.userId,
                report.basicCalculationId,
                report.solarScore,
                report.runningTime
            );
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //delete a report
    [HttpDelete]
    [Route("delete")]
    public async Task<IActionResult> DeleteReport([FromBody] ReportAll report)
    {
        try
        {
            var data = await _reportsRepository.deleteReports(report.reportId);
            if (data == false)
            {
                return StatusCode(404, "Report with id: " + report.reportId + " not found");
            }
            return Ok("Deleted report with id: " + report.reportId + " successfully");
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //get a report by id
    [HttpGet]
    [Route("get/{id}")]
    public async Task<IActionResult> GetReport([FromRoute] int id)
    {
        try
        {
            var data = await _reportsRepository.getReportById(id);
            if (data == null)
            {
                return StatusCode(404, "Report with id: " + id + " not found");
            }
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
}
