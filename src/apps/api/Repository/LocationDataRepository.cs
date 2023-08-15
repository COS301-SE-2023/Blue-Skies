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
        var request = new HttpRequestMessage(HttpMethod.Get, express + "/api/locationData/mapboxkey");
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
        var request = new HttpRequestMessage(HttpMethod.Get, express + "/api/locationData/googlemapskey");
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

    //Get sun times
    public async Task<string> GetSunTimes(Coordinates coordinates)
    {
        var client = new HttpClient();
        var request = new HttpRequestMessage(
            HttpMethod.Get,
            express + "/api/solarscore/getsuntimes/"
        );
        var content = new StringContent(
            "{\r\n    \"latitude\": "
                + coordinates.latitude
                + ",\r\n    \"longitude\": "
                + coordinates.longitude
                + "\r\n}",
            null,
            "application/json"
        );
        request.Content = content;
        var response = await client.SendAsync(request);
        if (response.IsSuccessStatusCode)
        {
            string data = response.Content.ReadAsStringAsync().Result;
            return data;
        }
        else
        {
            throw new Exception("Error getting sun times");
        }
    }


    //Create Solar Irradiation
    public async Task<string> CreateLocationData(double latitude, double longitude, string location)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Post, express + "/api/locationData/create");
            var content = new StringContent("{\r\n    \"latitude\": " + latitude + ",\r\n    \"longitude\": " + longitude + ",\r\n    \"location\": \"" + location + "\"\r\n}", null, "application/json"); request.Content = content;
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                return "Solar Irradiation created successfully";
            }
            else if (response.StatusCode == HttpStatusCode.BadRequest)
            {
                return "Solar Irradiation already exists";
            }
            else
            {
                throw new Exception("Error creating solar irradiation");
            }
        }
        catch (System.Exception)
        {

            throw new Exception("Could not create solar irradiation");
        }
    }

    //Get solar irradiation
    public async Task<LocationData> GetLocationData(double latitude, double longitude)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Get, express + "/api/locationData/" + latitude + "/" + longitude);
            var response = await client.SendAsync(request);


            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine("Success");
                string data = response.Content.ReadAsStringAsync().Result;
                LocationData locationData = JsonSerializer.Deserialize<LocationData>(data)!;
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

    //GetSolarIrradiationWithoutImage
    public async Task<LocationData> GetSolarIrradiationWithoutImage(double latitude, double longitude)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Get, express + "/api/locationData/withoutImage/" + latitude + "/" + longitude);
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                string data = response.Content.ReadAsStringAsync().Result;
                LocationData locationData = JsonSerializer.Deserialize<LocationData>(data)!;
                return locationData!;
            }
        }
        catch (System.Exception)
        {

            throw new Exception("Could not get solar irradiation without image");
        }
        return null!;
    }

    //Update the data in LocationData
    public async Task<string> UpdateDataLocationData(double latitude, double longitude, string data, int remainingCalls)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Patch, express + "/api/locationData/update/data/" + latitude + "/" + longitude);
            var content = new StringContent("{\r\n    \"data\": \"" + data + "\",\r\n    \"remainingCalls\": " + remainingCalls + "\r\n}", null, "application/json");
            request.Content = content;
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                return "Data in LocationData updated successfully";
            }
            else if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return "LocationData not found";
            }
            else
            {
                throw new Exception("Error updating data in LocationData");
            }
        }
        catch (System.Exception)
        {

            throw new Exception("Could not update data in LocationData");
        }
    }

    //Update the image in LocationData
    public async Task<string> UpdateImageLocationData(double latitude, double longitude, string image)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Patch, express + "/api/locationData/update/image/" + latitude + "/" + longitude);
            var content = new StringContent("{\r\n    \"image\": \"" + image + "\"\r\n}", null, "application/json");
            request.Content = content;
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                return "Image in LocationData updated successfully";
            }
            else if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return "LocationData not found";
            }
            else
            {
                throw new Exception("Error updating Image in LocationData");
            }
        }
        catch (System.Exception)
        {

            throw new Exception("Could not update image in LocationData");
        }
    }

    //Update the daylightHours in LocationData
    public async Task<string> UpdateDaylightHoursLocationData(double latitude, double longitude, double daylightHours)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Patch, express + "/api/locationData/update/daylightHours/" + latitude + "/" + longitude);
            var content = new StringContent("{\r\n    \"daylightHours\": " + daylightHours + "\r\n}", null, "application/json");
            request.Content = content;
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                return "DaylightHours in LocationData updated successfully";
            }
            else if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return "LocationData not found";
            }
            else
            {
                throw new Exception("Error updating DaylightHours in LocationData");
            }
        }
        catch (System.Exception)
        {

            throw new Exception("Could not update DaylightHours in LocationData");
        }
    }


    //Get Solar Irradiation Data
    public async Task<string> GetSolarIrradiationData(double latitude, double longitude, int numYears, int numDaysPerYear)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Get, express + "/api/locationData/solarIrradiationData");
            var content = new StringContent("{\r\n    \"latitude\": " + latitude + ",\r\n    \"longitude\": " + longitude + ",\r\n    \"numYears\": " + numYears + ",\r\n    \"numDaysPerYear\": " + numDaysPerYear + "\r\n}", null, "application/json");
            request.Content = content;
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                string data = response.Content.ReadAsStringAsync().Result;
                return data;
            }
            else
            {
                throw new Exception("Error getting solar irradiation data");
            }
        }
        catch (System.Exception)
        {

            throw new Exception("Could not get solar irradiation data");
        }
    }
}


