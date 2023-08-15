using System.Net;
using Microsoft.AspNetCore.Mvc;
using Api.Repository;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class LocationController : ControllerBase
{
    private readonly LocationsRepository _locationsRepository;

    public LocationController()
    {
        _locationsRepository = new LocationsRepository();
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllLocations()
    {
        try
        {
            var locations = await _locationsRepository.GetAllLocations();
            return Ok(locations);
        }
        catch (Exception e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    [HttpGet("get/{locationId}")]
    public async Task<IActionResult> GetLocation([FromRoute] int locationId)
    {
        try
        {
            var location = await _locationsRepository.GetLocation(locationId);
            return Ok(location);
        }
        catch (Exception e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    //create location
    [HttpPost("create")]
    public async Task<IActionResult> CreateLocation([FromBody] Locations locations)
    {
        try
        {
            Console.WriteLine("Location: " + locations.latitude);
            var location = await _locationsRepository.CreateLocation(
                locations.latitude,
                locations.longitude
            );
            return Ok(location);
        }
        catch (Exception e)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
        }
    }

    //Delete a location
    [HttpDelete]
    [Route("delete/{locationId}")]
    public async Task<IActionResult> DeleteLocation([FromRoute] int locationId)
    {
        try
        {
            var data = await _locationsRepository.DeleteLocations(locationId);
            if (data == false)
            {
                return StatusCode(404, "Location with id: " + locationId + " does not exist");
            }
            return Ok("Deleted location with id: " + locationId);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //Update a location
    [HttpPatch]
    [Route("update")]
    public async Task<IActionResult> UpdateLocation([FromBody] Locations location)
    {
        try
        {
            var data = await _locationsRepository.UpdateLocations(
                location.locationId,
                location.latitude,
                location.longitude
            );
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
}
