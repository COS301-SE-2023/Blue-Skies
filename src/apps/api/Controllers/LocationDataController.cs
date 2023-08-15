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



    [HttpGet]
    [Route("getLocationData/{latitude}/{longitude}")]
    public async Task<IActionResult> GetLocationData([FromRoute] double latitude, [FromRoute] double longitude)
    {
        try
        {
            LocationData data = await _locationDataRepository.GetLocationData(latitude, longitude);
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

    [HttpGet]
    [Route("getLocationDataWithoutImage/{latitude}/{longitude}")]
    public async Task<IActionResult> GetLocationDataWithoutImage([FromRoute] double latitude, [FromRoute] double longitude)
    {
        try
        {
            LocationData data = await _locationDataRepository.GetSolarIrradiationWithoutImage(latitude, longitude);
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
    [HttpPost]
    [Route("create")]
    public async Task<IActionResult> CreateLocationData([FromBody] LocationDataCreate locationData)
    {
        try
        {
            if (locationData.coordinates == null)
            {
                return StatusCode(400, "Missing data");
            }
            string data = await _locationDataRepository.CreateLocationData(locationData.coordinates.latitude, locationData.coordinates.longitude, locationData.location!);
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
    [HttpPatch]
    [Route("update/data/{latitude}/{longitude}")]
    public async Task<IActionResult> UpdateSolarIrradiation([FromRoute] double latitude, [FromRoute] double longitude, [FromBody] LocationData locationData)
    {
        try
        {
            string data = await _locationDataRepository.UpdateDataLocationData(latitude, longitude, locationData.data!, locationData.remainingCalls!);
            if (data.Equals("LocationData not found"))
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
    [Route("update/image/{latitude}/{longitude}")]
    public async Task<IActionResult> UpdateImage([FromRoute] double latitude, [FromRoute] double longitude, [FromBody] LocationData locationData)
    {
        try
        {
            string data = await _locationDataRepository.UpdateImageLocationData(latitude, longitude, locationData.image!);
            if (data.Equals("LocationData not found"))
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
    [Route("update/daylightHours/{latitude}/{longitude}")]
    public async Task<IActionResult> UpdateDaylightHours([FromRoute] double latitude, double longitude, [FromBody] LocationData locationData)
    {
        try
        {
            string data = await _locationDataRepository.UpdateDaylightHoursLocationData(latitude, longitude, locationData.daylightHours!);
            if (data.Equals("LocationData not found"))
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


    [HttpDelete]
    [Route("delete/{latitude}/{longitude}")]
    public async Task<IActionResult> DeleteLocationData([FromRoute] double latitude, [FromRoute] double longitude)
    {
        try
        {
            string data = await _locationDataRepository.DeleteLocationData(latitude, longitude);
            if (data.Equals("LocationData not found"))
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
}
