using System.Net;
using Microsoft.AspNetCore.Mvc;
using Api.Repository;
using IronPython.Hosting;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class SolarScoreController : ControllerBase{

    [HttpGet]
    [Route("all")]
    public async Task<IActionResult> GetAllSolarScores()
    {
        try
        {
      string hello = "";
            var engine = Python.CreateEngine(); // Extract Python language engine from their grasp
            var scope = engine.CreateScope(); // Introduce Python namespace (scope)
      var d = new Dictionary<string, object>
            {
                { "hello", hello}
            }; // Add some sample parameters. Notice that there is no need in specifically setting the object type, interpreter will do that part for us in the script properly with high probability

      return Ok();
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
}
