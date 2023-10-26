using System.Net;
using Microsoft.AspNetCore.Mvc;
using Api.Repository;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ReportController : ControllerBase
{
    private readonly ReportsRepository _reportsRepository;
    private string express = "http://localhost:3333";
    public ReportController()
    {
        _reportsRepository = new ReportsRepository();
        var backendexpress = Environment.GetEnvironmentVariable("EXPRESS_BACKEND");
        if (backendexpress != null)
        {
            express = backendexpress;
        }
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

    [HttpGet]
    [Route("getUserReports/{userId}")]
    public async Task<IActionResult> GetUserReports([FromRoute] int userId)
    {
        try
        {
            List<Reports> data = await _reportsRepository.GetUserReports(userId);
            if (data == null)
            {
                return StatusCode(404, "Report with userId: " + userId + " not found");
            }
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
            var data = await _reportsRepository.CreateReports(
                report.reportName!,
                report.userId,
                report.homeSize!,
                report.systemId,
                report.latitude,
                report.longitude
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
            var data = await _reportsRepository.UpdateReports(
                report.reportId,
                report.reportName!,
                report.userId,
                report.homeSize!,
                report.systemId,
                report.latitude,
                report.longitude
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
    public async Task<IActionResult> DeleteReport([FromBody] Reports report)
    {
        try
        {
            var data = await _reportsRepository.DeleteReports(report.reportId);
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
            var data = await _reportsRepository.GetReportById(id);
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

    [HttpGet]
    [Route("downloadReport/{userId}/{reportId}")]
    public async Task<IActionResult> DownloadReport([FromRoute] int userId, [FromRoute] int reportId)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Get, express + "/api/report/downloadReport/" + userId + "/" + reportId);
            request.Headers.Add("Accept", "application/pdf");
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                var pdfStream = await response.Content.ReadAsStreamAsync();
                return File(pdfStream, "application/pdf", "external.pdf");
            }
            else
            {
                Console.WriteLine(".NET: Error downloading report");
                throw new Exception("Error downloading report");
            }
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

}
