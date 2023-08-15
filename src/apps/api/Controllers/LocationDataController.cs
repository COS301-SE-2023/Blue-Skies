using System.Net;
using Microsoft.AspNetCore.Mvc;
using Api.Repository;



namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class LocationDataController : ControllerBase
{
    private readonly LocationDataRepository _locationDataRepository;

    public LocationDataController()
    {
        _locationDataRepository = new LocationDataRepository();
    }

    [HttpGet]
    [Route("mapboxkey")]
    public async Task<IActionResult> GetMapBoxKey()
    {
        try
        {
            var key = await _locationDataRepository.GetMapBoxApiKey();
            return Ok(key);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
    [HttpGet]
    [Route("googlemapskey")]
    public async Task<IActionResult> GetGoogleMapsKey()
    {
        try
        {
            var key = await _locationDataRepository.GetGoogleMapsKey();
            return Ok(key);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }


    [HttpGet]
    [Route("getsuntimes")]
    public async Task<IActionResult> GetSunTimes([FromBody] Coordinates cord)
    {
        try
        {
            string sumTimes = await _locationDataRepository.GetSunTimes(cord);
            return Ok(sumTimes);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpPost]
    [Route("createLocationData")]
    public async Task<IActionResult> CreateLocationData([FromBody] LocationDataCreate locationData)
    {
        try
        {
            string data = await _locationDataRepository.CreateLocationData(locationData.coordinates.latitude, locationData.coordinates.longitude, locationData.location);
            if (data.Equals("Solar Irradiation already exists"))
            {
                return StatusCode(400, "Solar Irradiation already exists for this location");
            }
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpGet]
    [Route("getDataLocationData/{latitude}/{longitude}")]
    public async Task<IActionResult> getDataLocationData(double latitude, double longitude)
    {
        try
        {
            SolarIrradiation data = await _locationDataRepository.GetSolarIrradiation(latitude, longitude);
            if (data == null)
            {
                return StatusCode(404, "Solar Irradiation not found");
            }
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }


    [HttpPatch]
    [Route("updateSolarIrradiation")]
    public async Task<IActionResult> UpdateSolarIrradiation([FromBody] SolarIrradiation solarIrradiation)
    {
        try
        {
            string data = await _locationDataRepository.UpdateSolarIrradiation(solarIrradiation.latitude, solarIrradiation.longitude, solarIrradiation.data, solarIrradiation.remainingCalls);
            if (data.Equals("Solar Irradiation not found"))
            {
                return StatusCode(404, "Solar Irradiation not found");
            }
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpGet]
    [Route("getSolarIrradiationData")]
    public async Task<IActionResult> GetSolarIrradiationData([FromBody] SolarData sd)
    {
        try
        {
            string data = await _locationDataRepository.GetSolarIrradiationData(sd.latitude, sd.longitude, sd.numYears, sd.numDaysPerYear);
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

}
