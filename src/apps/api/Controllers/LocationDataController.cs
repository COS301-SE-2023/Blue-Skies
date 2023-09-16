using System.Net;
using Microsoft.AspNetCore.Mvc;
using Api.Repository;
using System.Text.Json;

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
    [Route("chatbotapikey")]
    public async Task<IActionResult> GetChatbotApiKey()
    {
        try
        {
            var key = await _locationDataRepository.GetChatbotApiKey();
            return Ok(key);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
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

    // GetInitialLocationData
    [HttpGet]
    [Route("EssentialData/{latitude}/{longitude}")]
    public async Task<IActionResult> GetInitialLocationData(
        [FromRoute] double latitude,
        [FromRoute] double longitude
    )
    {
        try
        {
            LocationDataModel data = await _locationDataRepository.EssentialLocationData(latitude, longitude);
            if (data == null)
            {
                return StatusCode(400, "Could not get essential locatino data");
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
                JsonSerializer.Serialize(locationData.solarPanelsData!),
                locationData.satteliteImageData!,
                locationData.satteliteImageElevationData!,
                locationData.annualFluxData!,
                locationData.monthlyFluxData!,
                locationData.maskData!,
                locationData.daylightHours,
                locationData.horisonElevationData!
            );
            if (data.Equals("LocationData created successfully"))
            {
                return Ok(data);
            }
            return StatusCode(400, data);
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

    // checkIfLocationDataExists
    [HttpGet]
    [Route("checkIfLocationDataExists/{latitude}/{longitude}")]
    public async Task<IActionResult> CheckIfLocationDataExists(
        [FromRoute] double latitude,
        [FromRoute] double longitude
    )
    {
        try
        {
            bool data = await _locationDataRepository.CheckIfLocationDataExists(latitude, longitude);
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
}
