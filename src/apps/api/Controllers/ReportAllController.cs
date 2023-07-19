using System.Net;
using Microsoft.AspNetCore.Mvc;
using Api.Repository;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ReportAllController : ControllerBase
{
    private readonly ReportAllRepository _reportAllRepository;

    public ReportAllController()
    {
        _reportAllRepository = new ReportAllRepository();
    }

    [HttpGet]
    [Route("all")]
    public async Task<IActionResult> GetAllReportAll()
    {
        try
        {
            var data = await _reportAllRepository.GetAllReportAll();
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //get a reportAll by reportId
    [HttpGet]
    [Route("get/{id}")]
    public async Task<IActionResult> GetReport([FromRoute] int id)
    {
        Console.WriteLine("reportId: " + id);
        try
        {
            var data = await _reportAllRepository.getReportById(id);
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

    //get a reportAll by userId
    [HttpGet]
    [Route("user/{id}")]
    public async Task<IActionResult> GetReportUser([FromRoute] int id)
    {
        try
        {
            var data = await _reportAllRepository.getReportByUserId(id);
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
