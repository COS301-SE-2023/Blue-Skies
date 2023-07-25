using System.Net;
using Microsoft.AspNetCore.Mvc;
using Api.Repository;
//using IronPython.Hosting;
// using Microsoft.Scripting.Hosting;

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
            // string hello = "";
            // var engine = Python.CreateEngine(); // Extract Python language engine from their grasp
            // var scope = engine.CreateScope(); // Introduce Python namespace (scope)
            // scope.SetVariable("hello", hello);
            // ScriptSource source = engine.CreateScriptSourceFromFile("../Scripts/hello.py"); // Load the script
            // object result = source.Execute(scope);
            // hello = scope.GetVariable<string>("hello");

            return Ok();
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
}
