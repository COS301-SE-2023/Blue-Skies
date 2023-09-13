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
    [Route("GetLocationData/{latitude}/{longitude}")]
    public async Task<IActionResult> GetLocationData(
        [FromRoute] double latitude,
        [FromRoute] double longitude
    )
    {
        try
        {
            LocationDataModel data = await _locationDataRepository.GetLocationData(latitude, longitude);
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
    public async Task<IActionResult> CreateLocationData([FromBody] LocationDataModel locationData)
    {
        try
        {
            string data = await _locationDataRepository.CreateLocationData(
                locationData.latitude,
                locationData.longitude,
                locationData.locationName!,
                locationData.solarPanelsData!,
                locationData.satteliteImageData!,
                locationData.satteliteImageElevationData!,
                locationData.annualFluxData!,
                locationData.monthlyFluxData!,
                locationData.maskData!,
                locationData.daylightHours,
                locationData.horisonElevationData!
            );
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



    [HttpDelete]
    [Route("delete/{latitude}/{longitude}")]
    public async Task<IActionResult> DeleteLocationData(
        [FromRoute] double latitude,
        [FromRoute] double longitude
    )
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
