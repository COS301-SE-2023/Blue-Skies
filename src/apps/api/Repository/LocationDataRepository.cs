using System.Net;
using System.Text.Json;
using System;

namespace Api.Repository;

public class LocationDataRepository
{
    private readonly string express = "http://localhost:3333";

    public LocationDataRepository()
    {
        var backendexpress = Environment.GetEnvironmentVariable("EXPRESS_BACKEND");
        if (backendexpress != null)
        {
            express = backendexpress;
        }
    }

    public async Task<string> GetMapBoxApiKey()
    {
        var client = new HttpClient();
        var request = new HttpRequestMessage(
            HttpMethod.Get,
            express + "/api/locationData/mapboxkey"
        );
        var response = await client.SendAsync(request);
        // response.EnsureSuccessStatusCode();
        // Console.WriteLine(await response.Content.ReadAsStringAsync());
        if (response.IsSuccessStatusCode)
        {
            return await response.Content.ReadAsStringAsync();
        }
        else
        {
            throw new Exception("Error getting mapbox key");
        }
    }

    public async Task<string> GetGoogleMapsKey()
    {
        var client = new HttpClient();
        var request = new HttpRequestMessage(
            HttpMethod.Get,
            express + "/api/locationData/googlemapskey"
        );
        var response = await client.SendAsync(request);
        // response.EnsureSuccessStatusCode();
        // Console.WriteLine(await response.Content.ReadAsStringAsync());
        if (response.IsSuccessStatusCode)
        {
            return await response.Content.ReadAsStringAsync();
        }
        else
        {
            throw new Exception("Error getting google maps key");
        }
    }

    //Create Solar Irradiation
    public async Task<string> CreateLocationData(
        double latitude,
        double longitude,
        string locationName,
        string solarPanelsData,
        byte[] satteliteImageData,
        byte[] satteliteImageElevationData,
        byte[] annualFluxData,
        byte[] monthlyFluxData,
        byte[] maskData,
        double daylightHours,
        string horisonElevationData
    )
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Post,
                express + "/api/locationData/create"
            );
           var postData = new{
                latitude = latitude.ToString(),
                longitude = longitude.ToString(),
                locationName = locationName,
                solarPanelsData = solarPanelsData,
                satteliteImageData = satteliteImageData,
                satteliteImageElevationData = satteliteImageElevationData,
                annualFluxData = annualFluxData,
                monthlyFluxData = monthlyFluxData,
                maskData = maskData,
                daylightHours = daylightHours.ToString(),
                horisonElevationData = horisonElevationData
            };
            var json = JsonSerializer.Serialize(postData);
            request.Content = new StringContent(json, null, "application/json");
            // Console.WriteLine(await request.Content.ReadAsStringAsync());
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                return "LocationData created successfully";
            }
            else if (response.StatusCode == HttpStatusCode.BadRequest)
            {
                Console.WriteLine("LocationData already exists");
                return "LocationData already exists";
            }
            else
            {
                throw new Exception("Error creating LocationData");
            }
           
        }
        catch (System.Exception)
        {
            throw new Exception("Could not create solar irradiation");
        }
    }

    //Get solar irradiation
    public async Task<LocationDataModel> GetLocationData(double latitude, double longitude)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                express + "/api/locationData/" + latitude + "/" + longitude
            );
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                // Console.WriteLine("Success");
                string data = response.Content.ReadAsStringAsync().Result;
                LocationDataModel locationData = JsonSerializer.Deserialize<LocationDataModel>(data)!;
                return locationData!;
            }
            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return null!;
            }
            else
            {
                throw new Exception("Error getting solar irradiation");
            }
        }
        catch (System.Exception)
        {
            throw new Exception("Could not get solar irradiation");
        }
    }


    //DeleteLocationData
    public async Task<string> DeleteLocationData(double latitude, double longitude)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Delete,
                express + "/api/locationData/delete/" + latitude + "/" + longitude
            );
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                return "LocationData deleted successfully";
            }
            else if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return "LocationData not found";
            }
            else
            {
                throw new Exception("Error deleting LocationData");
            }
        }
        catch (System.Exception)
        {
            throw new Exception("Could not delete LocationData");
        }
    }
}
