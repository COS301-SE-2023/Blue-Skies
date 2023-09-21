using System.Net;
using Microsoft.AspNetCore.Mvc;
using Api.Repository;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ReportApplianceController : ControllerBase
{
    private readonly ReportAppliancesRepository _reportsRepository;

    public ReportApplianceController()
    {
        _reportsRepository = new ReportAppliancesRepository();
    }

    //Create a new report
    [HttpPost]
    [Route("create")]
    public async Task<IActionResult> CreateReport([FromBody] ReportAppliances report)
    {
        try
        {
            var data = await _reportsRepository.CreateReportAppliance(
                report.reportId,
                report.applianceId,
                report.numberOfAppliances,
                report.applianceModel!,
                report.powerUsage,
                report.durationUsed
            );
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //get all reports
    [HttpGet]
    [Route("all")]
    public async Task<IActionResult> GetAllReportAppliance()
    {
        try
        {
            var data = await _reportsRepository.GetAllReportAppliances();
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //get appliances in report by reportId
    [HttpGet]
    [Route("getAppliancesInReport/{id}")]
    public async Task<IActionResult> GetAppliancesInReport([FromRoute] int id)
    {
        try
        {
            var data = await _reportsRepository.GetAppliancesInReport(id);
            if (data == null)
            {
                return StatusCode(404, "Report Appliance with applianceId: " + id + " not found");
            }
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //get a report appliance by Applianced
    [HttpGet]
    [Route("getReportsWithAppliance/{id}")]
    public async Task<IActionResult> GetReportsWithAppliance([FromRoute] int id)
    {
        try
        {
            var data = await _reportsRepository.GetReportsWithAppliance(id);
            if (data == null)
            {
                return StatusCode(404, "Report Appliance with reportId: " + id + " not found");
            }
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //get a report appliance
    [HttpGet]
    [Route("getReportAppliance/{reportId}/{applianceId}")]
    public async Task<IActionResult> GetReportAppliance([FromRoute] int reportid, int applianceId)
    {
        try
        {
            var data = await _reportsRepository.GetReportAppliance(reportid, applianceId);
            if (data == null)
            {
                return StatusCode(
                    404,
                    "Report Appliance with reportId: "
                        + reportid
                        + " and applianceId: "
                        + applianceId
                        + " not found"
                );
            }
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //update number of Appliances
    [HttpPatch]
    [Route("updateNumberOfAppliances")]
    public async Task<IActionResult> UpdateNumberOfAppliances([FromBody] ReportAppliances report)
    {
        try
        {
            var data = await _reportsRepository.UpdateNumberOfAppliances(
                report.reportId,
                report.applianceId,
                report.numberOfAppliances
            );
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //update reportId
    [HttpPatch]
    [Route("updateReportId/{reportId}/{newReportId}")]
    public async Task<IActionResult> UpdateReportId([FromRoute] int reportId, int newReportId)
    {
        try
        {
            var data = await _reportsRepository.UpdateReportId(reportId, newReportId);
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //update applianceId
    [HttpPatch]
    [Route("updateApplianceId/{applianceId}/{newApplianceId}")]
    public async Task<IActionResult> UpdateApplianceId(
        [FromRoute] int applianceId,
        int newApplianceId
    )
    {
        try
        {
            var data = await _reportsRepository.UpdateApplianceId(applianceId, newApplianceId);
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //delete a reportId
    [HttpDelete]
    [Route("deleteReportId/{reportId}")]
    public async Task<IActionResult> DeleteReportId([FromRoute] int reportId)
    {
        try
        {
            var data = await _reportsRepository.DeleteReportId(reportId);
            if (data == false)
            {
                return StatusCode(
                    404,
                    "Report appliance with reportId: " + reportId + " not found"
                );
            }
            return Ok("Deleted report appliance with reportId: " + reportId + " successfully");
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //delete a applianceId
    [HttpDelete]
    [Route("deleteApplianceId/{applianceId}")]
    public async Task<IActionResult> DeleteApplianceId([FromRoute] int applianceId)
    {
        try
        {
            var data = await _reportsRepository.DeleteApplianceId(applianceId);
            if (data == false)
            {
                return StatusCode(
                    404,
                    "Report appliance with applianceId: " + applianceId + " not found"
                );
            }
            return Ok(
                "Deleted report appliance with applianceId: " + applianceId + " successfully"
            );
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //delete a reportApplianceId
    [HttpDelete]
    [Route("deleteReportAppliance/{reportId}/{applianceId}")]
    public async Task<IActionResult> DeleteReportAppliance(
        [FromRoute] int reportId,
        int applianceId
    )
    {
        try
        {
            var data = await _reportsRepository.DeleteReportAppliance(reportId, applianceId);
            if (data == false)
            {
                return StatusCode(
                    404,
                    "Report appliance with reportId: "
                        + reportId
                        + " and applianceId: "
                        + applianceId
                        + " not found"
                );
            }
            return Ok(
                "Deleted report appliance with reportId: "
                    + reportId
                    + " and applianceId: "
                    + applianceId
                    + " successfully"
            );
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
}
